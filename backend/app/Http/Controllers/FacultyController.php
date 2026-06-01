<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Faculty::with(['user', 'department']);

        // Search support
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('employee_id', 'like', "%{$search}%")
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

        $faculty = $query->latest()->get();

        return response()->json($faculty);
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
            'employee_id' => 'required|string|max:50|unique:faculty,employee_id',
            'department_id' => 'required|exists:departments,id',
            'designation' => 'required|string|max:100',
            'qualification' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'joining_date' => 'required|date',
        ]);

        $facultyMember = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'plain_password' => $validated['password'],
                'role' => 'faculty',
            ]);

            return Faculty::create([
                'user_id' => $user->id,
                'employee_id' => $validated['employee_id'],
                'department_id' => $validated['department_id'],
                'designation' => $validated['designation'],
                'qualification' => $validated['qualification'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'joining_date' => $validated['joining_date'],
            ]);
        });

        return response()->json([
            'message' => 'Faculty member created successfully.',
            'faculty' => $facultyMember->load(['user', 'department']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $facultyMember = Faculty::with(['user', 'department', 'courses'])
            ->findOrFail($id);

        return response()->json($facultyMember);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $facultyMember = Faculty::findOrFail($id);
        $user = $facultyMember->user;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'employee_id' => 'required|string|max:50|unique:faculty,employee_id,' . $facultyMember->id,
            'department_id' => 'required|exists:departments,id',
            'designation' => 'required|string|max:100',
            'qualification' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'joining_date' => 'required|date',
        ]);

        DB::transaction(function () use ($facultyMember, $user, $validated) {
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];

            if (!empty($validated['password'])) {
                $userData['password'] = $validated['password'];
                $userData['plain_password'] = $validated['password'];
            }

            $user->update($userData);

            $facultyMember->update([
                'employee_id' => $validated['employee_id'],
                'department_id' => $validated['department_id'],
                'designation' => $validated['designation'],
                'qualification' => $validated['qualification'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'joining_date' => $validated['joining_date'],
            ]);
        });

        return response()->json([
            'message' => 'Faculty member updated successfully.',
            'faculty' => $facultyMember->fresh(['user', 'department']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $facultyMember = Faculty::findOrFail($id);
        $user = $facultyMember->user;

        DB::transaction(function () use ($facultyMember, $user) {
            $facultyMember->delete();
            $user->delete();
        });

        return response()->json([
            'message' => 'Faculty member deleted successfully.',
        ]);
    }
}
