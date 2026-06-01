<?php

namespace App\Http\Controllers;

use App\Models\Result;
use App\Models\Exam;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    /**
     * Display a listing of results, optionally filtered by exam.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Result::with(['exam.course', 'student.user']);

        if ($request->has('exam_id')) {
            $query->where('exam_id', $request->input('exam_id'));
        }

        $results = $query->get();

        return response()->json($results);
    }

    /**
     * Store or update results in batch for a specific exam.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'results' => 'required|array',
            'results.*.student_id' => 'required|exists:students,id',
            'results.*.marks_obtained' => 'required|numeric|min:0',
            'results.*.remarks' => 'nullable|string',
        ]);

        $examId = $validated['exam_id'];
        $exam = Exam::findOrFail($examId);
        $savedResults = [];

        foreach ($validated['results'] as $res) {
            // Cap obtained marks at total marks of the exam
            $marksObtained = min($res['marks_obtained'], $exam->total_marks);
            
            // Basic grade assignment helper
            $percentage = ($marksObtained / $exam->total_marks) * 100;
            $grade = 'F';
            if ($percentage >= 90) $grade = 'A+';
            elseif ($percentage >= 80) $grade = 'A';
            elseif ($percentage >= 70) $grade = 'B';
            elseif ($percentage >= 60) $grade = 'C';
            elseif ($percentage >= 50) $grade = 'D';

            $record = Result::updateOrCreate(
                [
                    'exam_id' => $examId,
                    'student_id' => $res['student_id'],
                ],
                [
                    'marks_obtained' => $marksObtained,
                    'grade' => $grade,
                    'remarks' => $res['remarks'] ?? null,
                ]
            );
            $savedResults[] = $record;
        }

        return response()->json([
            'message' => 'Results saved successfully.',
            'count' => count($savedResults),
        ]);
    }

    /**
     * Get all results for a specific student.
     */
    public function studentResults(string $studentId): JsonResponse
    {
        $results = Result::with(['exam.course'])
            ->where('student_id', $studentId)
            ->get();

        return response()->json($results);
    }
}
