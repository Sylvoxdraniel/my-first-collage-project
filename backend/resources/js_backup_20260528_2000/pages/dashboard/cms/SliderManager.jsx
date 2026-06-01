import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, ArrowUp, ArrowDown, Upload, 
  Eye, EyeOff, Save, X, Image as ImageIcon, Compass, ExternalLink, RefreshCw
} from 'lucide-react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';
import { useSiteSettings } from '../../../context/SiteSettingsContext';

export default function SliderManager() {
  const { refreshSettings } = useSiteSettings();
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    caption: '',
    description: '',
    button_text: '',
    button_link: '',
    is_active: true
  });

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sliders');
      setSliders(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load homepage slides.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const openAddModal = () => {
    setEditingSlider(null);
    setFormData({
      title: '',
      subtitle: '',
      caption: '',
      description: '',
      button_text: '',
      button_link: '',
      is_active: true
    });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title || '',
      subtitle: slider.subtitle || '',
      caption: slider.caption || '',
      description: slider.description || '',
      button_text: slider.button_text || '',
      button_link: slider.button_link || '',
      is_active: slider.is_active
    });
    setImageFile(null);
    setImagePreview(slider.image_path);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!imagePreview && !editingSlider) {
      toast.error('Please upload an image for the slide');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle || '');
    data.append('caption', formData.caption || '');
    data.append('description', formData.description || '');
    data.append('button_text', formData.button_text || '');
    data.append('button_link', formData.button_link || '');
    data.append('is_active', formData.is_active ? '1' : '0');
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    // Since Laravel PUT request doesn't parse multipart form-data natively in some PHP versions,
    // we use POST with `_method: PUT` parameter or run a POST request if editing.
    // Let's check how Laravel handles it: POST with method spoofing is safest!
    if (editingSlider) {
      data.append('_method', 'PUT');
    }

    setLoading(true);
    try {
      if (editingSlider) {
        await api.post(`/sliders/${editingSlider.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Slide updated successfully!');
      } else {
        await api.post('/sliders', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('New slide added successfully!');
      }
      setModalOpen(false);
      fetchSliders();
      refreshSettings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save slide settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      await api.delete(`/sliders/${id}`);
      toast.success('Slide deleted successfully!');
      fetchSliders();
      refreshSettings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete slide.');
    }
  };

  const handleToggleActive = async (slider) => {
    try {
      const updatedValue = !slider.is_active;
      await api.put(`/sliders/${slider.id}`, {
        is_active: updatedValue
      });
      toast.success(`Slide ${updatedValue ? 'enabled' : 'disabled'}!`);
      fetchSliders();
      refreshSettings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle status.');
    }
  };

  const handleMove = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sliders.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newSliders = [...sliders];
    
    // Swap items in local array
    const temp = newSliders[index];
    newSliders[index] = newSliders[targetIndex];
    newSliders[targetIndex] = temp;

    // Recalculate sort_order (1-indexed)
    const orders = newSliders.map((slider, idx) => ({
      id: slider.id,
      sort_order: idx + 1
    }));

    // Update local state first for instant responsiveness
    setSliders(newSliders);

    try {
      await api.post('/sliders/reorder', { orders });
      toast.success('Slide reordered!');
      refreshSettings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save slide order.');
      fetchSliders(); // Reset
    }
  };

  return (
    <div className="p-6 text-slate-100 min-h-screen bg-slate-950">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <Compass className="text-indigo-400" /> Homepage Hero Slider Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload images, edit captions, buttons, links, toggles, and reorder sliders on the frontpage.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all text-sm shadow-xl shadow-indigo-600/10 cursor-pointer"
        >
          <Plus size={16} /> Add New Slide
        </button>
      </div>

      {loading && sliders.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw className="text-indigo-500 animate-spin" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map((slider, index) => (
            <div 
              key={slider.id} 
              className={`bg-slate-900/60 backdrop-blur-xl border ${slider.is_active ? 'border-slate-800' : 'border-slate-850 opacity-60'} rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group transition-all hover:border-slate-700`}
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden border-b border-slate-850">
                  <img 
                    src={slider.image_path.startsWith('http') ? slider.image_path : `/api${slider.image_path}`} 
                    alt={slider.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {/* Active status bubble */}
                  <button 
                    onClick={() => handleToggleActive(slider)}
                    className={`absolute top-3 right-3 p-1.5 rounded-full ${slider.is_active ? 'bg-indigo-500/80 text-white' : 'bg-slate-900/80 text-slate-400'} backdrop-blur-md transition-colors hover:scale-115`}
                  >
                    {slider.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  <div className="absolute bottom-2 left-3 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-black text-yellow-400 uppercase tracking-widest">
                    {slider.caption || 'No Caption'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-white leading-tight truncate">{slider.title}</h3>
                  <p className="text-xs text-indigo-300 font-semibold truncate">{slider.subtitle}</p>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 h-8">{slider.description || 'No description provided.'}</p>
                  
                  {/* Button Info */}
                  {slider.button_text && (
                    <div className="flex gap-2 items-center text-[10px] bg-slate-950/50 p-2 rounded-xl border border-slate-800 text-slate-400">
                      <ExternalLink size={12} className="text-indigo-400" />
                      <span>{slider.button_text} → <span className="text-indigo-400">{slider.button_link}</span></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-950/30 border-t border-slate-850/60 flex items-center justify-between gap-2">
                {/* Reordering */}
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-2 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-300 transition-colors"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button 
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === sliders.length - 1}
                    className="p-2 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-300 transition-colors"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>

                {/* Edit & Delete */}
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => openEditModal(slider)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(slider.id)}
                    className="p-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/30 rounded-xl text-rose-300 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon size={18} className="text-indigo-400" />
                {editingSlider ? 'Edit Homepage Slide' : 'Add New Homepage Slide'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Slide Title *</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. TENTH CONVOCATION"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subtitle</label>
                  <input 
                    type="text" 
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Magadh University, Bodh Gaya"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Caption / Tag */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Top Accent Tag (Caption)</label>
                  <input 
                    type="text" 
                    name="caption"
                    value={formData.caption}
                    onChange={handleInputChange}
                    placeholder="e.g. GOLD MEDALIST"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Brief Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Provide short details for the slide caption..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Image Upload Area */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Slide Image Background *</label>
                  
                  <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-950/40 p-4 border border-slate-800 rounded-2xl">
                    {imagePreview ? (
                      <div className="w-40 h-24 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                        <img 
                          src={imagePreview.startsWith('blob:') || imagePreview.startsWith('/uploads') ? imagePreview : `/api${imagePreview}`} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="w-40 h-24 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center shrink-0 text-slate-600">
                        No Image
                      </div>
                    )}
                    
                    <div className="space-y-2 text-center md:text-left">
                      <p className="text-xs text-slate-400">High-resolution horizontal images (16:9 ratio) recommended.</p>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-bold cursor-pointer text-slate-200">
                        <Upload size={14} /> Choose Image file
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Button Text */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Button Label</label>
                  <input 
                    type="text" 
                    name="button_text"
                    value={formData.button_text}
                    onChange={handleInputChange}
                    placeholder="e.g. Read More"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Button Link */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Button Redirection Link</label>
                  <input 
                    type="text" 
                    name="button_link"
                    value={formData.button_link}
                    onChange={handleInputChange}
                    placeholder="e.g. /about or https://..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Active Toggle */}
                <div className="md:col-span-2 flex items-center gap-2 bg-slate-950/20 px-4 py-3 border border-slate-800/40 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-indigo-600 border-slate-800 rounded focus:ring-indigo-500 bg-slate-950"
                  />
                  <label htmlFor="is_active" className="text-xs font-bold text-slate-300 select-none cursor-pointer">
                    Enable slide immediately (Display on frontpage)
                  </label>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-850 flex justify-end gap-3 bg-slate-950/20 -mx-6 -mb-6 p-4">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Save size={14} />
                  {loading ? 'Saving...' : 'Save Slide Settings'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
