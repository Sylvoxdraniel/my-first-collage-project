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
  HiOutlineAcademicCap,
  HiOutlineX,
} from 'react-icons/hi';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import FacultyForm from './FacultyForm';
import facultyApi from '../../api/facultyApi';
import toast from 'react-hot-toast';

/* Designation colour mapping */
const DESIGNATION_COLORS = {
  Professor:       'bg-purple-500/15 text-purple-400 border border-purple-500/20',
  'Assoc. Professor': 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  'Asst. Professor':  'bg-accent-500/15 text-accent-400 border border-accent-500/20',
  Lecturer:        'bg-amber-500/15 text-amber-400 border border-amber-500/20',
};

export default function FacultyList() {
  const [faculty, setFaculty]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [showForm, setShowForm]         = useState(false);
  const [editFaculty, setEditFaculty]   = useState(null);
  const [deleteModal, setDeleteModal]   = useState({ show: false, faculty: null });
  const [deleting, setDeleting]         = useState(false);
  const [viewModal, setViewModal]       = useState({ show: false, faculty: null });
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);

  useEffect(() => { fetchFaculty(); }, [page]);

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
      render: (val) => (
        <span className="font-mono text-xs px-2 py-1 rounded-md bg-accent-500/10 text-accent-400 border border-accent-500/20">
          {val}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'Faculty Member',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
            {u?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{u?.name}</p>
            <p className="text-xs text-dark-500 mt-0.5">{u?.email}</p>
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
      render: (val) => {
        const cls = DESIGNATION_COLORS[val] || 'bg-dark-700/50 text-dark-300 border border-dark-600/30';
        return val
          ? <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${cls}`}>{val}</span>
          : <span className="text-dark-600">—</span>;
      },
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (val) => (
        <span className="text-dark-400 text-sm">{val || <span className="text-dark-600">—</span>}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setViewModal({ show: true, faculty: row })}
            className="p-2 rounded-lg hover:bg-blue-500/15 text-dark-400 hover:text-blue-400 transition-colors"
            title="View"
          >
            <HiOutlineEye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => { setEditFaculty(row); setShowForm(true); }}
            className="p-2 rounded-lg hover:bg-amber-500/15 text-dark-400 hover:text-amber-400 transition-colors"
            title="Edit"
          >
            <HiOutlinePencil className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setDeleteModal({ show: true, faculty: row })}
            className="p-2 rounded-lg hover:bg-red-500/15 text-dark-400 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-500/15 flex items-center justify-center">
            <HiOutlineAcademicCap className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Faculty</h2>
            <p className="text-dark-400 text-xs mt-0.5">Manage college faculty members and staff</p>
          </div>
        </div>
        <Button icon={HiOutlinePlus} onClick={() => { setEditFaculty(null); setShowForm(true); }}>
          Add Faculty
        </Button>
      </motion.div>

      {/* ── Search ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-md"
      >
        <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
        <input
          type="text"
          placeholder="Search by name, email or employee ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-dark-800/60 border border-dark-600/40 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/60 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white"
          >
            <HiOutlineX className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      {/* ── Table ── */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Table columns={columns} data={faculty} loading={loading} />
      </motion.div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} icon={HiOutlineChevronLeft}>
            Prev
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                  page === i + 1
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-dark-400 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next <HiOutlineChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* ── Faculty Form Modal ── */}
      {showForm && (
        <FacultyForm
          faculty={editFaculty}
          onClose={() => { setShowForm(false); setEditFaculty(null); }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* ── Delete Confirmation ── */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, faculty: null })}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0">
              <HiOutlineTrash className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-sm text-dark-300 leading-relaxed">
              Are you sure you want to permanently remove{' '}
              <span className="text-white font-semibold">{deleteModal.faculty?.user?.name || deleteModal.faculty?.name}</span>{' '}
              from the system? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteModal({ show: false, faculty: null })}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete Faculty</Button>
          </div>
        </div>
      </Modal>

      {/* ── View Faculty Modal ── */}
      <Modal
        isOpen={viewModal.show}
        onClose={() => setViewModal({ show: false, faculty: null })}
        title="Faculty Profile"
        size="md"
      >
        {viewModal.faculty && (
          <div className="space-y-5">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/40 border border-dark-700/30">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {(viewModal.faculty.user?.name || viewModal.faculty.name)?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {viewModal.faculty.user?.name || viewModal.faculty.name}
                </h3>
                <p className="text-dark-400 text-sm">
                  {viewModal.faculty.user?.email || viewModal.faculty.email}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-accent-500/10 text-accent-400 text-xs font-semibold font-mono">
                  {viewModal.faculty.employee_id}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Department',   viewModal.faculty.department?.name || viewModal.faculty.department],
                ['Designation',  viewModal.faculty.designation || '—'],
                ['Qualification',viewModal.faculty.qualification || '—'],
                ['Phone',        viewModal.faculty.phone || '—'],
                ['Joining Date', viewModal.faculty.joining_date || '—'],
              ].map(([label, val]) => (
                <div key={label} className="p-3 rounded-xl bg-dark-800/40 border border-dark-700/30">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-dark-500 mb-1">{label}</p>
                  <p className="text-sm text-white font-medium">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
