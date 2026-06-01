import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Camera, Filter, LayoutGrid, Upload, 
  FileText, CheckCircle, XCircle, Loader2, Download 
} from 'lucide-react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import * as XLSX from 'xlsx';

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Single form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('campus');
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Bulk import states
  const [excelFile, setExcelFile] = useState(null);
  const [photosMap, setPhotosMap] = useState({});
  const [bulkRows, setBulkRows] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/public/gallery?category=${categoryFilter}`);
      setImages(res.data);
    } catch (err) {
      toast.error('Failed to load gallery images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [categoryFilter]);

  const mapCategory = (cat) => {
    if (!cat) return 'campus';
    const c = cat.toString().toLowerCase().trim();
    if (c.includes('campus') || c.includes('infra')) return 'campus';
    if (c.includes('event') || c.includes('func')) return 'event';
    if (c.includes('sport') || c.includes('tourn')) return 'sports';
    if (c.includes('cultur') || c.includes('fest')) return 'cultural';
    if (c.includes('fac') || c.includes('teach') || c.includes('staff') || c.includes('member')) return 'faculty';
    return 'campus'; // default fallback
  };

  const getCategoryLabel = (slug) => {
    switch (slug) {
      case 'campus': return 'Campus Infrastructure';
      case 'event': return 'Events & Functions';
      case 'sports': return 'Sports Tournaments';
      case 'cultural': return 'Cultural Fests';
      case 'faculty': return 'Faculty Members';
      default: return slug;
    }
  };

  const validateRows = (rows, filesMap) => {
    return rows.map(row => {
      if (!row.filename) {
        return { ...row, status: 'missing', error: 'No filename specified' };
      }
      const matched = filesMap[row.filename.toLowerCase()];
      if (matched) {
        return { ...row, status: 'ready', file: matched, error: null };
      } else {
        return { ...row, status: 'missing', file: null, error: 'Photo file not selected' };
      }
    });
  };

  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setExcelFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws);
        
        const parsed = rawData.map((row, idx) => {
          let titleVal = '';
          let catVal = '';
          let fileVal = '';

          Object.keys(row).forEach(key => {
            const k = key.toLowerCase().trim();
            if (k.includes('title') || k.includes('caption') || k.includes('name')) {
              titleVal = row[key];
            } else if (k.includes('category') || k.includes('cat')) {
              catVal = row[key];
            } else if (k.includes('filename') || k.includes('file') || k.includes('photo') || k.includes('image')) {
              fileVal = row[key];
            }
          });

          return {
            id: idx + 1,
            title: titleVal || '',
            category: mapCategory(catVal),
            filename: fileVal || '',
            status: 'pending',
          };
        });
        
        setBulkRows(validateRows(parsed, photosMap));
      } catch (err) {
        toast.error('Failed to parse Excel file.');
        console.error(err);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    const newMap = {};
    files.forEach(f => {
      newMap[f.name.toLowerCase()] = f;
    });
    setPhotosMap(newMap);
    setBulkRows(prev => validateRows(prev, newMap));
  };

  const handleBulkImport = async () => {
    const readyRows = bulkRows.filter(r => r.status === 'ready');
    if (readyRows.length === 0) {
      toast.error('No ready rows to import. Select photo files matching the Excel filenames.');
      return;
    }

    setImporting(true);
    setImportProgress({ current: 0, total: readyRows.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < readyRows.length; i++) {
      const row = readyRows[i];
      setBulkRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'uploading' } : r));

      const postData = new FormData();
      postData.append('title', row.title);
      postData.append('category', row.category);
      postData.append('image', row.file);

      try {
        await axios.post('/gallery', postData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        successCount++;
        setBulkRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'success' } : r));
      } catch (err) {
        failCount++;
        setBulkRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'failed', error: 'Upload failed' } : r));
      }
      setImportProgress(prev => ({ ...prev, current: i + 1 }));
    }

    setImporting(false);
    toast.success(`Import complete! ${successCount} successful, ${failCount} failed.`);
    fetchImages();
  };

  const downloadSampleExcel = () => {
    const data = [
      { Title: 'Annual Convocation Chief Guest', Category: 'Events', Filename: 'convocation.jpg' },
      { Title: 'Computer Center Lab interior', Category: 'Campus', Filename: 'comp_lab.png' },
      { Title: 'Volleyball Tournament Finals winner', Category: 'Sports', Filename: 'sports_day.jpg' },
      { Title: 'Rangoli Competition winners', Category: 'Cultural', Filename: 'fest_art.jpg' },
      { Title: 'Senior Physics Professor and Scholars', Category: 'Faculty', Filename: 'physics_faculty.jpg' }
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Gallery Schema');
    XLSX.writeFile(wb, 'gallery_sample_template.xlsx');
    toast.success('Downloaded sample template.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please choose an image file to upload.');
      return;
    }

    setSubmitting(true);
    const postData = new FormData();
    postData.append('title', title);
    postData.append('category', category);
    postData.append('image', imageFile);

    try {
      await axios.post('/gallery', postData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Image uploaded to public gallery successfully.');
      setIsOpen(false);
      setTitle('');
      setImageFile(null);
      fetchImages();
    } catch (err) {
      toast.error('Failed to upload image.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image permanently from public gallery?')) return;
    try {
      await axios.delete(`/gallery/${id}`);
      toast.success('Image deleted successfully.');
      fetchImages();
    } catch (err) {
      toast.error('Failed to delete image.');
    }
  };

  const resetBulkStates = () => {
    setExcelFile(null);
    setPhotosMap({});
    setBulkRows([]);
    setImporting(false);
    setIsBulkOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Public Gallery Manager</h2>
          <p className="text-xs text-dark-400">Post photos of academic convocations, sports, and cultural festivals.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setIsBulkOpen(true)} variant="secondary" className="flex items-center gap-1 w-full sm:w-auto">
            <Upload size={16} /> Bulk Import (Excel)
          </Button>
          <Button onClick={() => setIsOpen(true)} className="flex items-center gap-1 w-full sm:w-auto">
            <Plus size={16} /> Upload Photo
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-dark-900/60 p-4 rounded-xl border border-dark-800/40">
        <div className="flex items-center gap-2 bg-dark-950/80 border border-dark-800 rounded px-3 py-1.5 w-full">
          <Filter size={14} className="text-dark-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none w-full text-white"
          >
            <option value="all" className="bg-dark-900 text-white">All Categories</option>
            <option value="campus" className="bg-dark-900 text-white">Campus Infrastructure</option>
            <option value="event" className="bg-dark-900 text-white">Events & Functions</option>
            <option value="sports" className="bg-dark-900 text-white">Sports Tournaments</option>
            <option value="cultural" className="bg-dark-900 text-white">Cultural Fests</option>
            <option value="faculty" className="bg-dark-900 text-white">Faculty Members</option>
          </select>
        </div>
      </div>

      {/* Small Previews Grid */}
      {loading ? (
        <div className="text-center py-20 text-xs text-dark-500">Loading gallery photos...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-xs text-dark-500">No photos in this category.</div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group border border-dark-800 rounded-xl overflow-hidden shadow-sm bg-dark-900 aspect-square">
              <img 
                src={`/api${img.image_path}`} 
                alt={img.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5 text-white">
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleDelete(img.id)}
                    className="p-1 rounded bg-red-600/80 hover:bg-red-600 text-white focus:outline-none"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
                <div>
                  <span className="text-[7px] bg-yellow-500 text-slate-950 px-1 py-0.5 rounded font-black uppercase">
                    {img.category}
                  </span>
                  <p className="text-[9px] font-bold mt-1 line-clamp-1">{img.title || 'Gautam Budha Mahila College'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SINGLE PHOTO UPLOAD MODAL */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Upload Image to Public Gallery">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-dark-300 uppercase block mb-1">Image Title / Caption</label>
            <input 
              type="text"
              placeholder="e.g. Gold Medalist Ceremony 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-dark-950/80 border border-dark-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-dark-300 uppercase block mb-1">Gallery Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-dark-950/80 border border-dark-800 rounded-lg p-2 text-xs text-white focus:outline-none"
              >
                <option value="campus">Campus Infrastructure</option>
                <option value="event">Events & Functions</option>
                <option value="sports">Sports Tournaments</option>
                <option value="cultural">Cultural Fests</option>
                <option value="faculty">Faculty Members</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-dark-300 uppercase block mb-1">Select Photo *</label>
              <input 
                type="file" required
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full text-xs text-dark-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-dark-800 file:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* EXCEL BULK IMPORT MODAL */}
      <Modal isOpen={isBulkOpen} onClose={resetBulkStates} title="Excel Bulk Import Gallery Images" size="lg">
        <div className="space-y-5 text-xs text-white">
          <div className="bg-dark-950/50 p-4 rounded-xl border border-dark-800/40 space-y-3">
            <h4 className="font-bold text-yellow-400 flex items-center gap-1.5">
              💡 Instructions for Excel Bulk Upload
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-dark-300 text-[11px]">
              <li>Prepare an Excel file with columns: <strong>Title</strong>, <strong>Category</strong>, and <strong>Photo Filename</strong>.</li>
              <li>Categories allowed: <em>Campus</em>, <em>Events</em>, <em>Sports</em>, <em>Cultural</em>, or <em>Faculty</em>.</li>
              <li>Filenames must match the files you upload below exactly (e.g. <code>pic_1.jpg</code>).</li>
            </ul>
            <button 
              onClick={downloadSampleExcel}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2 focus:outline-none cursor-pointer"
            >
              <Download size={12} /> Download Sample Template Excel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-dark-300 uppercase block">1. Select Excel File (.xlsx, .xls, .csv)</label>
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv"
                onChange={handleExcelChange}
                className="w-full text-xs text-dark-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-dark-800 file:text-white cursor-pointer"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-dark-300 uppercase block">2. Select Corresponding Image Files (Select Multiple)</label>
              <input 
                type="file" 
                multiple
                accept="image/*"
                onChange={handlePhotosChange}
                className="w-full text-xs text-dark-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-dark-800 file:text-white cursor-pointer"
              />
            </div>
          </div>

          {/* Preview list */}
          {bulkRows.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-dark-200">Parsed Rows Preview ({bulkRows.length} items)</h4>
              <div className="border border-dark-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-dark-900 border-b border-dark-800 text-[10px] uppercase font-bold text-dark-400">
                      <th className="p-2 pl-3">#</th>
                      <th className="p-2">Title</th>
                      <th className="p-2">Category</th>
                      <th className="p-2">Photo Filename</th>
                      <th className="p-2 pr-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-800/40 text-[11px] text-dark-300">
                    {bulkRows.map((row) => (
                      <tr key={row.id} className="hover:bg-dark-900/30">
                        <td className="p-2 pl-3 text-dark-500">{row.id}</td>
                        <td className="p-2 font-medium text-white truncate max-w-[150px]">{row.title || <span className="italic text-dark-600">Untitled</span>}</td>
                        <td className="p-2">
                          <span className="bg-dark-800 text-dark-300 px-2 py-0.5 rounded text-[9px] uppercase font-bold">
                            {getCategoryLabel(row.category)}
                          </span>
                        </td>
                        <td className="p-2 font-mono text-dark-400 text-[10px]">{row.filename}</td>
                        <td className="p-2 pr-3">
                          {row.status === 'ready' && (
                            <span className="text-green-400 font-semibold flex items-center gap-1 text-[10px]">
                              <CheckCircle size={10} /> Ready
                            </span>
                          )}
                          {row.status === 'missing' && (
                            <span className="text-red-400 font-semibold flex items-center gap-1 text-[10px]" title={row.error}>
                              <XCircle size={10} /> {row.error}
                            </span>
                          )}
                          {row.status === 'uploading' && (
                            <span className="text-yellow-400 font-semibold flex items-center gap-1 text-[10px]">
                              <Loader2 size={10} className="animate-spin" /> Uploading...
                            </span>
                          )}
                          {row.status === 'success' && (
                            <span className="text-green-500 font-semibold flex items-center gap-1 text-[10px]">
                              <CheckCircle size={10} /> Imported
                            </span>
                          )}
                          {row.status === 'failed' && (
                            <span className="text-red-500 font-semibold flex items-center gap-1 text-[10px]">
                              <XCircle size={10} /> Failed
                            </span>
                          )}
                          {row.status === 'pending' && (
                            <span className="text-dark-500 font-semibold text-[10px]">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {importing && (
            <div className="space-y-1 bg-dark-950 p-3 rounded-lg border border-dark-800">
              <div className="flex justify-between items-center text-[10px] font-semibold text-dark-300">
                <span>IMPORT PROGRESS</span>
                <span>{importProgress.current} / {importProgress.total} IMAGES</span>
              </div>
              <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary-500 h-full transition-all duration-300"
                  style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-dark-800/40">
            <Button type="button" variant="ghost" onClick={resetBulkStates} disabled={importing}>Cancel</Button>
            <Button 
              type="button" 
              onClick={handleBulkImport} 
              disabled={importing || bulkRows.filter(r => r.status === 'ready').length === 0}
              className="flex items-center gap-1"
            >
              {importing ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Importing...
                </>
              ) : (
                'Start Import'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
