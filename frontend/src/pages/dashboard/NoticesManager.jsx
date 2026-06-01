import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Plus, Edit, Trash2, Calendar, FileDown, 
  AlertCircle, ShieldAlert 
} from 'lucide-react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function NoticesManager() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [isImportant, setIsImportant] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/public/notices');
      setNotices(res.data);
    } catch (err) {
      toast.error('Failed to load notices list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openAddModal = () => {
    setTitle('');
    setContent('');
    setCategory('general');
    setIsImportant(false);
    setPdfFile(null);
    setIsEditMode(false);
    setSelectedId(null);
    setIsOpen(true);
  };

  const openEditModal = (notice) => {
    setTitle(notice.title);
    setContent(notice.content);
    setCategory(notice.category);
    setIsImportant(notice.is_important);
    setPdfFile(null);
    setIsEditMode(true);
    setSelectedId(notice.id);
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Title and Content are required.');
      return;
    }

    setSubmitting(true);
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('category', category);
    postData.append('is_important', isImportant ? '1' : '0');
    if (pdfFile) {
      postData.append('pdf', pdfFile);
    }

    try {
      if (isEditMode) {
        // Laravel PUT method spoofing for FormData multipart uploads
        postData.append('_method', 'PUT');
        await axios.post(`/notices/${selectedId}`, postData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Notice updated successfully.');
      } else {
        await axios.post('/notices', postData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Notice published successfully.');
      }
      setIsOpen(false);
      fetchNotices();
    } catch (err) {
      toast.error('Error saving notice publication.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice permanently?')) return;
    try {
      await axios.delete(`/notices/${id}`);
      toast.success('Notice deleted successfully.');
      fetchNotices();
    } catch (err) {
      toast.error('Failed to delete notice.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Dynamic Announcements Board</h2>
          <p className="text-xs text-dark-400">Add, edit, or remove notices on the public website notice boards.</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-1">
          <Plus size={16} /> Publish Notice
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-dark-500">Loading published announcements...</div>
      ) : notices.length === 0 ? (
        <div className="text-center py-20 text-xs text-dark-500">No notices published. Create one now.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notices.map((n) => (
            <Card key={n.id} className="p-6 flex flex-col justify-between h-56">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-primary-500/10 text-primary-400">
                      {n.category}
                    </span>
                    {n.is_important && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 flex items-center gap-0.5">
                        <AlertCircle size={10} /> Important
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-dark-400 font-mono flex items-center gap-1">
                    <Calendar size={12} /> {n.created_at.slice(0, 10)}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm line-clamp-1">{n.title}</h4>
                <p className="text-xs text-dark-300 line-clamp-2 leading-relaxed">{n.content}</p>
              </div>

              <div className="flex items-center justify-between border-t border-dark-800/40 pt-4 mt-4">
                <div>
                  {n.pdf_path ? (
                    <a 
                      href={`/api${n.pdf_path}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <FileDown size={14} /> PDF Attachment
                    </a>
                  ) : (
                    <span className="text-xs text-dark-500">No file attached</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(n)}
                    className="p-1.5 rounded bg-dark-850 hover:bg-dark-800 border border-dark-700 text-yellow-400"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(n.id)}
                    className="p-1.5 rounded bg-dark-850 hover:bg-dark-800 border border-dark-700 text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* PUBLISH / EDIT MODAL */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={isEditMode ? 'Edit Notice publication' : 'Publish New Notice'}>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input 
            label="Notice Title *" 
            placeholder="e.g. UOK Semester Practical Exams Notice"
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-dark-300 uppercase tracking-wider">Notice Content *</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type announcement instructions details..."
              className="w-full bg-dark-950/80 border border-dark-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary-500 placeholder-dark-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-dark-300 uppercase block mb-1">Notice Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-dark-950/80 border border-dark-800 rounded-lg p-2 text-xs text-white focus:outline-none"
              >
                <option value="general">General</option>
                <option value="academic">Academic</option>
                <option value="exam">Examinations</option>
                <option value="admission">Admissions</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-dark-300 uppercase block mb-1">Attach PDF File</label>
              <input 
                type="file" 
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="w-full text-xs text-dark-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-dark-800 file:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="is_important" 
              checked={isImportant} 
              onChange={(e) => setIsImportant(e.target.checked)} 
              className="rounded border-dark-800 bg-dark-950"
            />
            <label htmlFor="is_important" className="text-[10px] font-bold text-dark-300 uppercase tracking-wider cursor-pointer">
              Mark as Important (Highlight Ticker)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Publishing...' : isEditMode ? 'Save Changes' : 'Publish Notice'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
