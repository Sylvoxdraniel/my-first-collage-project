import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Check, X, FileText, Search, Filter, Calendar, 
  ExternalLink, ArrowDownToLine 
} from 'lucide-react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';

export default function AdmissionsManager() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/admissions?status=${statusFilter}&search=${search}`);
      setAdmissions(res.data);
    } catch (err) {
      toast.error('Failed to load admission applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [statusFilter, search]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`/admissions/${id}`, { status: newStatus });
      toast.success(res.data.message || `Application ${newStatus} successfully.`);
      fetchAdmissions();
    } catch (err) {
      toast.error('Failed to update application status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application permanently?')) return;
    try {
      const res = await axios.delete(`/admissions/${id}`);
      toast.success(res.data.message || 'Application deleted successfully.');
      fetchAdmissions();
    } catch (err) {
      toast.error('Failed to delete application.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Online Admissions Manager</h2>
          <p className="text-xs text-dark-400">Review and approve online applications submitted by prospective students.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-dark-900/60 p-4 rounded-xl border border-dark-800/40">
        <div className="flex items-center gap-2 bg-dark-950/80 border border-dark-800 rounded px-3 py-1.5 w-full">
          <Search size={14} className="text-dark-400" />
          <input 
            type="text" 
            placeholder="Search student, email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none w-full text-white"
          />
        </div>

        <div className="flex items-center gap-2 bg-dark-950/80 border border-dark-800 rounded px-3 py-1.5 w-full">
          <Filter size={14} className="text-dark-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none w-full text-white"
          >
            <option value="all" className="bg-dark-900 text-white">All Statuses</option>
            <option value="pending" className="bg-dark-900 text-white">Pending</option>
            <option value="approved" className="bg-dark-900 text-white">Approved</option>
            <option value="rejected" className="bg-dark-900 text-white">Rejected</option>
          </select>
        </div>
      </div>

      {/* Grid of Applications */}
      {loading ? (
        <div className="text-center py-20 text-xs text-dark-500">Loading admission lists...</div>
      ) : admissions.length === 0 ? (
        <div className="text-center py-20 text-xs text-dark-500">No admission applications found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {admissions.map((app) => (
            <Card key={app.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-base">{app.student_name}</h4>
                  <p className="text-xs text-dark-400">Course Selection: <span className="text-primary-400 font-bold">{app.course_selection}</span></p>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  app.status === 'approved' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                    : app.status === 'rejected' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/20' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
                }`}>
                  {app.status}
                </span>
              </div>

              {/* Data list */}
              <div className="grid grid-cols-2 gap-3 text-xs border-y border-dark-800/40 py-3 text-dark-300">
                <p>**Father**: {app.father_name}</p>
                <p>**Mother**: {app.mother_name}</p>
                <p>**Email**: {app.email}</p>
                <p>**Mobile**: {app.mobile_number}</p>
                <p>**Gender**: {app.gender} | **DOB**: {app.dob}</p>
                <p>**Category**: {app.category}</p>
                <p className="col-span-2">**Aadhaar**: {app.aadhaar_number}</p>
                <p className="col-span-2">**Address**: {app.address}</p>
              </div>

              {/* Document attachment & controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div>
                  {app.document_path ? (
                    <a 
                      href={`/api${app.document_path}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      <FileText size={14} /> View Uploaded Document <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-xs text-dark-500">No document attached</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {app.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(app.id, 'approved')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs p-1.5 rounded flex items-center gap-1 shadow"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(app.id, 'rejected')}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs p-1.5 rounded flex items-center gap-1 shadow"
                      >
                        <X size={14} /> Reject
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDelete(app.id)}
                    className="border border-dark-700 hover:bg-dark-800 text-red-400 hover:text-red-300 font-bold text-xs p-1.5 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
