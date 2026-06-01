<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $departments = Department::with(['head.user'])
            ->withCount(['students', 'faculty', 'courses'])
            ->get();

        return response()->json($departments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:departments,code',
            'description' => 'nullable|string',
            'head_id' => 'nullable|exists:faculty,id',
            'labs' => 'nullable|string',
            'outcomes' => 'nullable|string',
            'careers' => 'nullable|string',
            'achievements' => 'nullable|string',
            'activities' => 'nullable|string',
        ]);

        $department = Department::create($validated);

        return response()->json([
            'message' => 'Department created successfully.',
            'department' => $department->load('head.user'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $department = Department::with(['head.user', 'students.user', 'faculty.user', 'courses'])
            ->withCount(['students', 'faculty', 'courses'])
            ->findOrFail($id);

        return response()->json($department);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $department = Department::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:departments,code,' . $id,
            'description' => 'nullable|string',
            'head_id' => 'nullable|exists:faculty,id',
            'labs' => 'nullable|string',
            'outcomes' => 'nullable|string',
            'careers' => 'nullable|string',
            'achievements' => 'nullable|string',
            'activities' => 'nullable|string',
        ]);

        $department->update($validated);

        return response()->json([
            'message' => 'Department updated successfully.',
            'department' => $department->load('head.user'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json([
            'message' => 'Department deleted successfully.',
        ]);
    }
}
