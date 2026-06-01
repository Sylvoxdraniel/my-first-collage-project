import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineClipboardCheck, HiOutlineCheckCircle, 
  HiOutlineXCircle, HiOutlineClock, HiOutlineUpload, HiOutlineDownload 
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import attendanceApi from '../../api/attendanceApi';
import courseApi from '../../api/courseApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import * as XLSX from 'xlsx';

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

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!selectedCourse) {
      toast.error('Please choose a Course first so we can match the students.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws);

        if (rawData.length === 0) {
          toast.error('Excel file is empty');
          return;
        }

        let currentStudents = students;
        if (students.length === 0) {
          try {
            setFetchingStudents(true);
            const response = await attendanceApi.getByDate(date, selectedCourse);
            const data = response.data;
            currentStudents = data.data || data;
            setStudents(currentStudents);
          } catch (error) {
            toast.error('Failed to auto-load student list for mapping');
            return;
          } finally {
            setFetchingStudents(false);
          }
        }

        if (currentStudents.length === 0) {
          toast.error('No students found registered in this course.');
          return;
        }

        let matchCount = 0;
        let excelDate = null;

        const parsedRows = rawData.map(row => {
          let rowName = '';
          let rowRoll = '';
          let rowDate = '';
          let rowStatus = ''; 
          let isPresent = false;
          let isAbsent = false;

          Object.keys(row).forEach(key => {
            const k = key.toLowerCase().trim();
            const val = row[key];
            if (k.includes('date') || k === 'day') {
              rowDate = val;
            } else if (k.includes('name') || k === 'student') {
              rowName = val;
            } else if (k.includes('roll') || k.includes('enroll') || k === 'no' || k === 'id') {
              rowRoll = val;
            } else if (k.includes('status')) {
              rowStatus = val;
            } else if (k.includes('present') || k === 'p') {
              isPresent = val && (val.toString().toLowerCase() === 'present' || val.toString() === '1' || val.toString().toLowerCase() === 'yes' || val.toString().toLowerCase() === 'true' || val.toString().toLowerCase() === 'p');
            } else if (k.includes('absent') || k === 'a') {
              isAbsent = val && (val.toString().toLowerCase() === 'absent' || val.toString() === '1' || val.toString().toLowerCase() === 'yes' || val.toString().toLowerCase() === 'true' || val.toString().toLowerCase() === 'a');
            }
          });

          let status = 'present';
          if (rowStatus) {
            const s = rowStatus.toString().toLowerCase().trim();
            if (s.startsWith('abs') || s === 'a' || s === 'absent') status = 'absent';
            else if (s.startsWith('lat') || s === 'l' || s === 'late') status = 'late';
            else status = 'present';
          } else {
            if (isAbsent) status = 'absent';
            else if (isPresent) status = 'present';
          }

          if (rowDate && !excelDate) {
            excelDate = rowDate;
          }

          return {
            name: rowName ? rowName.toString().trim() : '',
            roll: rowRoll ? rowRoll.toString().trim() : '',
            status: status
          };
        });

        if (excelDate) {
          try {
            if (typeof excelDate === 'number') {
              const dateObj = new Date((excelDate - 25569) * 86400 * 1000);
              const formattedDate = dateObj.toISOString().split('T')[0];
              setDate(formattedDate);
            } else {
              const d = new Date(excelDate);
              if (!isNaN(d.getTime())) {
                setDate(d.toISOString().split('T')[0]);
              }
            }
          } catch (e) {
            console.error('Failed to parse date from excel:', excelDate);
          }
        }

        const updatedStudents = currentStudents.map(student => {
          const matchedRow = parsedRows.find(row => {
            if (row.roll && student.enrollment_no && row.roll.toLowerCase() === student.enrollment_no.toString().toLowerCase()) {
              return true;
            }
            if (row.name && student.name && row.name.toLowerCase() === student.name.toLowerCase()) {
              return true;
            }
            return false;
          });

          if (matchedRow) {
            matchCount++;
            return { ...student, status: matchedRow.status };
          }
          return student;
        });

        setStudents(updatedStudents);
        toast.success(`Success! Matched and marked ${matchCount} of ${currentStudents.length} students from Excel.`);
      } catch (err) {
        toast.error('Failed to parse Excel file.');
        console.error(err);
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExportExcel = () => {
    if (students.length === 0) return;
    const courseObj = courses.find(c => c.id.toString() === selectedCourse.toString());
    const courseName = courseObj ? `${courseObj.name} (${courseObj.code})` : 'Course';

    const data = students.map(s => ({
      'Roll No / Enrollment No': s.enrollment_no,
      'Student Name': s.name,
      'Date': date,
      'Course': courseName,
      'Attendance Status': s.status.toUpperCase()
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
    XLSX.writeFile(wb, `attendance_${courseName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${date}.xlsx`);
    toast.success('Downloaded attendance excel report');
  };

  const handleExportPDF = () => {
    if (students.length === 0) return;
    const courseObj = courses.find(c => c.id.toString() === selectedCourse.toString());
    const courseName = courseObj ? `${courseObj.name} (${courseObj.code})` : 'Course';

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Attendance Report - ${date}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; }
            h1 { font-size: 24px; margin-bottom: 5px; color: #0f172a; }
            h2 { font-size: 14px; font-weight: 500; margin-bottom: 20px; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
            .status { font-weight: 600; text-transform: uppercase; font-size: 11px; padding: 4px 8px; border-radius: 4px; display: inline-block; }
            .status-present { background-color: #d1fae5; color: #065f46; }
            .status-absent { background-color: #fee2e2; color: #991b1b; }
            .status-late { background-color: #fef3c7; color: #92400e; }
            .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <h1>Gautam Budha Mahila College, Gaya</h1>
          <h2>Attendance Report for <strong>${courseName}</strong> &bull; Date: <strong>${date}</strong></h2>
          <table>
            <thead>
              <tr>
                <th>Enrollment / Roll No</th>
                <th>Student Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(s => `
                <tr>
                  <td style="font-family: monospace;">${s.enrollment_no}</td>
                  <td>${s.name}</td>
                  <td>
                    <span class="status status-${s.status}">${s.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <span>Generated on ${new Date().toLocaleString()}</span>
            <span>Signature of Faculty Member: _____________________</span>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
              See Attendance
            </Button>
          </div>

          <div>
            <input 
              type="file"
              id="excel-attendance-file"
              accept=".xlsx, .xls, .csv"
              onChange={handleExcelUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (!selectedCourse) {
                  toast.error('Please choose a Course first');
                  return;
                }
                document.getElementById('excel-attendance-file').click();
              }}
              className="w-full flex items-center justify-center gap-2"
            >
              <HiOutlineUpload className="text-lg" /> Import Excel
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

            <div className="flex justify-between items-center p-6 border-t border-dark-800 flex-wrap gap-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleExportExcel}
                  className="flex items-center gap-1.5"
                >
                  <HiOutlineDownload className="text-lg" /> Download Excel
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleExportPDF}
                  className="flex items-center gap-1.5"
                >
                  <HiOutlineDownload className="text-lg" /> Download PDF
                </Button>
              </div>
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
