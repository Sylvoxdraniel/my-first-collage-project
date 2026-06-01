import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, Trash2, ShieldCheck, MailOpen, User, Phone } from 'lucide-react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';

export default function ContactMessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/contact-messages?status=${statusFilter}`);
      setMessages(res.data);
    } catch (err) {
      toast.error('Failed to load inquiry messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`/contact-messages/${id}`, { status: 'read' });
      toast.success('Inquiry marked as read.');
      fetchMessages();
    } catch (err) {
      toast.error('Failed to update message status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry permanently?')) return;
    try {
      await axios.delete(`/contact-messages/${id}`);
      toast.success('Inquiry message deleted.');
      fetchMessages();
    } catch (err) {
      toast.error('Failed to delete message.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Public Inquiries Inbox</h2>
          <p className="text-xs text-dark-400">Review feedback and queries submitted by visitors via the Contact page.</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-dark-900 border border-dark-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
        >
          <option value="all">All Messages</option>
          <option value="pending">Pending</option>
          <option value="read">Read</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-dark-500">Loading inquiries...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-xs text-dark-500">No inquiry messages found.</div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card 
              key={msg.id} 
              className={`p-5 flex flex-col md:flex-row justify-between gap-4 transition-all ${
                msg.status === 'pending' ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-xs flex items-center gap-1">
                    <User size={12} className="text-dark-400" /> {msg.name}
                  </span>
                  <span className="text-[10px] text-dark-400">({msg.email})</span>
                  <span className="text-[10px] text-dark-400 flex items-center gap-1">
                    <Phone size={12} className="text-dark-400" /> {msg.phone}
                  </span>
                </div>
                
                <h4 className="font-bold text-xs text-slate-200">Subject: {msg.subject}</h4>
                <p className="text-xs text-dark-300 whitespace-pre-line leading-relaxed">{msg.message}</p>
                <p className="text-[9px] text-dark-500 font-mono">Received: {msg.created_at.slice(0, 19).replace('T', ' ')}</p>
              </div>

              <div className="flex md:flex-col justify-end gap-2 shrink-0">
                {msg.status === 'pending' ? (
                  <button 
                    onClick={() => handleMarkAsRead(msg.id)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 shadow"
                  >
                    <MailOpen size={12} /> Mark Read
                  </button>
                ) : (
                  <div className="text-emerald-400 font-semibold text-[10px] flex items-center gap-1 px-3 py-1.5">
                    <ShieldCheck size={12} /> Read
                  </div>
                )}
                <button 
                  onClick={() => handleDelete(msg.id)}
                  className="border border-dark-700 hover:bg-dark-800 text-red-400 hover:text-red-300 font-bold text-xs px-3 py-1.5 rounded flex items-center justify-center gap-1"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
