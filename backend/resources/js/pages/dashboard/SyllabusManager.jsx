import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, FileText, Download } from 'lucide-react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export default function SyllabusManager() {
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [courseName, setCourseName] = useState('BA');
  const [semester, setSemester] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchSyllabi = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/public/syllabus');
      setSyllabi(res.data);
    } catch (err) {
      toast.error('Failed to load syllabus records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabi();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      toast.error('Please choose a syllabus PDF file to upload.');
      return;
    }

    setSubmitting(true);
    const postData = new FormData();
    postData.append('course_name', courseName);
    postData.append('semester', semester);
    postData.append('pdf', pdfFile);

    try {
      await axios.post('/syllabus', postData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Syllabus uploaded successfully.');
      setIsOpen(false);
      setPdfFile(null);
      fetchSyllabi();
    } catch (err) {
      toast.error('Failed to upload syllabus.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this syllabus document permanently?')) return;
    try {
      await axios.delete(`/syllabus/${id}`);
      toast.success('Syllabus deleted successfully.');
      fetchSyllabi();
    } catch (err) {
      toast.error('Failed to delete syllabus.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Syllabus PDF Manager</h2>
          <p className="text-xs text-dark-400">Upload Magadh University (MU) syllabus documents for students to download.</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="flex items-center gap-1">
          <Plus size={16} /> Upload Syllabus
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-dark-500">Loading syllabus records...</div>
      ) : syllabi.length === 0 ? (
        <div className="text-center py-20 text-xs text-dark-500">No syllabus uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {syllabi.map((s) => (
            <Card key={s.id} className="p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20 shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{s.course_name}</h4>
                  <p className="text-[10px] text-dark-400">Semester {s.semester}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <a 
                  href={`/api${s.pdf_path}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-dark-850 hover:bg-dark-800 border border-dark-700 text-blue-400"
                >
                  <Download size={14} />
                </a>
                <button 
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 rounded bg-dark-850 hover:bg-dark-800 border border-dark-700 text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Upload Syllabus Document">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-dark-300 uppercase block mb-1">Course Name</label>
              <select
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full bg-dark-950/80 border border-dark-800 rounded-lg p-2 text-xs text-white focus:outline-none"
              >
                <option value="BA">Bachelor of Arts (BA)</option>
                <option value="BSc Mathematics">BSc Mathematics</option>
                <option value="BSc Biology">BSc Biology</option>
                <option value="BCA">BCA</option>
                <option value="BA BEd Integrated">BA BEd Integrated</option>
                <option value="BSc BEd Integrated">BSc BEd Integrated</option>
                <option value="MSc Botany">MSc Botany</option>
                <option value="MSc Chemistry">MSc Chemistry</option>
                <option value="MSc Mathematics">MSc Mathematics</option>
                <option value="MSc Physics">MSc Physics</option>
                <option value="MSc Zoology">MSc Zoology</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-dark-300 uppercase block mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value))}
                className="w-full bg-dark-950/80 border border-dark-800 rounded-lg p-2 text-xs text-white focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-dark-300 uppercase block mb-1">Select Syllabus PDF *</label>
            <input 
              type="file" required accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="w-full text-xs text-dark-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-dark-800 file:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Uploading...' : 'Upload Syllabus'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
