import { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import studentApi from '../../api/studentApi';
import departmentApi from '../../api/departmentApi';
import toast from 'react-hot-toast';

export default function StudentForm({ student, onClose, onSuccess }) {
  const isEdit = !!student;
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: student?.name || '',
    email: student?.email || '',
    password: '',
    enrollment_no: student?.enrollment_no || '',
    department_id: student?.department_id || student?.department?.id || '',
    semester: student?.semester || '',
    dob: student?.dob || '',
    phone: student?.phone || '',
    address: student?.address || '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentApi.getAll();
      setDepartments(response.data.data || response.data);
    } catch {
      setDepartments([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!isEdit && !form.password) newErrors.password = 'Password is required';
    if (!form.enrollment_no.trim()) newErrors.enrollment_no = 'Enrollment number is required';
    if (!form.department_id) newErrors.department_id = 'Department is required';
    if (!form.semester) newErrors.semester = 'Semester is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = { ...form };
      if (isEdit && !payload.password) delete payload.password;

      if (isEdit) {
        await studentApi.update(student.id, payload);
        toast.success('Student updated successfully');
      } else {
        await studentApi.create(payload);
        toast.success('Student added successfully');
      }
      onSuccess();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(
          Object.fromEntries(
            Object.entries(error.response.data.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEdit ? 'Edit Student' : 'Add New Student'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter student name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="student@college.com"
          />
          {!isEdit && (
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Min 8 characters"
            />
          )}
          <Input
            label="Enrollment Number"
            name="enrollment_no"
            value={form.enrollment_no}
            onChange={handleChange}
            error={errors.enrollment_no}
            placeholder="e.g. CS2024001"
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-dark-300">Department</label>
            <select
              name="department_id"
              value={form.department_id}
              onChange={handleChange}
              className="w-full rounded-xl border bg-dark-800/50 text-white border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 px-4 py-2.5 text-sm transition-all"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            {errors.department_id && <p className="text-xs text-red-400">{errors.department_id}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-dark-300">Semester</label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className="w-full rounded-xl border bg-dark-800/50 text-white border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 px-4 py-2.5 text-sm transition-all"
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
            {errors.semester && <p className="text-xs text-red-400">{errors.semester}</p>}
          </div>
          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
          />
          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>
        <Input
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Enter address"
        />

        <div className="flex items-center gap-3 justify-end pt-4 border-t border-dark-700/30">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Update Student' : 'Add Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
