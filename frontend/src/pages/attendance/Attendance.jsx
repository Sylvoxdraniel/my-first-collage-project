import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineClipboardCheck, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock } from 'react-icons/hi';
import toast from 'react-hot-toast';
import attendanceApi from '../../api/attendanceApi';
import courseApi from '../../api/courseApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Attendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseApi.getAll();
        const data = response.data;
        setCourses(data.data || data);
      } catch (error) {
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleFetchStudents = async () => {
    if (!selectedCourse || !date) {
      toast.error('Please select both course and date');
      return;
    }

    try {
      setFetchingStudents(true);
      const response = await attendanceApi.getByDate(date, selectedCourse);
      const data = response.data;
      setStudents(data.data || data);
    } catch (error) {
      toast.error('Failed to load attendance list');
    } finally {
      setFetchingStudents(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.student_id === studentId ? { ...student, status } : student
      )
    );
  };

  const handleMarkAll = (status) => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, status }))
    );
  };

  const handleSave = async () => {
    if (students.length === 0) return;
    try {
      setSaving(true);
      const payload = {
        date,
        course_id: selectedCourse,
        attendance: students.map((s) => ({
          student_id: s.student_id,
          status: s.status,
        })),
      };
      await attendanceApi.markAttendance(payload);
      toast.success('Attendance recorded successfully');
    } catch (error) {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <HiOutlineClipboardCheck className="text-indigo-500" />
          Mark Attendance
        </h1>
        <p className="text-gray-400 mt-1">Track daily attendance of students per course.</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-dark-700 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Choose a Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-dark-700 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <Button
              onClick={handleFetchStudents}
              loading={fetchingStudents}
              disabled={loading}
              className="w-full"
            >
              Fetch Student List
            </Button>
          </div>
        </div>
      </Card>

      {students.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-wrap gap-2 justify-between items-center bg-dark-800 p-4 rounded-xl border border-dark-700">
            <span className="text-gray-300 font-medium">Quick Actions:</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-emerald-400 hover:bg-emerald-500/10"
                onClick={() => handleMarkAll('present')}
              >
                <HiOutlineCheckCircle /> Mark All Present
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-rose-400 hover:bg-rose-500/10"
                onClick={() => handleMarkAll('absent')}
              >
                <HiOutlineXCircle /> Mark All Absent
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark-800 text-gray-400 text-sm font-semibold uppercase">
                    <th className="py-4 px-6">Enrollment No</th>
                    <th className="py-4 px-6">Student Name</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800 text-white">
                  {students.map((student) => (
                    <tr key={student.student_id} className="hover:bg-dark-800/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-indigo-400">{student.enrollment_no}</td>
                      <td className="py-4 px-6 font-medium">{student.name}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-4">
                          <label className="flex items-center gap-1.5 cursor-pointer group">
                            <input
                              type="radio"
                              name={`attendance-${student.student_id}`}
                              value="present"
                              checked={student.status === 'present'}
                              onChange={() => handleStatusChange(student.student_id, 'present')}
                              className="accent-emerald-500 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-gray-400 group-hover:text-emerald-400 transition-colors">
                              Present
                            </span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer group">
                            <input
                              type="radio"
                              name={`attendance-${student.student_id}`}
                              value="absent"
                              checked={student.status === 'absent'}
                              onChange={() => handleStatusChange(student.student_id, 'absent')}
                              className="accent-rose-500 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-gray-400 group-hover:text-rose-400 transition-colors">
                              Absent
                            </span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer group">
                            <input
                              type="radio"
                              name={`attendance-${student.student_id}`}
                              value="late"
                              checked={student.status === 'late'}
                              onChange={() => handleStatusChange(student.student_id, 'late')}
                              className="accent-amber-500 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-gray-400 group-hover:text-amber-400 transition-colors">
                              Late
                            </span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end p-6 border-t border-dark-800">
              <Button onClick={handleSave} loading={saving} className="px-8">
                Submit Attendance Records
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Attendance;
