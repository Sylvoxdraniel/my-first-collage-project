<?php

namespace App\Http\Controllers;

use App\Models\Admission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdmissionController extends Controller
{
    /**
     * Display a listing of applications for Admin.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Admission::query();

        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('student_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('mobile_number', 'like', "%{$search}%");
            });
        }

        $admissions = $query->orderBy('created_at', 'desc')->get();

        return response()->json($admissions);
    }

    /**
     * Submit an admission application (Public).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'mother_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'mobile_number' => 'required|string|max:15',
            'gender' => 'required|string|max:20',
            'dob' => 'required|date',
            'address' => 'required|string',
            'course_selection' => 'required|string|max:255',
            'category' => 'required|string|max:50',
            'aadhaar_number' => 'required|string|max:20',
            'document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
        ]);

        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $destinationPath = public_path('uploads/admissions');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            $file->move($destinationPath, $filename);
            $validated['document_path'] = '/uploads/admissions/' . $filename;
        }

        unset($validated['document']);
        $validated['status'] = 'pending';

        $admission = Admission::create($validated);

        return response()->json([
            'message' => 'Your online admission form has been submitted successfully!',
            'admission' => $admission
        ], 201);
    }

    /**
     * Display details of a specific application (Admin).
     */
    public function show(string $id): JsonResponse
    {
        $admission = Admission::findOrFail($id);
        return response()->json($admission);
    }

    /**
     * Update status of an application (Admin).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $admission = Admission::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $oldStatus = $admission->status;

        $admission->update($validated);

        if ($validated['status'] === 'approved' && $oldStatus !== 'approved') {
            // Check if user already exists
            $existingUser = \App\Models\User::where('email', $admission->email)
                ->orWhere('mobile_number', $admission->mobile_number)
                ->first();

            if (!$existingUser) {
                // Find department matching course selection, default to first department
                $course = \App\Models\Course::where('name', 'like', "%{$admission->course_selection}%")->first();
                $departmentId = $course ? $course->department_id : (\App\Models\Department::first()->id ?? 1);

                // Generate enrollment number: STU + Year + padded ID
                $enrollmentNo = 'STU' . date('Y') . str_pad($admission->id, 4, '0', STR_PAD_LEFT);

                // Generate temporary password
                $tempPassword = \Illuminate\Support\Str::random(10);

                \Illuminate\Support\Facades\DB::transaction(function () use ($admission, $enrollmentNo, $departmentId, $tempPassword) {
                    $user = \App\Models\User::create([
                        'name' => $admission->student_name,
                        'email' => $admission->email,
                        'mobile_number' => $admission->mobile_number,
                        'password' => $tempPassword,
                        'plain_password' => $tempPassword,
                        'role' => 'student',
                    ]);

                    \App\Models\Student::create([
                        'user_id' => $user->id,
                        'enrollment_no' => $enrollmentNo,
                        'department_id' => $departmentId,
                        'semester' => 1,
                        'dob' => $admission->dob,
                        'phone' => $admission->mobile_number,
                        'address' => $admission->address,
                        'admission_date' => now()->toDateString(),
                    ]);

                    // Send Login details simulation: SMS & Email
                    \Illuminate\Support\Facades\Log::info("SMS sent to {$admission->mobile_number}: Dear {$admission->student_name}, your admission is approved. Login ID: {$admission->email} or {$admission->mobile_number}, Pass: {$tempPassword}");

                    \Illuminate\Support\Facades\Log::info("Email sent to {$admission->email}: Dear {$admission->student_name}, your admission is approved. Login ID: {$admission->email} or {$admission->mobile_number}, Pass: {$tempPassword}");
                });
            }
        }

        return response()->json([
            'message' => 'Admission application updated successfully.',
            'admission' => $admission,
        ]);
    }

    /**
     * Lookup a student by Aadhaar number (Public – for payment pre-fill).
     */
    public function lookupByAadhaar(Request $request): JsonResponse
    {
        $aadhaar = $request->input('aadhaar');

        if (!$aadhaar) {
            return response()->json(['error' => 'Aadhaar number is required.'], 422);
        }

        $admission = Admission::where('aadhaar_number', $aadhaar)
            ->orderBy('created_at', 'desc')
            ->select('student_name', 'father_name', 'email', 'mobile_number', 'course_selection', 'category', 'aadhaar_number')
            ->first();

        if (!$admission) {
            return response()->json(['error' => 'No application found with this Aadhaar number. Please fill the admission form first.'], 404);
        }

        return response()->json($admission);
    }

    /**
     * Delete an application (Admin).
     */
    public function destroy(string $id): JsonResponse
    {
        $admission = Admission::findOrFail($id);

        // Optional: delete document from disk if it exists
        if ($admission->document_path && file_exists(public_path($admission->document_path))) {
            unlink(public_path($admission->document_path));
        }

        $admission->delete();

        return response()->json([
            'message' => 'Admission application deleted successfully.',
        ]);
    }
}
