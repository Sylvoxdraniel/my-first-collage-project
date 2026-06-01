import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineBookOpen,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import CourseForm from './CourseForm';
import courseApi from '../../api/courseApi';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

export default function CourseList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, course: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCourses();
    if (searchParams.get('action') === 'add') {
      setEditCourse(null);
      setShowForm(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await courseApi.getAll({ search });
      setCourses(response.data.data || response.data);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchCourses, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteModal.course) return;
    setDeleting(true);
    try {
      await courseApi.delete(deleteModal.course.id);
      toast.success('Course deleted successfully');
      setDeleteModal({ show: false, course: null });
      fetchCourses();
    } catch {
      toast.error('Failed to delete course');
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditCourse(null);
    fetchCourses();
  };

  const filteredCourses = courses.filter((c) =>
    (c.name?.toLowerCase().includes(search.toLowerCase()) ||
     c.code?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Courses</h2>
          <p className="text-dark-400 text-sm mt-1">Manage all courses offered</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'faculty') && (
          <Button icon={HiOutlinePlus} onClick={() => { setEditCourse(null); setShowForm(true); }}>
            Add Course
          </Button>
        )}
      </div>

      <div className="relative max-w-md">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600/30 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
        />
      </div>

      {/* Course Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="h-5 bg-dark-700 rounded w-3/4 mb-3" />
              <div className="h-4 bg-dark-700 rounded w-1/2 mb-4" />
              <div className="h-4 bg-dark-700 rounded w-full mb-2" />
              <div className="h-4 bg-dark-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <HiOutlineBookOpen className="w-12 h-12 text-dark-600 mx-auto mb-3" />
          <p className="text-dark-400">No courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 group relative overflow-hidden"
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-xs font-mono text-primary-400 mt-1">{course.code}</p>
                </div>
                {(user?.role === 'admin' || user?.role === 'faculty') && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { setEditCourse(course); setShowForm(true); }}
                      className="p-1.5 rounded-lg hover:bg-amber-500/10 text-dark-400 hover:text-amber-400 transition-colors"
                    >
                      <HiOutlinePencil className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDeleteModal({ show: true, course })}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-dark-400 hover:text-red-400 transition-colors"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="primary">{course.department?.name || course.department || 'N/A'}</Badge>
                  <Badge variant="info">Sem {course.semester}</Badge>
                  <Badge variant="success">
                    {course.type === 'phd' ? 'PhD' : course.type === 'pg' ? 'PG' : 'UG'}
                  </Badge>
                </div>
                {course.faculty && (
                  <div className="flex items-center gap-2 text-dark-400 text-xs">
                    <HiOutlineUserGroup className="w-3.5 h-3.5" />
                    <span>{course.faculty?.user?.name || course.faculty?.name || course.faculty}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-dark-500 pt-2 border-t border-dark-700/30">
                  <span>{course.credits} Credits</span>
                  {course.description && (
                    <span className="truncate ml-2 max-w-[150px]" title={course.description}>
                      {course.description}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showForm && <CourseForm course={editCourse} onClose={() => { setShowForm(false); setEditCourse(null); }} onSuccess={handleFormSuccess} />}

      <Modal isOpen={deleteModal.show} onClose={() => setDeleteModal({ show: false, course: null })} title="Delete Course" size="sm">
        <div className="space-y-4">
          <p className="text-dark-300">
            Are you sure you want to delete <span className="text-white font-semibold">{deleteModal.course?.name}</span>?
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeleteModal({ show: false, course: null })}>Cancel</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
