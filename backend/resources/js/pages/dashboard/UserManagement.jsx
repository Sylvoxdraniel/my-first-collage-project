import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineUserAdd, HiOutlineMail, HiOutlineLockClosed,
  HiOutlineUser, HiOutlineShieldCheck, HiOutlineTrash,
  HiOutlineSearch, HiOutlineRefresh, HiOutlineEye, HiOutlineEyeOff,
  HiOutlinePencil
} from 'react-icons/hi';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const togglePasswordReveal = (userId) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setCreating(true);
    try {
      await api.post('/users', form);
      toast.success(`${form.role === 'student' ? 'Student' : 'Faculty'} account created successfully!`);
      setForm({ name: '', email: '', password: '', role: 'student' });
      setShowCreateModal(false);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create user';
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (user) => {
    if (!confirm(`Are you sure you want to delete "${user.name}"? This action cannot be undone.`)) return;
    try {
      await api.delete(`/users/${user.id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete user';
      toast.error(msg);
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
    });
    setShowEditModal(true);
    setShowPassword(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.email) {
      toast.error('Name and Email are required');
      return;
    }
    if (editForm.password && editForm.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setUpdating(true);
    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
      };
      if (editForm.password) {
        payload.password = editForm.password;
      }
      await api.put(`/users/${editUser.id}`, payload);
      toast.success('User credentials updated successfully!');
      setShowEditModal(false);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update user';
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const name = u.name || '';
    const email = u.email || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleColors = {
    admin: 'bg-red-500/15 text-red-400 border-red-500/30',
    faculty: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    student: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-dark-400 text-sm mt-1">Create and manage login credentials for students and faculty</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowCreateModal(true); setShowPassword(false); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow"
        >
          <HiOutlineUserAdd className="w-5 h-5" />
          Create New User
        </motion.button>
      </div>

      {/* Filters Bar */}
      <div className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600/50 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'student', 'faculty', 'admin'].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                filterRole === role
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                  : 'bg-dark-800/50 text-dark-400 border border-dark-600/30 hover:text-white'
              }`}
            >
              {role === 'all' ? 'All Roles' : role}
            </button>
          ))}
        </div>
        <button
          onClick={fetchUsers}
          className="p-2.5 rounded-xl bg-dark-800/50 border border-dark-600/30 text-dark-400 hover:text-white transition-colors"
          title="Refresh"
        >
          <HiOutlineRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Users Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto" />
            <p className="text-dark-400 text-sm mt-3">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <HiOutlineUser className="w-12 h-12 text-dark-600 mx-auto mb-3" />
            <p className="text-dark-400 text-sm">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="px-5 py-3.5 text-xs font-bold text-dark-400 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-dark-400 uppercase tracking-wider">Email (Login ID)</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-dark-400 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-dark-400 uppercase tracking-wider">Password</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-dark-400 uppercase tracking-wider">Created</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-dark-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/30">
                {filteredUsers.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-dark-800/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {u.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="text-sm font-medium text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-dark-300 font-mono">{u.email}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${roleColors[u.role] || 'bg-dark-700 text-dark-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-dark-300">
                          {revealedPasswords[u.id] ? (u.plain_password || 'N/A') : '••••••••'}
                        </span>
                        {u.plain_password && (
                          <button
                            type="button"
                            onClick={() => togglePasswordReveal(u.id)}
                            className="text-dark-500 hover:text-white transition-colors focus:outline-none"
                            title={revealedPasswords[u.id] ? "Hide Password" : "Show Password"}
                          >
                            {revealedPasswords[u.id] ? (
                              <HiOutlineEyeOff className="w-4 h-4" />
                            ) : (
                              <HiOutlineEye className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-dark-400">{formatDate(u.created_at)}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditClick(u)}
                          className="p-2 rounded-lg hover:bg-amber-500/10 text-dark-500 hover:text-amber-400 transition-colors"
                          title="Edit Credentials"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </motion.button>
                        {u.role !== 'admin' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(u)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-dark-500 hover:text-red-400 transition-colors"
                            title="Delete User"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats Footer */}
        <div className="px-5 py-3 border-t border-dark-700/30 flex gap-4 text-xs text-dark-400">
          <span>Total: <strong className="text-white">{users.length}</strong></span>
          <span>Students: <strong className="text-emerald-400">{users.filter(u => u.role === 'student').length}</strong></span>
          <span>Faculty: <strong className="text-amber-400">{users.filter(u => u.role === 'faculty').length}</strong></span>
          <span>Admins: <strong className="text-red-400">{users.filter(u => u.role === 'admin').length}</strong></span>
        </div>
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="glass-strong rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <HiOutlineUserAdd className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Create New User</h2>
                  <p className="text-xs text-dark-400">Admin creates login credentials</p>
                </div>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {/* Role Selection - prominent at top */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Account Type *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'student', label: 'Student', icon: '🎓', desc: 'Student portal access' },
                      { value: 'faculty', label: 'Faculty', icon: '👨‍🏫', desc: 'Teacher portal access' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, role: opt.value })}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          form.role === opt.value
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-dark-600/50 bg-dark-800/30 hover:border-dark-500'
                        }`}
                      >
                        <div className="text-xl mb-1">{opt.icon}</div>
                        <p className={`text-sm font-bold ${form.role === opt.value ? 'text-primary-400' : 'text-white'}`}>{opt.label}</p>
                        <p className="text-[10px] text-dark-400">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter full name"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600/50 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Email / Login ID */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Email (Login ID) *</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="user@college.com"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600/50 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Password *</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Min 8 characters"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600/50 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff className="w-4 h-4" />
                      ) : (
                        <HiOutlineEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-dark-500 mt-1">Click the see button to toggle password visibility</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-dark-700/50 border border-dark-600/30 text-dark-300 hover:text-white font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <HiOutlineUserAdd className="w-4 h-4" />
                        Create Account
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => { setShowEditModal(false); setEditUser(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="glass-strong rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-primary-500 flex items-center justify-center">
                  <HiOutlinePencil className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Edit Credentials</h2>
                  <p className="text-xs text-dark-400">Update credentials for {editUser?.name}</p>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Enter full name"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600/50 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Email / Login ID */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Email (Login ID) *</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="user@college.com"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600/50 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">New Password (Optional)</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      placeholder="Leave blank to keep current"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-dark-800/50 border border-dark-600/50 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff className="w-4 h-4" />
                      ) : (
                        <HiOutlineEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-dark-500 mt-1">Leave blank to keep the current password unchanged.</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowEditModal(false); setEditUser(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-dark-700/50 border border-dark-600/30 text-dark-300 hover:text-white font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={updating}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-primary-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {updating ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <HiOutlinePencil className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
