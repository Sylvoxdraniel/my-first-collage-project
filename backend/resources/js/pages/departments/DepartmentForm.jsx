import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import departmentApi from '../../api/departmentApi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const DepartmentForm = ({ department, facultyList, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    head_id: '',
    labs: '',
    outcomes: '',
    careers: '',
    achievements: '',
    activities: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        code: department.code || '',
        description: department.description || '',
        head_id: department.head_id || '',
        labs: department.labs || '',
        outcomes: department.outcomes || '',
        careers: department.careers || '',
        achievements: department.achievements || '',
        activities: department.activities || '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        head_id: '',
        labs: '',
        outcomes: '',
        careers: '',
        achievements: '',
        activities: '',
      });
    }
    setErrors({});
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.code.trim()) tempErrors.code = 'Code is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        ...formData,
        head_id: formData.head_id || null,
      };

      if (department) {
        await departmentApi.update(department.id, payload);
        toast.success('Department updated successfully');
      } else {
        await departmentApi.create(payload);
        toast.success('Department created successfully');
      }
      onSubmit();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto px-1 pr-2 scrollbar-none">
        
        {/* Left Column: Basic Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-primary-400 border-b border-dark-700/50 pb-1 uppercase tracking-wider">
            General Info
          </h3>
          
          <Input
            label="Department Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="e.g. Computer Science & Engineering"
            required
          />

          <Input
            label="Department Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            error={errors.code}
            placeholder="e.g. CSE"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Head of Department
            </label>
            <select
              name="head_id"
              value={formData.head_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-dark-700 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Department Head (Optional)</option>
              {facultyList.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.user?.name} ({fac.employee_id})
                </option>
              ))}
            </select>
            {errors.head_id && <p className="text-red-500 text-xs mt-1">{errors.head_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Intro & Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2.5 rounded-lg border border-dark-700 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Enter department introduction description..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Right Column: Custom Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-primary-400 border-b border-dark-700/50 pb-1 uppercase tracking-wider">
            Public Page Details
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Labs & Infrastructure
            </label>
            <textarea
              name="labs"
              value={formData.labs}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2.5 rounded-lg border border-dark-700 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-xs"
              placeholder="Describe laboratory equipment and layouts..."
            />
            {errors.labs && <p className="text-red-500 text-xs mt-1">{errors.labs}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Course Outcomes
            </label>
            <textarea
              name="outcomes"
              value={formData.outcomes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2.5 rounded-lg border border-dark-700 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-xs"
              placeholder="What skills will graduates gain..."
            />
            {errors.outcomes && <p className="text-red-500 text-xs mt-1">{errors.outcomes}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Career Pathways
            </label>
            <textarea
              name="careers"
              value={formData.careers}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2.5 rounded-lg border border-dark-700 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-xs"
              placeholder="e.g. Software Developer, IT Specialist..."
            />
            {errors.careers && <p className="text-red-500 text-xs mt-1">{errors.careers}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Major Achievements
            </label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2.5 rounded-lg border border-dark-700 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-xs"
              placeholder="Describe student or department achievements..."
            />
            {errors.achievements && <p className="text-red-500 text-xs mt-1">{errors.achievements}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Student Activities & Events
            </label>
            <textarea
              name="activities"
              value={formData.activities}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2.5 rounded-lg border border-dark-700 bg-dark-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-xs"
              placeholder="Describe extracurricular activities, club names, etc..."
            />
            {errors.activities && <p className="text-red-500 text-xs mt-1">{errors.activities}</p>}
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-dark-800">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {department ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default DepartmentForm;
