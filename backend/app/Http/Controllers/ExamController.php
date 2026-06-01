<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Exam::with(['course.department', 'course.faculty.user']);

        if ($request->has('course_id')) {
            $query->where('course_id', $request->input('course_id'));
        }

        $exams = $query->latest()->get();

        return response()->json($exams);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'date' => 'required|date',
            'total_marks' => 'required|integer|min:1',
            'exam_type' => 'required|in:midterm,final,quiz,assignment',
        ]);

        $exam = Exam::create($validated);

        return response()->json([
            'message' => 'Exam created successfully.',
            'exam' => $exam->load('course'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $exam = Exam::with(['course.department', 'results.student.user'])
            ->findOrFail($id);

        return response()->json($exam);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $exam = Exam::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'date' => 'required|date',
            'total_marks' => 'required|integer|min:1',
            'exam_type' => 'required|in:midterm,final,quiz,assignment',
        ]);

        $exam->update($validated);

        return response()->json([
            'message' => 'Exam updated successfully.',
            'exam' => $exam->load('course'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $exam = Exam::findOrFail($id);
        $exam->delete();

        return response()->json([
            'message' => 'Exam deleted successfully.',
        ]);
    }
}
