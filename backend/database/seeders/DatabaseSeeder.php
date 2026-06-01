<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Department;
use App\Models\Faculty;
use App\Models\Student;
use App\Models\Course;
use App\Models\Exam;
use App\Models\Result;
use App\Models\Attendance;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin User
        $adminUser = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@college.com',
            'password' => 'password', // Password hashing is handled automatically by cast in User Model (or manually if not cast)
            'role' => 'admin',
        ]);

        // 2. Create Departments
        $depts = [
            ['name' => 'Computer Science & Engineering', 'code' => 'CSE', 'description' => 'Department of Computer Science & Engineering focusing on software, algorithms, and systems.'],
            ['name' => 'Electronics & Communication', 'code' => 'ECE', 'description' => 'Department of Electronics & Communication Engineering covering signals, circuits, and networking.'],
            ['name' => 'Mechanical Engineering', 'code' => 'ME', 'description' => 'Department of Mechanical Engineering focusing on thermal, manufacturing, and machine design.'],
            ['name' => 'Civil Engineering', 'code' => 'CE', 'description' => 'Department of Civil Engineering covering infrastructure, structural design, and environments.'],
        ];

        $deptModels = [];
        foreach ($depts as $dept) {
            $deptModels[] = Department::create($dept);
        }

        // 3. Create Faculty Users and Profiles
        $facultyData = [
            ['name' => 'Dr. Alan Turing', 'email' => 'alan@college.com', 'designation' => 'Professor', 'qualification' => 'Ph.D. in Computer Science', 'employee_id' => 'FAC001', 'dept_idx' => 0],
            ['name' => 'Dr. Grace Hopper', 'email' => 'grace@college.com', 'designation' => 'Associate Professor', 'qualification' => 'Ph.D. in Mathematics', 'employee_id' => 'FAC002', 'dept_idx' => 0],
            ['name' => 'Dr. Richard Feynman', 'email' => 'richard@college.com', 'designation' => 'Professor', 'qualification' => 'Ph.D. in Physics', 'employee_id' => 'FAC003', 'dept_idx' => 1],
            ['name' => 'Dr. Nikola Tesla', 'email' => 'nikola@college.com', 'designation' => 'Assistant Professor', 'qualification' => 'M.Tech in Electrical Engineering', 'employee_id' => 'FAC004', 'dept_idx' => 1],
            ['name' => 'Dr. James Watt', 'email' => 'james@college.com', 'designation' => 'Professor', 'qualification' => 'Ph.D. in Thermodynamics', 'employee_id' => 'FAC005', 'dept_idx' => 2],
            ['name' => 'Dr. Thomas Telford', 'email' => 'thomas@college.com', 'designation' => 'Associate Professor', 'qualification' => 'Ph.D. in Structural Engineering', 'employee_id' => 'FAC006', 'dept_idx' => 3],
        ];

        $facultyModels = [];
        foreach ($facultyData as $f) {
            $user = User::create([
                'name' => $f['name'],
                'email' => $f['email'],
                'password' => 'password',
                'role' => 'faculty',
            ]);

            $facultyModels[] = Faculty::create([
                'user_id' => $user->id,
                'employee_id' => $f['employee_id'],
                'department_id' => $deptModels[$f['dept_idx']]->id,
                'designation' => $f['designation'],
                'qualification' => $f['qualification'],
                'phone' => '+1234567890' . $f['employee_id'][5],
                'joining_date' => Carbon::now()->subYears(4)->toDateString(),
            ]);
        }

        // Set Head of Departments
        $deptModels[0]->update(['head_id' => $facultyModels[0]->id]); // Turing CSE head
        $deptModels[1]->update(['head_id' => $facultyModels[2]->id]); // Feynman ECE head
        $deptModels[2]->update(['head_id' => $facultyModels[4]->id]); // Watt ME head
        $deptModels[3]->update(['head_id' => $facultyModels[5]->id]); // Telford CE head

        // 4. Create Students
        $studentNames = [
            ['name' => 'John Doe', 'email' => 'john@student.com', 'enroll' => 'STU001', 'dept' => 0, 'sem' => 4],
            ['name' => 'Jane Smith', 'email' => 'jane@student.com', 'enroll' => 'STU002', 'dept' => 0, 'sem' => 4],
            ['name' => 'Bob Johnson', 'email' => 'bob@student.com', 'enroll' => 'STU003', 'dept' => 0, 'sem' => 4],
            ['name' => 'Alice Williams', 'email' => 'alice@student.com', 'enroll' => 'STU004', 'dept' => 0, 'sem' => 2],
            ['name' => 'Charlie Brown', 'email' => 'charlie@student.com', 'enroll' => 'STU005', 'dept' => 1, 'sem' => 4],
            ['name' => 'David Miller', 'email' => 'david@student.com', 'enroll' => 'STU006', 'dept' => 1, 'sem' => 4],
            ['name' => 'Eva Davis', 'email' => 'eva@student.com', 'enroll' => 'STU007', 'dept' => 2, 'sem' => 6],
            ['name' => 'Frank Wilson', 'email' => 'frank@student.com', 'enroll' => 'STU008', 'dept' => 3, 'sem' => 8],
        ];

        $studentModels = [];
        foreach ($studentNames as $s) {
            $user = User::create([
                'name' => $s['name'],
                'email' => $s['email'],
                'password' => 'password',
                'role' => 'student',
            ]);

            $studentModels[] = Student::create([
                'user_id' => $user->id,
                'enrollment_no' => $s['enroll'],
                'department_id' => $deptModels[$s['dept']]->id,
                'semester' => $s['sem'],
                'dob' => Carbon::now()->subYears(20)->toDateString(),
                'phone' => '+1987654321' . $s['enroll'][5],
                'address' => '123 College St, University Campus',
                'admission_date' => Carbon::now()->subYears(2)->toDateString(),
            ]);
        }

        // 5. Create Courses
        $courses = [
            ['name' => 'Data Structures and Algorithms', 'code' => 'CS201', 'dept' => 0, 'fac' => 0, 'sem' => 4, 'credits' => 4],
            ['name' => 'Database Management Systems', 'code' => 'CS202', 'dept' => 0, 'fac' => 1, 'sem' => 4, 'credits' => 4],
            ['name' => 'Object Oriented Programming', 'code' => 'CS101', 'dept' => 0, 'fac' => 0, 'sem' => 2, 'credits' => 3],
            ['name' => 'Digital Signal Processing', 'code' => 'EC201', 'dept' => 1, 'fac' => 2, 'sem' => 4, 'credits' => 4],
            ['name' => 'Microprocessors and Interfacing', 'code' => 'EC202', 'dept' => 1, 'fac' => 3, 'sem' => 4, 'credits' => 4],
            ['name' => 'Fluid Mechanics', 'code' => 'ME301', 'dept' => 2, 'fac' => 4, 'sem' => 6, 'credits' => 3],
            ['name' => 'Structural Analysis', 'code' => 'CE401', 'dept' => 3, 'fac' => 5, 'sem' => 8, 'credits' => 4],
        ];

        $courseModels = [];
        foreach ($courses as $c) {
            $courseModels[] = Course::create([
                'name' => $c['name'],
                'code' => $c['code'],
                'department_id' => $deptModels[$c['dept']]->id,
                'faculty_id' => $facultyModels[$c['fac']]->id,
                'semester' => $c['sem'],
                'credits' => $c['credits'],
                'description' => 'Standard college course on ' . $c['name'],
            ]);
        }

        // 6. Create Exams & Results
        $exam = Exam::create([
            'name' => 'DSA Midterm Exam',
            'course_id' => $courseModels[0]->id, // CS201
            'date' => Carbon::now()->subDays(10)->toDateString(),
            'total_marks' => 50,
            'exam_type' => 'midterm',
        ]);

        // Student results for CS201 (STU001, STU002, STU003 are CSE Sem 4)
        Result::create([
            'exam_id' => $exam->id,
            'student_id' => $studentModels[0]->id,
            'marks_obtained' => 45,
            'grade' => 'A+',
            'remarks' => 'Outstanding performance.',
        ]);

        Result::create([
            'exam_id' => $exam->id,
            'student_id' => $studentModels[1]->id,
            'marks_obtained' => 38,
            'grade' => 'B',
            'remarks' => 'Good attempt, can improve on Trees.',
        ]);

        Result::create([
            'exam_id' => $exam->id,
            'student_id' => $studentModels[2]->id,
            'marks_obtained' => 22,
            'grade' => 'D',
            'remarks' => 'Needs attention.',
        ]);

        // 7. Create Attendance
        $attendanceDates = [
            Carbon::now()->subDays(3)->toDateString(),
            Carbon::now()->subDays(2)->toDateString(),
            Carbon::now()->subDays(1)->toDateString(),
        ];

        // Students in CSE Sem 4 (STU001, STU002, STU003)
        $cseSem4Students = [$studentModels[0]->id, $studentModels[1]->id, $studentModels[2]->id];

        foreach ($attendanceDates as $date) {
            foreach ($cseSem4Students as $studentId) {
                Attendance::create([
                    'student_id' => $studentId,
                    'course_id' => $courseModels[0]->id, // DSA
                    'date' => $date,
                    'status' => rand(0, 10) > 2 ? 'present' : (rand(0, 1) === 0 ? 'absent' : 'late'),
                ]);
                
                Attendance::create([
                    'student_id' => $studentId,
                    'course_id' => $courseModels[1]->id, // DBMS
                    'date' => $date,
                    'status' => rand(0, 10) > 1 ? 'present' : (rand(0, 1) === 0 ? 'absent' : 'late'),
                ]);
            }
        }

        // Call WebsiteSettingsSeeder
        $this->call(WebsiteSettingsSeeder::class);

        // 8. Create Notices
        \DB::table('notices')->insert([
            [
                'title' => 'Admissions Open for BA, BSc, BCA, BEd, MSc 2026-27',
                'content' => 'Online application portal is now active for all undergraduate and postgraduate courses. Please read instructions carefully before applying.',
                'category' => 'admission',
                'is_important' => true,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3)
            ],
            [
                'title' => 'Syllabus and Exam Schedule for MU Sem-II/IV Exams',
                'content' => 'Exam dates and syllabus details have been announced by the university. Detailed timetable is available on the portal.',
                'category' => 'exam',
                'is_important' => true,
                'created_at' => Carbon::now()->subDays(4),
                'updated_at' => Carbon::now()->subDays(4)
            ],
            [
                'title' => 'National Seminar on "Emerging Trends in Zoology" on June 10',
                'content' => 'The Department of Zoology is organizing a national seminar. Registrations are open until June 5.',
                'category' => 'academic',
                'is_important' => false,
                'created_at' => Carbon::now()->subDays(6),
                'updated_at' => Carbon::now()->subDays(6)
            ],
            [
                'title' => 'Extension of Online Fee Payment Date to June 5',
                'content' => 'The deadline for online payment of semester fees has been extended to June 5, 2026, without any late fee.',
                'category' => 'admission',
                'is_important' => false,
                'created_at' => Carbon::now()->subDays(8),
                'updated_at' => Carbon::now()->subDays(8)
            ],
            [
                'title' => 'NSS Enrollment Guidelines and Activity Schedule',
                'content' => 'New student enrollment for NSS activities has started. Register at the college office or with the NSS coordinator.',
                'category' => 'general',
                'is_important' => false,
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10)
            ],
        ]);

        // 9. Create Events
        \DB::table('events')->insert([
            [
                'title' => 'Umang Annual Cultural Fest 2026',
                'description' => 'The annual cultural festival "Umang" featuring dance, music, drama, and fine arts competitions.',
                'date' => Carbon::now()->addDays(18)->toDateString(),
                'location' => 'College Main Auditorium',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'title' => 'Inter-College Sports Tournament',
                'description' => 'Annual sports meet including track and field events, basketball, badminton, and table tennis.',
                'date' => Carbon::now()->addDays(25)->toDateString(),
                'location' => 'Sports Ground Gaya',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'title' => 'National Level Chemistry Symposium',
                'description' => 'Keynote speeches and student paper presentations on sustainable and green chemistry practices.',
                'date' => Carbon::now()->addDays(38)->toDateString(),
                'location' => 'Seminar Hall A',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ]);
    }
}
