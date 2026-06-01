<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Course::with(['department', 'faculty.user']);

        if ($request->has('department_id') && $request->input('department_id') !== 'all') {
            $query->where('department_id', $request->input('department_id'));
        }

        if ($request->has('semester') && $request->input('semester') !== 'all') {
            $query->where('semester', $request->input('semester'));
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $courses = $query->get();

        return response()->json($courses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:courses,code',
            'type' => 'required|string|in:ug,pg,phd',
            'department_id' => 'required|exists:departments,id',
            'faculty_id' => 'nullable|exists:faculty,id',
            'semester' => 'required|integer|min:1|max:8',
            'credits' => 'required|integer|min:1|max:6',
            'description' => 'nullable|string',
        ]);

        $course = Course::create($validated);

        return response()->json([
            'message' => 'Course created successfully.',
            'course' => $course->load(['department', 'faculty.user']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $course = Course::with(['department', 'faculty.user', 'exams', 'attendances.student.user'])
            ->findOrFail($id);

        return response()->json($course);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $course = Course::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:courses,code,' . $id,
            'type' => 'required|string|in:ug,pg,phd',
            'department_id' => 'required|exists:departments,id',
            'faculty_id' => 'nullable|exists:faculty,id',
            'semester' => 'required|integer|min:1|max:8',
            'credits' => 'required|integer|min:1|max:6',
            'description' => 'nullable|string',
        ]);

        $course->update($validated);

        return response()->json([
            'message' => 'Course updated successfully.',
            'course' => $course->load(['department', 'faculty.user']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully.',
        ]);
    }
}
