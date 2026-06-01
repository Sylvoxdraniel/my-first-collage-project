import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import StudentForm from './StudentForm';
import studentApi from '../../api/studentApi';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

export default function StudentList() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, student: null });
  const [deleting, setDeleting] = useState(false);
  const [viewModal, setViewModal] = useState({ show: false, student: null });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentApi.getAll({ page, search });
      const data = response.data;
      setStudents(data.data || data);
      setTotalPages(data.last_page || 1);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      setPage(1);
      fetchStudents();
    }, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteModal.student) return;
    setDeleting(true);
    try {
      await studentApi.delete(deleteModal.student.id);
      toast.success('Student deleted successfully');
      setDeleteModal({ show: false, student: null });
      fetchStudents();
    } catch {
      toast.error('Failed to delete student');
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditStudent(null);
    fetchStudents();
  };

  const columns = [
    {
      key: 'enrollment_no',
      label: 'Enrollment No',
      sortable: true,
      render: (val) => (
        <span className="font-mono text-xs text-primary-400">{val}</span>
      ),
    },
    {
      key: 'user',
      label: 'Name',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-primary-400 text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-white">{user?.name}</p>
            <p className="text-xs text-dark-500">{user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (val) => {
        const name = val?.name || val;
        return (
          <Badge variant="primary">{name}</Badge>
        );
      },
    },
    {
      key: 'semester',
      label: 'Semester',
      render: (val) => <span className="text-dark-300">Sem {val}</span>,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (val) => <span className="text-dark-400">{val || '—'}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setViewModal({ show: true, student: row })}
            className="p-2 rounded-lg hover:bg-blue-500/10 text-dark-400 hover:text-blue-400 transition-colors"
          >
            <HiOutlineEye className="w-4 h-4" />
          </motion.button>
          {user?.role === 'admin' && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { setEditStudent(row); setShowForm(true); }}
                className="p-2 rounded-lg hover:bg-amber-500/10 text-dark-400 hover:text-amber-400 transition-colors"
              >
                <HiOutlinePencil className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDeleteModal({ show: true, student: row })}
                className="p-2 rounded-lg hover:bg-red-500/10 text-dark-400 hover:text-red-400 transition-colors"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Students</h2>
          <p className="text-dark-400 text-sm mt-1">Manage all students in the system</p>
        </div>
        {user?.role === 'admin' && (
          <Button icon={HiOutlinePlus} onClick={() => { setEditStudent(null); setShowForm(true); }}>
            Add Student
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
        <input
          type="text"
          placeholder="Search students by name, email, or enrollment..."
          value={search}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600/30 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
        />
      </div>

      {/* Table */}
      <Table columns={columns} data={students} loading={loading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            icon={HiOutlineChevronLeft}
          >
            Prev
          </Button>
          <span className="text-sm text-dark-400 px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next <HiOutlineChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Student Form Modal */}
      {showForm && (
        <StudentForm
          student={editStudent}
          onClose={() => { setShowForm(false); setEditStudent(null); }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, student: null })}
        title="Delete Student"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-dark-300">
            Are you sure you want to delete <span className="text-white font-semibold">{deleteModal.student?.name}</span>? This action cannot be undone.
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeleteModal({ show: false, student: null })}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete Student
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={viewModal.show}
        onClose={() => setViewModal({ show: false, student: null })}
        title="Student Details"
        size="md"
      >
        {viewModal.student && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                {viewModal.student.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{viewModal.student.name}</h3>
                <p className="text-dark-400">{viewModal.student.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                ['Enrollment No', viewModal.student.enrollment_no],
                ['Department', viewModal.student.department?.name || viewModal.student.department],
                ['Semester', `Sem ${viewModal.student.semester}`],
                ['Phone', viewModal.student.phone || '—'],
                ['Date of Birth', viewModal.student.dob || '—'],
                ['Address', viewModal.student.address || '—'],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs text-dark-500 uppercase tracking-wider">{label}</p>
                  <p className="text-sm text-white mt-1">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
