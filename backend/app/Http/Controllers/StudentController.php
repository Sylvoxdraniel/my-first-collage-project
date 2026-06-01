<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Student::with(['user', 'department']);

        // Search support
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('enrollment_no', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by department
        if ($request->has('department_id') && $request->input('department_id') !== 'all') {
            $query->where('department_id', $request->input('department_id'));
        }

        // Filter by semester
        if ($request->has('semester') && $request->input('semester') !== 'all') {
            $query->where('semester', $request->input('semester'));
        }

        $students = $query->latest()->get();

        return response()->json($students);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'enrollment_no' => 'required|string|max:50|unique:students,enrollment_no',
            'department_id' => 'required|exists:departments,id',
            'semester' => 'required|integer|min:1|max:8',
            'dob' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'admission_date' => 'required|date',
        ]);

        $student = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'plain_password' => $validated['password'],
                'role' => 'student',
            ]);

            return Student::create([
                'user_id' => $user->id,
                'enrollment_no' => $validated['enrollment_no'],
                'department_id' => $validated['department_id'],
                'semester' => $validated['semester'],
                'dob' => $validated['dob'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'admission_date' => $validated['admission_date'],
            ]);
        });

        return response()->json([
            'message' => 'Student created successfully.',
            'student' => $student->load(['user', 'department']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $student = Student::with(['user', 'department', 'attendances.course', 'results.exam.course'])
            ->findOrFail($id);

        return response()->json($student);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $student = Student::findOrFail($id);
        $user = $student->user;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'enrollment_no' => 'required|string|max:50|unique:students,enrollment_no,' . $student->id,
            'department_id' => 'required|exists:departments,id',
            'semester' => 'required|integer|min:1|max:8',
            'dob' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'admission_date' => 'required|date',
        ]);

        DB::transaction(function () use ($student, $user, $validated) {
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];

            if (!empty($validated['password'])) {
                $userData['password'] = $validated['password'];
                $userData['plain_password'] = $validated['password'];
            }

            $user->update($userData);

            $student->update([
                'enrollment_no' => $validated['enrollment_no'],
                'department_id' => $validated['department_id'],
                'semester' => $validated['semester'],
                'dob' => $validated['dob'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'admission_date' => $validated['admission_date'],
            ]);
        });

        return response()->json([
            'message' => 'Student updated successfully.',
            'student' => $student->fresh(['user', 'department']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $student = Student::findOrFail($id);
        $user = $student->user;

        DB::transaction(function () use ($student, $user) {
            $student->delete();
            $user->delete();
        });

        return response()->json([
            'message' => 'Student deleted successfully.',
        ]);
    }
}
