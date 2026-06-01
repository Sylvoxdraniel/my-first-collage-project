import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, Upload, RefreshCw, Palette, Type, Shield, 
  MapPin, Phone, Mail, Image as ImageIcon, Sparkles, Award 
} from 'lucide-react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { useNavigate } from 'react-router-dom';

export default function BrandTheme() {
  const { settings, refreshSettings } = useSiteSettings();
  const navigate = useNavigate();

  const getBackendUrl = () => {
    if (window.location.port === '5173') {
      return `${window.location.protocol}//${window.location.hostname}:8000`;
    }
    return window.location.origin;
  };

  const backendUrl = getBackendUrl();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAffiliationLogo, setUploadingAffiliationLogo] = useState(false);
  const [formData, setFormData] = useState({
    college_name: '',
    college_name_hindi: '',
    college_subtitle: '',
    primary_color: '#0b1b3d',
    secondary_color: '#cc0000',
    accent_color: '#eab308',
    navbar_bg: '#0b1b3d',
    hero_bg: '#990000',
    font_family: 'Inter',
    button_style: 'rounded',
    address: '',
    phone: '',
    email: '',
    affiliation_name: ''
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [affiliationLogoPreview, setAffiliationLogoPreview] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        college_name: settings.college_name || '',
        college_name_hindi: settings.college_name_hindi || '',
        college_subtitle: settings.college_subtitle || '',
        primary_color: settings.primary_color || '#0b1b3d',
        secondary_color: settings.secondary_color || '#cc0000',
        accent_color: settings.accent_color || '#eab308',
        navbar_bg: settings.navbar_bg || '#0b1b3d',
        hero_bg: settings.hero_bg || '#990000',
        font_family: settings.font_family || 'Inter',
        button_style: settings.button_style || 'rounded',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        affiliation_name: settings.affiliation_name || ''
      });
      setLogoPreview(settings.logo_path || null);
      setAffiliationLogoPreview(settings.affiliation_logo_path || null);
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo image must be less than 2MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);

    setUploadingLogo(true);
    const data = new FormData();
    data.append('logo', file);

    toast.promise(
      api.post('/site-settings/logo', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
      {
        loading: 'Uploading college logo...',
        success: (response) => {
          setLogoPreview(response.data.logo_path);
          refreshSettings();
          setUploadingLogo(false);
          return 'Logo uploaded successfully!';
        },
        error: (err) => {
          console.error(err);
          setLogoPreview(settings.logo_path);
          setUploadingLogo(false);
          return 'Failed to upload logo.';
        }
      }
    );
  };

  const handleAffiliationLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Affiliation logo image must be less than 2MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAffiliationLogoPreview(previewUrl);

    setUploadingAffiliationLogo(true);
    const data = new FormData();
    data.append('logo', file);

    toast.promise(
      api.post('/site-settings/affiliation-logo', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
      {
        loading: 'Uploading affiliation logo...',
        success: (response) => {
          setAffiliationLogoPreview(response.data.affiliation_logo_path);
          refreshSettings();
          setUploadingAffiliationLogo(false);
          return 'Affiliation logo uploaded successfully!';
        },
        error: (err) => {
          console.error(err);
          setAffiliationLogoPreview(settings.affiliation_logo_path);
          setUploadingAffiliationLogo(false);
          return 'Failed to upload affiliation logo.';
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    toast.promise(
      api.put('/site-settings', formData),
      {
        loading: 'Saving appearance settings...',
        success: () => {
          refreshSettings();
          setLoading(false);
          return 'Website configurations updated successfully!';
        },
        error: (err) => {
          console.error(err);
          setLoading(false);
          return 'Failed to update settings.';
        }
      }
    );
  };

  return (
    <div className="p-6 text-slate-100 min-h-screen bg-slate-950">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <Palette className="text-indigo-400" /> Brand & Theme Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Customize college name, branding assets, custom layouts, color schemes, and contact coordinates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={refreshSettings}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all text-xs font-semibold cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Updates
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Fields */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Card 1: Branding & Identity */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Shield size={18} className="text-indigo-400" /> Branding & Identity Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">College Name (English)</label>
                <input 
                  type="text" 
                  name="college_name"
                  value={formData.college_name}
                  onChange={handleChange}
                  required
                  placeholder="Gautam Budha Mahila College, Gaya"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">College Name (Hindi / regional)</label>
                <input 
                  type="text" 
                  name="college_name_hindi"
                  value={formData.college_name_hindi}
                  onChange={handleChange}
                  required
                  placeholder="गौतम बुद्ध महिला महाविद्यालय, गयाजी"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-hindi tracking-wide focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sub-header / Tagline / Location</label>
                <input 
                  type="text" 
                  name="college_subtitle"
                  value={formData.college_subtitle}
                  onChange={handleChange}
                  placeholder="S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Affiliation University Name</label>
                <input 
                  type="text" 
                  name="affiliation_name"
                  value={formData.affiliation_name}
                  onChange={handleChange}
                  placeholder="Magadh University"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Custom Theme Settings */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Palette size={18} className="text-rose-400" /> Color Theme & Layout Styles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    name="primary_color"
                    value={formData.primary_color}
                    onChange={handleChange}
                    className="w-10 h-10 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden shrink-0"
                  />
                  <input 
                    type="text" 
                    name="primary_color"
                    value={formData.primary_color}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Secondary Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    name="secondary_color"
                    value={formData.secondary_color}
                    onChange={handleChange}
                    className="w-10 h-10 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden shrink-0"
                  />
                  <input 
                    type="text" 
                    name="secondary_color"
                    value={formData.secondary_color}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Accent Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    name="accent_color"
                    value={formData.accent_color}
                    onChange={handleChange}
                    className="w-10 h-10 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden shrink-0"
                  />
                  <input 
                    type="text" 
                    name="accent_color"
                    value={formData.accent_color}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Navbar Background</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    name="navbar_bg"
                    value={formData.navbar_bg}
                    onChange={handleChange}
                    className="w-10 h-10 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden shrink-0"
                  />
                  <input 
                    type="text" 
                    name="navbar_bg"
                    value={formData.navbar_bg}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hero / Main Section Bg</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    name="hero_bg"
                    value={formData.hero_bg}
                    onChange={handleChange}
                    className="w-10 h-10 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden shrink-0"
                  />
                  <input 
                    type="text" 
                    name="hero_bg"
                    value={formData.hero_bg}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Font Family</label>
                <select 
                  name="font_family"
                  value={formData.font_family}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Inter">Inter (Clean / Sans-serif)</option>
                  <option value="Roboto">Roboto (Professional)</option>
                  <option value="Poppins">Poppins (Modern Bold)</option>
                  <option value="Outfit">Outfit (Premium Geometrical)</option>
                  <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Button Style</label>
                <select 
                  name="button_style"
                  value={formData.button_style}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="rounded">Rounded Corners (Small)</option>
                  <option value="rounded-xl">Rounded Medium (Premium)</option>
                  <option value="rounded-full">Rounded Full (Pill shape)</option>
                  <option value="rounded-none">Sharp Corners (Classical)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Contact & Metadata */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
              <MapPin size={18} className="text-emerald-400" /> Contact Details (Footer & Contact Page)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Office Address</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Telephone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Office Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Logo Upload & Visual Live Preview */}
        <div className="space-y-8">
          
          {/* Logo Upload Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center justify-center gap-2 border-b border-slate-800 pb-3">
              <ImageIcon size={18} className="text-yellow-400" /> College Official Logo
            </h2>

            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/40 relative group">
              {logoPreview ? (
                <div className="relative w-36 h-36 rounded-full bg-white border border-slate-700 flex items-center justify-center p-2 shadow-lg overflow-hidden mb-4">
                  <img src={logoPreview.startsWith('http') || logoPreview.startsWith('blob:') ? logoPreview : `${backendUrl}/api${logoPreview}`} alt="Logo Preview" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-36 h-36 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-500">
                  No Logo
                </div>
              )}

              {uploadingLogo && (
                <div className="absolute inset-0 bg-slate-950/80 rounded-2xl flex items-center justify-center">
                  <RefreshCw className="text-indigo-400 animate-spin" size={24} />
                </div>
              )}

              <p className="text-xs text-slate-500 mb-4">Formats supported: JPG, PNG, WEBP. Max 2MB.</p>
              
              <label className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-lg">
                <Upload size={14} /> Upload New Logo
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Affiliation Logo Upload Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center justify-center gap-2 border-b border-slate-800 pb-3">
              <Award size={18} className="text-blue-400" /> Affiliation Logo
            </h2>

            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/40 relative group">
              {affiliationLogoPreview ? (
                <div className="relative w-36 h-36 rounded bg-white border border-slate-700 flex items-center justify-center p-2 shadow-lg overflow-hidden mb-4">
                  <img src={affiliationLogoPreview.startsWith('http') || affiliationLogoPreview.startsWith('blob:') ? affiliationLogoPreview : `${backendUrl}/api${affiliationLogoPreview}`} alt="Affiliation Logo Preview" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-36 h-36 rounded bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-500">
                  No Affiliation Logo
                </div>
              )}

              {uploadingAffiliationLogo && (
                <div className="absolute inset-0 bg-slate-950/80 rounded-2xl flex items-center justify-center">
                  <RefreshCw className="text-indigo-400 animate-spin" size={24} />
                </div>
              )}

              <p className="text-xs text-slate-500 mb-4">Formats supported: JPG, PNG, WEBP. Max 2MB.</p>
              
              <label className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-lg">
                <Upload size={14} /> Upload Affiliation Logo
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleAffiliationLogoUpload}
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Mini Real-time Header Preview */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Sparkles size={14} className="text-yellow-400 animate-pulse" /> Live Header Preview
            </h2>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-inner space-y-4">
              <div className="flex flex-col gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-slate-300 bg-slate-50 flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview.startsWith('http') || logoPreview.startsWith('blob:') ? logoPreview : `${backendUrl}/api${logoPreview}`} alt="Logo Preview" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-400">Logo</span>
                    )}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="text-[10px] font-bold text-red-600 truncate leading-tight font-hindi" style={{ color: formData.secondary_color }}>
                      {formData.college_name_hindi || 'गौतम बुद्ध महिला महाविद्यालय'}
                    </h4>
                    <h3 className="text-xs font-black text-slate-900 truncate leading-tight mt-0.5" style={{ color: formData.primary_color }}>
                      {formData.college_name || 'Gautam Budha Mahila College'}
                    </h3>
                    <p className="text-[8px] text-slate-500 truncate leading-none mt-0.5">
                      {formData.college_subtitle || 'Gaya'}
                    </p>
                  </div>
                </div>

                {/* Affiliation Mini Preview */}
                <div className="flex items-center gap-2 border border-blue-200 bg-blue-50/50 p-1.5 rounded-lg self-start">
                  <div className="w-6 h-6 rounded bg-white flex items-center justify-center p-0.5 border border-slate-200 overflow-hidden shrink-0">
                    {affiliationLogoPreview ? (
                      <img src={affiliationLogoPreview.startsWith('http') || affiliationLogoPreview.startsWith('blob:') ? affiliationLogoPreview : `${backendUrl}/api${affiliationLogoPreview}`} alt="Affiliation Logo Preview" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[8px] text-slate-400">Logo</span>
                    )}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="text-[7px] uppercase font-bold text-blue-800 leading-none">Affiliated to</p>
                    <p className="text-[9px] font-black text-slate-800 mt-0.5 truncate max-w-[120px]">{formData.affiliation_name || 'Magadh University'}</p>
                  </div>
                </div>
              </div>

              {/* Mini Button Preview */}
              <div className="flex gap-2 justify-end items-center">
                <span className="text-[8px] font-bold text-slate-400 self-center">Buttons:</span>
                <button 
                  type="button"
                  className={`text-[9px] px-3 py-1 text-slate-950 font-black tracking-wide ${formData.button_style} shadow-sm`}
                  style={{ backgroundColor: formData.accent_color }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-indigo-500/10 cursor-pointer"
            >
              <Save size={18} />
              {loading ? 'Saving Changes...' : 'Save Appearance Settings'}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}
