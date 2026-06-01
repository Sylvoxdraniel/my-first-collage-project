import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineOfficeBuilding, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineUser } from 'react-icons/hi';
import toast from 'react-hot-toast';
import departmentApi from '../../api/departmentApi';
import facultyApi from '../../api/facultyApi';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import DepartmentForm from './DepartmentForm';

const DepartmentList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [departments, setDepartments] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentApi.getAll();
      const data = response.data;
      setDepartments(data.data || data);
    } catch (error) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await facultyApi.getAll();
      const data = response.data;
      setFacultyList(data.data || data);
    } catch (error) {
      console.error('Failed to load faculty list', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchFaculty();
    if (searchParams.get('action') === 'add') {
      setSelectedDepartment(null);
      setIsFormOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const handleCreate = () => {
    setSelectedDepartment(null);
    setIsFormOpen(true);
  };

  const handleEdit = (dept) => {
    setSelectedDepartment(dept);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (dept) => {
    setDeptToDelete(dept);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deptToDelete) return;
    try {
      setDeleting(true);
      await departmentApi.delete(deptToDelete.id);
      toast.success('Department deleted successfully');
      fetchDepartments();
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error('Failed to delete department. Make sure it has no active courses or students.');
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    fetchDepartments();
  };

  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (val) => <span className="font-mono text-indigo-400 font-bold">{val}</span>
    },
    { key: 'name', label: 'Department Name' },
    {
      key: 'head',
      label: 'Head of Department',
      render: (val) => (
        <span className="flex items-center gap-2">
          <HiOutlineUser className="text-gray-400" />
          {val?.user?.name || <span className="text-gray-500 italic">Not Assigned</span>}
        </span>
      )
    },
    { key: 'faculty_count', label: 'Faculty Count', render: (val) => val ?? 0 },
    { key: 'students_count', label: 'Students', render: (val) => val ?? 0 },
    { key: 'courses_count', label: 'Courses', render: (val) => val ?? 0 },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2 items-center">
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
            <HiOutlineOfficeBuilding className="text-indigo-500" />
            Departments
          </h1>
          <p className="text-gray-400 mt-1">Manage academic departments, heads, and staff.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <HiOutlinePlus /> Add Department
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={departments} loading={loading} />
      </Card>

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedDepartment ? 'Edit Department' : 'Create Department'} size="lg">
        <DepartmentForm
          department={selectedDepartment}
          facultyList={facultyList}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete the department <strong className="text-white">{deptToDelete?.name}</strong>? This action cannot be undone.
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

export default DepartmentList;
