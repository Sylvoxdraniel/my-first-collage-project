import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  HiOutlineKey, 
  HiOutlineSave, 
  HiOutlineAdjustments, 
  HiOutlineServer, 
  HiOutlineChatAlt2, 
  HiOutlineShieldCheck 
} from 'react-icons/hi';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function OtpSettings() {
  const { settings, refreshSettings } = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    otp_sms_enabled: '0',
    otp_email_enabled: '1',
    otp_sms_api_url: '',
    otp_sms_api_key: '',
    otp_sms_sender_id: '',
    otp_sms_template_id: '',
    otp_sms_message_template: '',
    otp_code_length: '6',
    otp_code_type: 'numeric',
    otp_test_mode: '1'
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        otp_sms_enabled: settings.otp_sms_enabled || '0',
        otp_email_enabled: settings.otp_email_enabled || '1',
        otp_sms_api_url: settings.otp_sms_api_url || '',
        otp_sms_api_key: settings.otp_sms_api_key || '',
        otp_sms_sender_id: settings.otp_sms_sender_id || '',
        otp_sms_template_id: settings.otp_sms_template_id || '',
        otp_sms_message_template: settings.otp_sms_message_template || '',
        otp_code_length: settings.otp_code_length || '6',
        otp_code_type: settings.otp_code_type || 'numeric',
        otp_test_mode: settings.otp_test_mode || '1'
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
    const saveToast = toast.loading('Saving OTP configuration...');
    try {
      await api.post('/site-settings', formData);
      await refreshSettings();
      toast.success('OTP Settings updated successfully!', { id: saveToast });
    } catch (err) {
      toast.error('Failed to update OTP settings.', { id: saveToast });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <HiOutlineKey className="text-primary-500" /> OTP API Control Panel
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure security, length, message templates, and SMS/Email gateway settings dynamically.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core OTP Configuration */}
        <div className="bg-dark-900/60 backdrop-blur-md border border-dark-800 rounded-2xl p-6 space-y-6 shadow-lg">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-dark-800 pb-3">
            <HiOutlineAdjustments className="text-blue-500" /> Format & Flow Security
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                OTP Code Length
              </label>
              <select
                name="otp_code_length"
                value={formData.otp_code_length}
                onChange={handleChange}
                className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="4">4 Characters</option>
                <option value="6">6 Characters</option>
                <option value="8">8 Characters</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                OTP Character Type
              </label>
              <select
                name="otp_code_type"
                value={formData.otp_code_type}
                onChange={handleChange}
                className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="numeric">Numeric (0-9 only)</option>
                <option value="alphanumeric">Alphanumeric (A-Z, 0-9)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <label className="flex items-center gap-3 bg-dark-950 border border-dark-800 p-4 rounded-xl cursor-pointer hover:bg-dark-900 transition-colors">
              <input
                type="checkbox"
                name="otp_email_enabled"
                checked={formData.otp_email_enabled === '1'}
                onChange={handleChange}
                className="rounded border-dark-600 bg-dark-950 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <div>
                <span className="block text-sm font-semibold text-white">Enable Email OTP</span>
                <span className="block text-[10px] text-slate-500">Send code via SMTP</span>
              </div>
            </label>

            <label className="flex items-center gap-3 bg-dark-950 border border-dark-800 p-4 rounded-xl cursor-pointer hover:bg-dark-900 transition-colors">
              <input
                type="checkbox"
                name="otp_sms_enabled"
                checked={formData.otp_sms_enabled === '1'}
                onChange={handleChange}
                className="rounded border-dark-600 bg-dark-950 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <div>
                <span className="block text-sm font-semibold text-white">Enable SMS OTP</span>
                <span className="block text-[10px] text-slate-500">Send code via Gateway</span>
              </div>
            </label>

            <label className="flex items-center gap-3 bg-dark-950 border border-emerald-900/30 bg-emerald-950/5 p-4 rounded-xl cursor-pointer hover:bg-emerald-950/10 transition-colors">
              <input
                type="checkbox"
                name="otp_test_mode"
                checked={formData.otp_test_mode === '1'}
                onChange={handleChange}
                className="rounded border-emerald-600 bg-dark-950 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <div>
                <span className="block text-sm font-semibold text-emerald-400">Sandbox / Test Mode</span>
                <span className="block text-[10px] text-emerald-600/70">Write OTP to storage logs</span>
              </div>
            </label>
          </div>
        </div>

        {/* SMS Gateway Settings */}
        <div className="bg-dark-900/60 backdrop-blur-md border border-dark-800 rounded-2xl p-6 space-y-6 shadow-lg">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-dark-800 pb-3">
            <HiOutlineServer className="text-blue-500" /> SMS Gateway Configuration
          </h2>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                SMS API URL
              </label>
              <span className="text-[10px] text-slate-500">Supports query parameters and JSON mappings</span>
            </div>
            <input
              type="text"
              name="otp_sms_api_url"
              value={formData.otp_sms_api_url}
              onChange={handleChange}
              placeholder="https://api.sms.com/send?apikey={API_KEY}&mobile={MOBILE}&message={MESSAGE}&sender={SENDER_ID}&template_id={TEMPLATE_ID}"
              className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
            <div className="text-[10px] text-slate-500 leading-normal">
              <strong>URL Placeholders:</strong> <code>{'{API_KEY}'}</code>, <code>{'{SENDER_ID}'}</code>, <code>{'{MOBILE}'}</code>, <code>{'{MESSAGE}'}</code>, <code>{'{TEMPLATE_ID}'}</code>, <code>{'{OTP}'}</code> will be dynamically replaced when triggered.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                API Key / Auth Token
              </label>
              <input
                type="password"
                name="otp_sms_api_key"
                value={formData.otp_sms_api_key}
                onChange={handleChange}
                placeholder="Enter auth token..."
                className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sender ID / Header
              </label>
              <input
                type="text"
                name="otp_sms_sender_id"
                value={formData.otp_sms_sender_id}
                onChange={handleChange}
                placeholder="e.g. GBMCGY"
                className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                DLT Template ID (India)
              </label>
              <input
                type="text"
                name="otp_sms_template_id"
                value={formData.otp_sms_template_id}
                onChange={handleChange}
                placeholder="e.g. 120716..."
                className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              SMS Message Template
            </label>
            <textarea
              name="otp_sms_message_template"
              value={formData.otp_sms_message_template}
              onChange={handleChange}
              rows={3}
              placeholder="Dear student, your verification OTP is {#otp#}. Gautam Budha Mahila College, Gaya."
              className="w-full bg-dark-950 border border-dark-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
            />
            <div className="text-[10px] text-slate-500">
              Must include <code>{"{#otp#}"}</code> placeholder which will be replaced with the generated code.
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
            <HiOutlineSave size={18} /> {saving ? 'Saving Config...' : 'Save OTP Configurations'}
          </button>
        </div>

      </form>
    </div>
  );
}
