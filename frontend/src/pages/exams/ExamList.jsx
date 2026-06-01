import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineDocumentText, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import toast from 'react-hot-toast';
import examApi from '../../api/examApi';
import courseApi from '../../api/courseApi';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    course_id: '',
    date: '',
    total_marks: '',
    exam_type: 'midterm',
  });
  const [errors, setErrors] = useState({});

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await examApi.getAll();
      const data = response.data;
      setExams(data.data || data);
    } catch (error) {
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseApi.getAll();
      const data = response.data;
      setCourses(data.data || data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, []);

  const handleCreate = () => {
    setSelectedExam(null);
    setFormData({
      name: '',
      course_id: '',
      date: new Date().toISOString().split('T')[0],
      total_marks: 100,
      exam_type: 'midterm',
    });
    setErrors({});
    setIsFormOpen(true);
  };

  const handleEdit = (exam) => {
    setSelectedExam(exam);
    setFormData({
      name: exam.name || '',
      course_id: exam.course_id || '',
      date: exam.date || '',
      total_marks: exam.total_marks || '',
      exam_type: exam.exam_type || 'midterm',
    });
    setErrors({});
    setIsFormOpen(true);
  };

  const handleDeleteClick = (exam) => {
    setExamToDelete(exam);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!examToDelete) return;
    try {
      setDeleting(true);
      await examApi.delete(examToDelete.id);
      toast.success('Exam deleted successfully');
      fetchExams();
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error('Failed to delete exam');
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (selectedExam) {
        await examApi.update(selectedExam.id, formData);
        toast.success('Exam updated successfully');
      } else {
        await examApi.create(formData);
        toast.success('Exam created successfully');
      }
      setIsFormOpen(false);
      fetchExams();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error('Failed to save exam');
      }
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Exam Name' },
    {
      key: 'course',
      label: 'Course',
      render: (val) => `${val?.name || ''} (${val?.code || ''})`
    },
    {
      key: 'exam_type',
      label: 'Type',
      render: (val) => <span className="capitalize px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400">{val}</span>
    },
    { key: 'date', label: 'Date' },
    { key: 'total_marks', label: 'Total Marks' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2 justify-end items-center">
          <Link to={`/results?exam_id=${row.id}`}>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-emerald-400 hover:bg-emerald-500/10">
              <HiOutlineEye className="text-lg" /> Enter Marks
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <HiOutlinePencil className="text-lg" />
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteClick(row)}>
            <HiOutlineTrash className="text-lg" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <HiOutlineDocumentText className="text-indigo-500" />
            Exams & Assessments
          </h1>
          <p className="text-gray-400 mt-1">Schedule and manage examinations and grade entries.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <HiOutlinePlus /> Create Exam
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={exams} loading={loading} />
      </Card>

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedExam ? 'Edit Exam' : 'Create Exam'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Exam Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="e.g. DSA Midterm Assessment"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Course</label>
            <select
              name="course_id"
              value={formData.course_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-dark-700 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
            {errors.course_id && <p className="text-red-500 text-xs mt-1">{errors.course_id}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              required
            />

            <Input
              label="Total Marks"
              name="total_marks"
              type="number"
              value={formData.total_marks}
              onChange={handleChange}
              error={errors.total_marks}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Exam Type</label>
            <select
              name="exam_type"
              value={formData.exam_type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-dark-700 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="midterm">Midterm</option>
              <option value="final">Final Exam</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-dark-800">
            <Button variant="ghost" type="button" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {selectedExam ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete <strong className="text-white">{examToDelete?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm} loading={deleting}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExamList;
