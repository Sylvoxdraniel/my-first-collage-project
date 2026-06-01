import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Check, X, FileText, Search, Filter, Calendar, 
  ExternalLink, ArrowDownToLine, Plus, Edit2, Trash2
} from 'lucide-react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';

export default function AdmissionsManager() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [activeSubTab, setActiveSubTab] = useState('applications'); // 'applications' | 'fees'

  // Fee Structures State
  const [feeList, setFeeList] = useState([]);
  const [feesLoading, setFeesLoading] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [feeForm, setFeeForm] = useState({
    id: null,
    course_name: 'BA',
    tuition_fee: '',
    lab_charges: '',
    year: '2026-27'
  });
  const [selectedFeeCourse, setSelectedFeeCourse] = useState('BA');

  useEffect(() => {
    if (showFeeModal) {
      const predefinedCourses = ['BA', 'BSc Mathematics', 'BSc Biology', 'BCA', 'BA BEd Integrated', 'BSc BEd Integrated', 'MSc Botany', 'MSc Chemistry', 'MSc Mathematics', 'MSc Zoology'];
      if (feeForm.course_name) {
        if (predefinedCourses.includes(feeForm.course_name)) {
          setSelectedFeeCourse(feeForm.course_name);
        } else {
          setSelectedFeeCourse('Other');
        }
      } else {
        setSelectedFeeCourse('BA');
      }
    }
  }, [showFeeModal, feeForm.course_name]);

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
    if (activeSubTab === 'applications') {
      fetchAdmissions();
    }
  }, [statusFilter, search, activeSubTab]);

  const fetchFees = async () => {
    setFeesLoading(true);
    try {
      const res = await axios.get('/fee-structures');
      setFeeList(res.data);
    } catch (err) {
      toast.error('Failed to load fee structures.');
    } finally {
      setFeesLoading(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'fees') {
      fetchFees();
    }
  }, [activeSubTab]);

  const handleSaveFee = async (e) => {
    e.preventDefault();
    const payload = {
      ...feeForm,
      tuition_fee: parseInt(feeForm.tuition_fee, 10) || 0,
      lab_charges: parseInt(feeForm.lab_charges, 10) || 0,
    };
    try {
      if (feeForm.id) {
        await axios.put(`/fee-structures/${feeForm.id}`, payload);
        toast.success('Fee structure updated successfully.');
      } else {
        await axios.post('/fee-structures', payload);
        toast.success('Fee structure added successfully.');
      }
      setShowFeeModal(false);
      fetchFees();
    } catch (err) {
      toast.error('Failed to save fee structure.');
    }
  };

  const handleDeleteFee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee structure?')) return;
    try {
      await axios.delete(`/fee-structures/${id}`);
      toast.success('Fee structure deleted successfully.');
      fetchFees();
    } catch (err) {
      toast.error('Failed to delete fee structure.');
    }
  };

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
          <p className="text-xs text-dark-400">Review online student applications and configure course fee structures.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 bg-dark-900 border border-dark-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'applications'
                ? 'bg-primary-900 text-white shadow-md'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            Applications List
          </button>
          <button
            onClick={() => setActiveSubTab('fees')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'fees'
                ? 'bg-primary-900 text-white shadow-md'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            Fee Structure Config
          </button>
        </div>
      </div>

      {activeSubTab === 'applications' && (
        <>

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
      </>
      )}

      {activeSubTab === 'fees' && (
        <Card className="p-6 space-y-6 bg-dark-950 border-dark-800">
          <div className="flex justify-between items-center border-b border-dark-800/40 pb-4">
            <div>
              <h3 className="font-bold text-base text-white">Manage Course Fee Structures</h3>
              <p className="text-xs text-dark-400">Configure tuition fees and laboratory charges by course and academic year.</p>
            </div>
            <button
              onClick={() => {
                setFeeForm({ id: null, course_name: 'BA', tuition_fee: '', lab_charges: '', year: '2026-27' });
                setShowFeeModal(true);
              }}
              className="bg-primary-900 hover:bg-primary-850 text-white font-bold text-xs px-4 py-2 rounded-lg shadow flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Fee Structure
            </button>
          </div>

          {feesLoading ? (
            <div className="text-center py-10 text-xs text-dark-500">Loading fee structures...</div>
          ) : feeList.length === 0 ? (
            <div className="text-center py-10 text-xs text-dark-500">No fee structures defined. Click Add to create one.</div>
          ) : (
            <div className="border border-dark-800 rounded-xl overflow-hidden bg-dark-900/20">
              <table className="w-full text-left text-xs font-semibold">
                <thead className="bg-dark-900 text-dark-300 border-b border-dark-800 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Course Name</th>
                    <th className="p-3">Tuition Fee</th>
                    <th className="p-3">Lab Charges</th>
                    <th className="p-3">Total Fee</th>
                    <th className="p-3">Academic Year</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800 text-dark-200">
                  {feeList.map((fee) => (
                    <tr key={fee.id} className="hover:bg-dark-900/40">
                      <td className="p-3 font-bold text-white">{fee.course_name}</td>
                      <td className="p-3">₹ {Number(fee.tuition_fee).toLocaleString('en-IN')}</td>
                      <td className="p-3">₹ {Number(fee.lab_charges).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-primary-400 font-bold">₹ {Number(fee.total_fee).toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-dark-950 text-dark-400 border border-dark-800 rounded text-[10px] font-bold">
                          {fee.year}
                        </span>
                      </td>
                      <td className="p-3 text-right flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setFeeForm({
                              id: fee.id,
                              course_name: fee.course_name,
                              tuition_fee: fee.tuition_fee,
                              lab_charges: fee.lab_charges,
                              year: fee.year
                            });
                            setShowFeeModal(true);
                          }}
                          className="text-primary-400 hover:text-primary-300 font-bold text-xs flex items-center gap-1"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFee(fee.id)}
                          className="text-red-400 hover:text-red-300 font-bold text-xs flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Fee Structure Modal */}
      {showFeeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-950 border border-dark-800 p-6 rounded-2xl w-full max-w-md space-y-6 shadow-2xl">
            <h3 className="font-bold text-base text-white border-b border-dark-800 pb-3">
              {feeForm.id ? 'Edit Fee Structure' : 'Add Course Fee Structure'}
            </h3>

            <form onSubmit={handleSaveFee} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-dark-400 uppercase block mb-1">Course Selection *</label>
                <select
                  value={selectedFeeCourse}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedFeeCourse(val);
                    if (val !== 'Other') {
                      setFeeForm({ ...feeForm, course_name: val });
                    } else {
                      setFeeForm({ ...feeForm, course_name: '' });
                    }
                  }}
                  className="w-full bg-dark-900 border border-dark-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary-500"
                >
                  <option>BA</option>
                  <option>BSc Mathematics</option>
                  <option>BSc Biology</option>
                  <option>BCA</option>
                  <option>BA BEd Integrated</option>
                  <option>BSc BEd Integrated</option>
                  <option>MSc Botany</option>
                  <option>MSc Chemistry</option>
                  <option>MSc Mathematics</option>
                  <option>MSc Zoology</option>
                  <option>Other</option>
                </select>
                {selectedFeeCourse === 'Other' && (
                  <div className="space-y-1 mt-2">
                    <label className="text-[10px] font-bold text-dark-400 uppercase block mb-1">Specify Custom Course Name *</label>
                    <input
                      type="text"
                      required
                      value={feeForm.course_name}
                      onChange={(e) => setFeeForm({ ...feeForm, course_name: e.target.value })}
                      placeholder="Enter course name"
                      className="w-full bg-dark-900 border border-dark-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary-500"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-dark-400 uppercase block mb-1">Yearly Tuition Fee (INR) *</label>
                <input
                  type="number"
                  required
                  value={feeForm.tuition_fee}
                  onChange={(e) => setFeeForm({ ...feeForm, tuition_fee: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-dark-400 uppercase block mb-1">Lab Charges (INR)</label>
                <input
                  type="number"
                  value={feeForm.lab_charges}
                  onChange={(e) => setFeeForm({ ...feeForm, lab_charges: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-dark-400 uppercase block mb-1">Academic Year *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-27"
                  value={feeForm.year}
                  onChange={(e) => setFeeForm({ ...feeForm, year: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-dark-800">
                <button
                  type="button"
                  onClick={() => setShowFeeModal(false)}
                  className="flex-1 border border-dark-700 hover:bg-dark-800 text-dark-300 font-bold text-xs py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-900 hover:bg-primary-850 text-white font-bold text-xs py-2 rounded-lg shadow"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
