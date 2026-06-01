<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Course;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Attendance::with(['student.user', 'course']);

        if ($request->has('date')) {
            $query->where('date', $request->input('date'));
        }

        if ($request->has('course_id')) {
            $query->where('course_id', $request->input('course_id'));
        }

        if ($request->has('student_id')) {
            $query->where('student_id', $request->input('student_id'));
        }

        $attendance = $query->get();

        return response()->json($attendance);
    }

    /**
     * Fetch attendance records for a specific date and course, 
     * and list all students of that course to allow marking/editing.
     */
    public function getByDate(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'required|date',
            'course_id' => 'required|exists:courses,id',
        ]);

        $date = $request->input('date');
        $courseId = $request->input('course_id');

        // Find course to get department & semester
        $course = Course::findOrFail($courseId);

        // Fetch students belonging to the department and matching semester
        $students = Student::with('user')
            ->where('department_id', $course->department_id)
            ->where('semester', $course->semester)
            ->get();

        // Fetch existing attendance records
        $existingRecords = Attendance::where('date', $date)
            ->where('course_id', $courseId)
            ->get()
            ->keyBy('student_id');

        $result = $students->map(function ($student) use ($existingRecords) {
            $record = $existingRecords->get($student->id);
            return [
                'student_id' => $student->id,
                'name' => $student->user->name,
                'enrollment_no' => $student->enrollment_no,
                'status' => $record ? $record->status : 'present', // Default to present if not marked
                'attendance_id' => $record ? $record->id : null,
            ];
        });

        return response()->json($result);
    }

    /**
     * Batch store / mark attendance.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'course_id' => 'required|exists:courses,id',
            'attendance' => 'required|array',
            'attendance.*.student_id' => 'required|exists:students,id',
            'attendance.*.status' => 'required|in:present,absent,late',
        ]);

        $date = $validated['date'];
        $courseId = $validated['course_id'];
        $records = [];

        foreach ($validated['attendance'] as $att) {
            $record = Attendance::updateOrCreate(
                [
                    'date' => $date,
                    'course_id' => $courseId,
                    'student_id' => $att['student_id'],
                ],
                [
                    'status' => $att['status'],
                ]
            );
            $records[] = $record;
        }

        return response()->json([
            'message' => 'Attendance saved successfully.',
            'count' => count($records),
        ]);
    }

    /**
     * Get attendance summary for a student.
     */
    public function studentAttendance(string $studentId): JsonResponse
    {
        $attendance = Attendance::with('course')
            ->where('student_id', $studentId)
            ->get();

        $total = $attendance->count();
        $present = $attendance->where('status', 'present')->count();
        $absent = $attendance->where('status', 'absent')->count();
        $late = $attendance->where('status', 'late')->count();

        $rate = $total > 0 ? round((($present + ($late * 0.5)) / $total) * 100, 1) : 100;

        return response()->json([
            'summary' => [
                'total' => $total,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'percentage' => $rate,
            ],
            'records' => $attendance,
        ]);
    }
}
