import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/public/contact-messages', formData);
      toast.success(res.data.message || 'Inquiry message sent successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error submitting message inquiry.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-widest rounded">
          Get In Touch
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tight">
          Contact Us & Inquiry Desk
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Send us your queries regarding admission criteria, eligibility, fees, or campus infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Contact info & Map */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Gautam Budha Mahila College</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We look forward to answering your inquiries. Feel free to contact our administrative offices or visit our campus in Gaya.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-xs text-slate-600">
              <MapPin className="text-blue-900 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="font-bold text-slate-800">Campus Address</p>
                <p className="mt-0.5">S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              <Phone className="text-blue-900 shrink-0" size={16} />
              <div>
                <p className="font-bold text-slate-800">Telephone / Fax</p>
                <p className="mt-0.5">0631-2220642</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              <Mail className="text-blue-900 shrink-0" size={16} />
              <div>
                <p className="font-bold text-slate-800">Email Address</p>
                <p className="mt-0.5">info@gbmcollegegaya.org</p>
              </div>
            </div>
          </div>

          {/* Google Maps Placeholder/Iframe */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden h-64 shadow-sm bg-slate-100 flex items-center justify-center relative">
            {/* Displaying static preview but can render simple iframe */}
            <iframe 
              title="Campus Map" 
              src="https://maps.google.com/maps?q=Gautam%20Buddha%20Mahila%20College%20Gaya&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen="" 
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Side: Inquiry Form */}
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Online Inquiry Form</h3>
            <p className="text-[10px] text-slate-400">Fill this form, and we will get back to you within 24 business hours.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name *</label>
              <input
                type="text" required name="name" value={formData.name} onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:border-blue-900 focus:outline-none text-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address *</label>
              <input
                type="email" required name="email" value={formData.email} onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:border-blue-900 focus:outline-none text-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number *</label>
              <input
                type="text" required name="phone" value={formData.phone} onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:border-blue-900 focus:outline-none text-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Subject</label>
              <input
                type="text" name="subject" value={formData.subject} onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:border-blue-900 focus:outline-none text-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Message *</label>
              <textarea
                required name="message" value={formData.message} onChange={handleInputChange} rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:border-blue-900 focus:outline-none text-slate-700"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-lg shadow disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              <Send size={14} /> {loading ? 'Sending Inquiries...' : 'Send Inquiry Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
