import { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import facultyApi from '../../api/facultyApi';
import departmentApi from '../../api/departmentApi';
import toast from 'react-hot-toast';
import { HiOutlinePlus } from 'react-icons/hi';
import DepartmentForm from '../departments/DepartmentForm';

export default function FacultyForm({ faculty, onClose, onSuccess }) {
  const isEdit = !!faculty;
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: faculty?.user?.name || faculty?.name || '',
    email: faculty?.user?.email || faculty?.email || '',
    password: '',
    employee_id: faculty?.employee_id || '',
    department_id: faculty?.department_id || faculty?.department?.id || '',
    designation: faculty?.designation || '',
    qualification: faculty?.qualification || '',
    phone: faculty?.phone || '',
    joining_date: faculty?.joining_date || '',
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
    if (!form.employee_id.trim()) newErrors.employee_id = 'Employee ID is required';
    if (!form.department_id) newErrors.department_id = 'Department is required';
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
        await facultyApi.update(faculty.id, payload);
        toast.success('Faculty updated successfully');
      } else {
        await facultyApi.create(payload);
        toast.success('Faculty added successfully');
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
    <Modal isOpen={true} onClose={onClose} title={isEdit ? 'Edit Faculty' : 'Add New Faculty'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Enter faculty name" />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="faculty@college.com" />
          <Input
            label={isEdit ? "New Password (Optional)" : "Password"}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder={isEdit ? "Leave blank to keep current" : "Min 8 characters"}
          />
          <Input label="Employee ID" name="employee_id" value={form.employee_id} onChange={handleChange} error={errors.employee_id} placeholder="e.g. FAC001" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-dark-300">Department</label>
            <div className="flex gap-2">
              <select name="department_id" value={form.department_id} onChange={handleChange} className="flex-1 rounded-xl border bg-dark-800/50 text-white border-dark-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 px-4 py-2.5 text-sm transition-all">
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
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
          <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Associate Professor" />
          <Input label="Qualification" name="qualification" value={form.qualification} onChange={handleChange} placeholder="e.g. Ph.D. in CS" />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone number" />
          <Input label="Joining Date" name="joining_date" type="date" value={form.joining_date} onChange={handleChange} />
        </div>
        <div className="flex items-center gap-3 justify-end pt-4 border-t border-dark-700/30">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>{isEdit ? 'Update Faculty' : 'Add Faculty'}</Button>
        </div>
      </form>

      {showAddDept && (
        <Modal isOpen={true} onClose={() => setShowAddDept(false)} title="Create Department" size="lg">
          <div className="p-1">
            <DepartmentForm
              facultyList={[]}
              onSubmit={handleAddDeptSuccess}
              onCancel={() => setShowAddDept(false)}
            />
          </div>
        </Modal>
      )}
    </Modal>
  );
}
