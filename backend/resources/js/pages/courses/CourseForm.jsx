import { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import courseApi from '../../api/courseApi';
import departmentApi from '../../api/departmentApi';
import facultyApi from '../../api/facultyApi';
import toast from 'react-hot-toast';
import { HiOutlinePlus } from 'react-icons/hi';
import DepartmentForm from '../departments/DepartmentForm';

export default function CourseForm({ course, onClose, onSuccess }) {
  const isEdit = !!course;
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [form, setForm] = useState({
    name: course?.name || '',
    code: course?.code || '',
    type: course?.type || 'ug',
    department_id: course?.department_id || course?.department?.id || '',
    faculty_id: course?.faculty_id || course?.faculty?.id || '',
    semester: course?.semester || '',
    credits: course?.credits || '',
    description: course?.description || '',
  });
  const [errors, setErrors] = useState({});
  const [showAddDept, setShowAddDept] = useState(false);

  const handleAddDeptSuccess = async () => {
    setShowAddDept(false);
    try {
      const response = await departmentApi.getAll();
      const loadedDepts = response.data.data || response.data;
      setDepartments(loadedDepts);
      if (loadedDepts.length > 0) {
        const latest = loadedDepts[loadedDepts.length - 1];
        setForm(prev => ({ ...prev, department_id: latest.id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, facRes] = await Promise.all([departmentApi.getAll(), facultyApi.getAll()]);
        setDepartments(deptRes.data.data || deptRes.data);
        setFacultyList(facRes.data.data || facRes.data);
      } catch {
        setDepartments([]);
        setFacultyList([]);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Course name is required';
    if (!form.code.trim()) newErrors.code = 'Course code is required';
    if (!form.type) newErrors.type = 'Course level is required';
    if (!form.department_id) newErrors.department_id = 'Department is required';
    if (!form.semester) newErrors.semester = 'Semester is required';
    if (!form.credits) newErrors.credits = 'Credits are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) {
        await courseApi.update(course.id, form);
        toast.success('Course updated successfully');
      } else {
        await courseApi.create(form);
        toast.success('Course added successfully');
      }
      onSuccess();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(Object.fromEntries(Object.entries(error.response.data.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={isEdit ? 'Edit Course' : 'Add New Course'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Course Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="e.g. Data Structures" />
          <Input label="Course Code" name="code" value={form.code} onChange={handleChange} error={errors.code} placeholder="e.g. CS201" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-dark-300">Course Level</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-xl border bg-dark-800/50 text-white border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 px-4 py-2.5 text-sm transition-all">
              <option value="ug">Undergraduate (UG)</option>
              <option value="pg">Postgraduate (PG)</option>
              <option value="phd">Doctoral (PhD)</option>
            </select>
            {errors.type && <p className="text-xs text-red-400">{errors.type}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-dark-300">Department</label>
            <div className="flex gap-2">
              <select name="department_id" value={form.department_id} onChange={handleChange} className="flex-1 rounded-xl border bg-dark-800/50 text-white border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 px-4 py-2.5 text-sm transition-all">
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <button
                type="button"
                onClick={() => setShowAddDept(true)}
                className="px-3.5 rounded-xl border border-dark-600/50 bg-dark-800/50 text-primary-400 hover:text-white hover:bg-primary-500/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                title="Add Department"
              >
                <HiOutlinePlus className="w-5 h-5" />
              </button>
            </div>
            {errors.department_id && <p className="text-xs text-red-400">{errors.department_id}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-dark-300">Faculty</label>
            <select name="faculty_id" value={form.faculty_id} onChange={handleChange} className="w-full rounded-xl border bg-dark-800/50 text-white border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 px-4 py-2.5 text-sm transition-all">
              <option value="">Select Faculty</option>
              {facultyList.map((f) => <option key={f.id} value={f.id}>{f.user?.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-dark-300">Semester</label>
            <select name="semester" value={form.semester} onChange={handleChange} className="w-full rounded-xl border bg-dark-800/50 text-white border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 px-4 py-2.5 text-sm transition-all">
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
            {errors.semester && <p className="text-xs text-red-400">{errors.semester}</p>}
          </div>
          <Input label="Credits" name="credits" type="number" value={form.credits} onChange={handleChange} error={errors.credits} placeholder="e.g. 4" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-dark-300">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Course description (optional)"
            className="w-full rounded-xl border bg-dark-800/50 text-white border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 px-4 py-2.5 text-sm transition-all resize-none placeholder-dark-500"
          />
        </div>
        <div className="flex items-center gap-3 justify-end pt-4 border-t border-dark-700/30">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>{isEdit ? 'Update Course' : 'Add Course'}</Button>
        </div>
      </form>

      {showAddDept && (
        <Modal isOpen={true} onClose={() => setShowAddDept(false)} title="Create Department" size="lg">
          <div className="p-1">
            <DepartmentForm
              facultyList={facultyList}
              onSubmit={handleAddDeptSuccess}
              onCancel={() => setShowAddDept(false)}
            />
          </div>
        </Modal>
      )}
    </Modal>
  );
}
