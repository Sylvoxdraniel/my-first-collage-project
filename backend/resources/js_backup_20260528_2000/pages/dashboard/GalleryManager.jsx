import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Camera, Filter, LayoutGrid } from 'lucide-react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('campus');
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Public Gallery Manager</h2>
          <p className="text-xs text-dark-400">Post photos of academic convocations, sports, and cultural festivals.</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="flex items-center gap-1">
          <Plus size={16} /> Upload Photo
        </Button>
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
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-xs text-dark-500">Loading gallery photos...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-xs text-dark-500">No photos in this category.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group border border-dark-800 rounded-xl overflow-hidden shadow-sm bg-dark-900">
              <img 
                src={`/api${img.image_path}`} 
                alt={img.title} 
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleDelete(img.id)}
                    className="p-1 rounded bg-red-600/80 hover:bg-red-600 text-white focus:outline-none"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div>
                  <span className="text-[8px] bg-yellow-500 text-slate-950 px-1.5 py-0.5 rounded font-black uppercase">
                    {img.category}
                  </span>
                  <p className="text-[10px] font-bold mt-1 truncate">{img.title || 'Gautam Budha Mahila College'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
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
    </div>
  );
}
