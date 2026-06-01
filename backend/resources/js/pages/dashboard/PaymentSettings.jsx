import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  HiOutlineCreditCard, 
  HiOutlineSave, 
  HiOutlineAdjustments, 
  HiOutlineServer, 
  HiOutlineShieldCheck 
} from 'react-icons/hi';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function PaymentSettings() {
  const { settings, refreshSettings } = useSiteSettings();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    razorpay_enabled: '0',
    razorpay_key_id: '',
    razorpay_key_secret: '',
    razorpay_test_mode: '1'
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        razorpay_enabled: settings.razorpay_enabled || '0',
        razorpay_key_id: settings.razorpay_key_id || '',
        razorpay_key_secret: settings.razorpay_key_secret || '',
        razorpay_test_mode: settings.razorpay_test_mode || '1'
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalVal = type === 'checkbox' ? (checked ? '1' : '0') : value;
    setFormData(prev => ({ ...prev, [name]: finalVal }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const saveToast = toast.loading('Saving payment gateway configuration...');
    try {
      await api.post('/site-settings', formData);
      await refreshSettings();
      toast.success('Payment Gateway configurations updated!', { id: saveToast });
    } catch (err) {
      toast.error('Failed to update payment settings.', { id: saveToast });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <HiOutlineCreditCard className="text-blue-500" /> Payment Gateway Panel
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Enable or disable payment processors and configure dynamic API credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Gateway Service Status */}
        <div className="bg-dark-900/60 backdrop-blur-md border border-dark-800 rounded-2xl p-6 space-y-6 shadow-lg">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-dark-800 pb-3">
            <HiOutlineAdjustments className="text-blue-500" /> Razorpay Service Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <label className="flex items-center gap-3 bg-dark-950 border border-dark-800 p-4 rounded-xl cursor-pointer hover:bg-dark-900 transition-colors">
              <input
                type="checkbox"
                name="razorpay_enabled"
                checked={formData.razorpay_enabled === '1'}
                onChange={handleChange}
                className="rounded border-dark-600 bg-dark-950 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <div>
                <span className="block text-sm font-semibold text-white">Enable Razorpay Checkout</span>
                <span className="block text-[10px] text-slate-500">Collect admissions fee via Razorpay API</span>
              </div>
            </label>

            <label className="flex items-center gap-3 bg-dark-950 border border-emerald-900/30 bg-emerald-950/5 p-4 rounded-xl cursor-pointer hover:bg-emerald-950/10 transition-colors">
              <input
                type="checkbox"
                name="razorpay_test_mode"
                checked={formData.razorpay_test_mode === '1'}
                onChange={handleChange}
                className="rounded border-emerald-600 bg-dark-950 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <div>
                <span className="block text-sm font-semibold text-emerald-400">Sandbox / Test Mode</span>
                <span className="block text-[10px] text-emerald-600/70">Runs payments using Razorpay Test API keys</span>
              </div>
            </label>
          </div>

          <div className="p-4 bg-dark-950/40 border border-dark-800 rounded-xl space-y-2 text-xs text-slate-400 leading-relaxed">
            <p className="font-bold text-slate-300 flex items-center gap-1">
              <HiOutlineShieldCheck className="text-emerald-500" /> Gateway Operation Notice:
            </p>
            <p>
              When <strong>Razorpay Checkout</strong> is disabled, the student payment desk will automatically operate in <strong>Simulation Mode</strong>. This allows students to test the admission pipeline and print receipts without triggering actual payments.
            </p>
          </div>
        </div>

        {/* API Credentials */}
        <div className="bg-dark-900/60 backdrop-blur-md border border-dark-800 rounded-2xl p-6 space-y-6 shadow-lg">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-dark-800 pb-3">
            <HiOutlineServer className="text-blue-500" /> Razorpay API Credentials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Razorpay Key ID
              </label>
              <input
                type="text"
                name="razorpay_key_id"
                value={formData.razorpay_key_id}
                onChange={handleChange}
                placeholder="rzp_test_..."
                className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Razorpay Key Secret
              </label>
              <input
                type="password"
                name="razorpay_key_secret"
                value={formData.razorpay_key_secret}
                onChange={handleChange}
                placeholder="Enter key secret..."
                className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-900/30"
          >
            <HiOutlineSave size={18} /> {saving ? 'Saving Config...' : 'Save Gateway Configurations'}
          </button>
        </div>

      </form>
    </div>
  );
}
