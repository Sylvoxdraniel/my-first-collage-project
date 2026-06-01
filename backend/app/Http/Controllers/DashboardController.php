<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Faculty;
use App\Models\Course;
use App\Models\Department;
use App\Models\Attendance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get statistics for the dashboard.
     */
    public function index(): JsonResponse
    {
        $totalStudents = Student::count();
        $totalFaculty = Faculty::count();
        $totalCourses = Course::count();
        $totalDepartments = Department::count();

        // Get recent students with user and department
        $recentStudents = Student::with(['user', 'department'])
            ->latest()
            ->limit(5)
            ->get();

        // Enrollment by department
        $enrollmentByDepartment = Department::withCount('students')
            ->get()
            ->map(function ($dept) {
                return [
                    'name' => $dept->name,
                    'value' => $dept->students_count,
                ];
            });

        // Attendance stats (overall rates)
        $attendanceStats = DB::table('attendances')
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->pluck('total', 'status')
            ->toArray();

        $presentCount = $attendanceStats['present'] ?? 0;
        $absentCount = $attendanceStats['absent'] ?? 0;
        $lateCount = $attendanceStats['late'] ?? 0;
        $totalAttendance = $presentCount + $absentCount + $lateCount;

        $attendanceOverview = [
            [
                'name' => 'Present',
                'value' => $totalAttendance > 0 ? round(($presentCount / $totalAttendance) * 100, 1) : 0,
            ],
            [
                'name' => 'Absent',
                'value' => $totalAttendance > 0 ? round(($absentCount / $totalAttendance) * 100, 1) : 0,
            ],
            [
                'name' => 'Late',
                'value' => $totalAttendance > 0 ? round(($lateCount / $totalAttendance) * 100, 1) : 0,
            ],
        ];

        return response()->json([
            'stats' => [
                'students' => $totalStudents,
                'faculty' => $totalFaculty,
                'courses' => $totalCourses,
                'departments' => $totalDepartments,
            ],
            'recentStudents' => $recentStudents,
            'enrollmentByDepartment' => $enrollmentByDepartment,
            'attendanceOverview' => $attendanceOverview,
        ]);
    }
}
