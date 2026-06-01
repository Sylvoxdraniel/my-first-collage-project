import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineCheck, HiOutlineDocumentText } from 'react-icons/hi';
import toast from 'react-hot-toast';
import examApi from '../../api/examApi';
import resultApi from '../../api/resultApi';
import studentApi from '../../api/studentApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import useAuth from '../../hooks/useAuth';

const Results = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [examDetail, setExamDetail] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [studentResults, setStudentResults] = useState([]);
  const [fetchingStudentResults, setFetchingStudentResults] = useState(false);

  useEffect(() => {
    if (user?.role === 'student' && user?.student?.id) {
      const fetchStudentGrades = async () => {
        try {
          setFetchingStudentResults(true);
          const response = await resultApi.getStudentResults(user.student.id);
          setStudentResults(response.data.data || response.data);
        } catch (error) {
          toast.error('Failed to load your grades');
        } finally {
          setFetchingStudentResults(false);
        }
      };
      fetchStudentGrades();
    }
  }, [user]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await examApi.getAll();
        const data = response.data;
        setExams(data.data || data);

        // Pre-select exam from query string if available
        const queryExamId = searchParams.get('exam_id');
        if (queryExamId) {
          setSelectedExam(queryExamId);
        }
      } catch (error) {
        toast.error('Failed to load exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [searchParams]);

  useEffect(() => {
    if (!selectedExam) {
      setExamDetail(null);
      setStudents([]);
      return;
    }

    const fetchExamAndStudents = async () => {
      try {
        setFetching(true);
        // Get exam details
        const examResponse = await examApi.getById(selectedExam);
        const exam = examResponse.data;
        setExamDetail(exam);

        // Get students in the department and semester of this exam's course
        const studentsResponse = await studentApi.getAll({
          department_id: exam.course?.department_id,
          semester: exam.course?.semester,
        });
        const allStudents = studentsResponse.data.data || studentsResponse.data;

        // Load existing results for this exam
        const resultsResponse = await resultApi.getAll({ exam_id: selectedExam });
        const existingResults = resultsResponse.data.data || resultsResponse.data;
        const resultsMap = new Map(existingResults.map((r) => [r.student_id, r]));

        const studentGradingList = allStudents.map((student) => {
          const resObj = resultsMap.get(student.id);
          return {
            student_id: student.id,
            name: student.user?.name,
            enrollment_no: student.enrollment_no,
            marks_obtained: resObj ? resObj.marks_obtained : '',
            remarks: resObj ? resObj.remarks || '' : '',
          };
        });

        setStudents(studentGradingList);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load student list or existing grades');
      } finally {
        setFetching(false);
      }
    };

    fetchExamAndStudents();
  }, [selectedExam]);

  const handleMarkChange = (studentId, val) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.student_id === studentId) {
          // Cap obtained marks to max exam marks
          const maxMarks = examDetail?.total_marks || 100;
          let numVal = val === '' ? '' : parseFloat(val);
          if (numVal > maxMarks) {
            numVal = maxMarks;
            toast.error(`Marks cannot exceed total exam marks (${maxMarks})`);
          }
          return { ...student, marks_obtained: numVal };
        }
        return student;
      })
    );
  };

  const handleRemarksChange = (studentId, val) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.student_id === studentId ? { ...student, remarks: val } : student
      )
    );
  };

  const handleSave = async () => {
    if (!selectedExam || students.length === 0) return;
    
    // Validate that marks are not empty or negative
    const hasInvalid = students.some(
      (s) => s.marks_obtained === '' || isNaN(s.marks_obtained) || s.marks_obtained < 0
    );
    if (hasInvalid) {
      toast.error('Please enter valid, non-negative marks for all students.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        exam_id: selectedExam,
        results: students.map((s) => ({
          student_id: s.student_id,
          marks_obtained: parseFloat(s.marks_obtained),
          remarks: s.remarks,
        })),
      };
      await resultApi.create(payload);
      toast.success('Grades/results saved successfully');
    } catch (error) {
      toast.error('Failed to save student grades');
    } finally {
      setSaving(false);
    }
  };

  if (user?.role === 'student') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <HiOutlineDocumentText className="text-indigo-500" />
            My Grade Sheet
          </h1>
          <p className="text-gray-400 mt-1">View your academic exam marks and grades.</p>
        </div>

        {fetchingStudentResults ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : studentResults.length === 0 ? (
          <Card className="text-center py-12 text-gray-400">
            No grades published yet.
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark-800 text-gray-400 text-sm font-semibold uppercase">
                    <th className="py-4 px-6">Course Code</th>
                    <th className="py-4 px-6">Course Name</th>
                    <th className="py-4 px-6">Exam Name</th>
                    <th className="py-4 px-6 text-center">Marks Obtained</th>
                    <th className="py-4 px-6 text-center">Out of</th>
                    <th className="py-4 px-6 text-center">Grade</th>
                    <th className="py-4 px-6">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800 text-white">
                  {studentResults.map((res) => (
                    <tr key={res.id} className="hover:bg-dark-800/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-indigo-400">{res.exam?.course?.code}</td>
                      <td className="py-4 px-6 font-medium">{res.exam?.course?.name}</td>
                      <td className="py-4 px-6 text-dark-300">{res.exam?.name}</td>
                      <td className="py-4 px-6 text-center font-bold text-emerald-400">{res.marks_obtained}</td>
                      <td className="py-4 px-6 text-center text-dark-400">{res.exam?.total_marks}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          res.grade === 'A+' || res.grade === 'A' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : res.grade === 'B' || res.grade === 'C'
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {res.grade}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-dark-400 text-sm italic">{res.remarks || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <HiOutlineDocumentText className="text-indigo-500" />
          Manage Results
        </h1>
        <p className="text-gray-400 mt-1">Enter marks and grade sheets for course examinations.</p>
      </div>

      <Card>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Select Examination
          </label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2.5 rounded-lg border border-dark-700 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Choose an Exam</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.name} — {exam.course?.name} ({exam.course?.code})
              </option>
            ))}
          </select>
        </div>
      </Card>

      {fetching && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {!fetching && examDetail && students.length > 0 && (
        <Card className="space-y-6">
          <div className="flex justify-between items-center border-b border-dark-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{examDetail.name}</h3>
              <p className="text-sm text-gray-400 mt-1">
                Course: <span className="text-indigo-400 font-semibold">{examDetail.course?.name}</span> | Max Marks: <span className="text-white font-bold">{examDetail.total_marks}</span>
              </p>
            </div>
            <Button onClick={handleSave} loading={saving} className="flex items-center gap-2">
              <HiOutlineCheck /> Save Grades
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-800 text-gray-400 text-sm font-semibold uppercase">
                  <th className="py-4 px-6">Enrollment No</th>
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6 w-32">Marks Obtained</th>
                  <th className="py-4 px-6">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800 text-white">
                {students.map((student) => (
                  <tr key={student.student_id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-indigo-400">{student.enrollment_no}</td>
                    <td className="py-4 px-6 font-medium">{student.name}</td>
                    <td className="py-4 px-6">
                      <input
                        type="number"
                        min="0"
                        max={examDetail.total_marks}
                        step="0.5"
                        value={student.marks_obtained}
                        onChange={(e) => handleMarkChange(student.student_id, e.target.value)}
                        placeholder="Marks"
                        className="w-24 px-3 py-1.5 text-center rounded-xl border border-dark-600/50 bg-dark-800/50 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm"
                        required
                      />
                    </td>
                    <td className="py-4 px-6">
                      <input
                        type="text"
                        value={student.remarks}
                        onChange={(e) => handleRemarksChange(student.student_id, e.target.value)}
                        placeholder="e.g. Good performance"
                        className="w-full max-w-xs px-3 py-1.5 rounded-xl border border-dark-600/50 bg-dark-800/50 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!fetching && selectedExam && students.length === 0 && (
        <Card className="text-center py-12 text-gray-400">
          No students registered in this course's semester/department.
        </Card>
      )}
    </div>
  );
};

export default Results;
