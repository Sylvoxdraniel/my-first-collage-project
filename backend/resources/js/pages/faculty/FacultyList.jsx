import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import FacultyForm from './FacultyForm';
import facultyApi from '../../api/facultyApi';
import toast from 'react-hot-toast';

export default function FacultyList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editFaculty, setEditFaculty] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, faculty: null });
  const [deleting, setDeleting] = useState(false);
  const [viewModal, setViewModal] = useState({ show: false, faculty: null });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFaculty();
    if (searchParams.get('action') === 'add') {
      setEditFaculty(null);
      setShowForm(true);
      setSearchParams({}, { replace: true });
    }
  }, [page, searchParams]);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await facultyApi.getAll({ page, search });
      const data = response.data;
      setFaculty(data.data || data);
      setTotalPages(data.last_page || 1);
    } catch {
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => { setPage(1); fetchFaculty(); }, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteModal.faculty) return;
    setDeleting(true);
    try {
      await facultyApi.delete(deleteModal.faculty.id);
      toast.success('Faculty deleted successfully');
      setDeleteModal({ show: false, faculty: null });
      fetchFaculty();
    } catch {
      toast.error('Failed to delete faculty');
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditFaculty(null);
    fetchFaculty();
  };

  const columns = [
    {
      key: 'employee_id',
      label: 'Employee ID',
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-accent-400">{val}</span>,
    },
    {
      key: 'user',
      label: 'Name',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500/20 to-primary-500/20 flex items-center justify-center text-accent-400 text-xs font-bold flex-shrink-0">
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
      render: (val) => <Badge variant="info">{val?.name || val}</Badge>,
    },
    {
      key: 'designation',
      label: 'Designation',
      render: (val) => <span className="text-dark-300">{val || '—'}</span>,
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
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setViewModal({ show: true, faculty: row })} className="p-2 rounded-lg hover:bg-blue-500/10 text-dark-400 hover:text-blue-400 transition-colors">
            <HiOutlineEye className="w-4 h-4" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setEditFaculty(row); setShowForm(true); }} className="p-2 rounded-lg hover:bg-amber-500/10 text-dark-400 hover:text-amber-400 transition-colors">
            <HiOutlinePencil className="w-4 h-4" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setDeleteModal({ show: true, faculty: row })} className="p-2 rounded-lg hover:bg-red-500/10 text-dark-400 hover:text-red-400 transition-colors">
            <HiOutlineTrash className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Faculty</h2>
          <p className="text-dark-400 text-sm mt-1">Manage all faculty members</p>
        </div>
        <Button icon={HiOutlinePlus} onClick={() => { setEditFaculty(null); setShowForm(true); }}>
          Add Faculty
        </Button>
      </div>

      <div className="relative max-w-md">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
        <input
          type="text"
          placeholder="Search faculty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600/30 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
        />
      </div>

      <Table columns={columns} data={faculty} loading={loading} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} icon={HiOutlineChevronLeft}>Prev</Button>
          <span className="text-sm text-dark-400 px-4">Page {page} of {totalPages}</span>
          <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}

      {showForm && <FacultyForm faculty={editFaculty} onClose={() => { setShowForm(false); setEditFaculty(null); }} onSuccess={handleFormSuccess} />}

      <Modal isOpen={deleteModal.show} onClose={() => setDeleteModal({ show: false, faculty: null })} title="Delete Faculty" size="sm">
        <div className="space-y-4">
          <p className="text-dark-300">
            Are you sure you want to delete <span className="text-white font-semibold">{deleteModal.faculty?.user?.name || deleteModal.faculty?.name}</span>?
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeleteModal({ show: false, faculty: null })}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={viewModal.show} onClose={() => setViewModal({ show: false, faculty: null })} title="Faculty Details" size="md">
        {viewModal.faculty && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                {viewModal.faculty.user?.name?.charAt(0)?.toUpperCase() || viewModal.faculty.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{viewModal.faculty.user?.name || viewModal.faculty.name}</h3>
                <p className="text-dark-400">{viewModal.faculty.user?.email || viewModal.faculty.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                ['Employee ID', viewModal.faculty.employee_id],
                ['Department', viewModal.faculty.department?.name || viewModal.faculty.department],
                ['Designation', viewModal.faculty.designation || '—'],
                ['Qualification', viewModal.faculty.qualification || '—'],
                ['Phone', viewModal.faculty.phone || '—'],
                ['Joining Date', viewModal.faculty.joining_date || '—'],
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
