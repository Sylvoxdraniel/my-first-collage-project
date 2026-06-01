import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, ArrowUp, ArrowDown, 
  Eye, EyeOff, Save, X, Megaphone, HelpCircle 
} from 'lucide-react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';
import { useSiteSettings } from '../../../context/SiteSettingsContext';

export default function AnnouncementsManager() {
  const { refreshSettings } = useSiteSettings();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [newText, setNewText] = useState('');

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    try {
      await api.post('/announcements', { text: newText });
      toast.success('Announcement added!');
      setNewText('');
      fetchAnnouncements();
      refreshSettings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create announcement.');
    }
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = async (id, originalItem) => {
    if (!editText.trim()) return;
    try {
      await api.put(`/announcements/${id}`, { 
        text: editText,
        is_active: originalItem.is_active,
        sort_order: originalItem.sort_order
      });
      toast.success('Announcement updated!');
      setEditingId(null);
      fetchAnnouncements();
      refreshSettings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update announcement.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      toast.success('Announcement deleted!');
      fetchAnnouncements();
      refreshSettings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete announcement.');
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const updatedValue = !item.is_active;
      await api.put(`/announcements/${item.id}`, {
        text: item.text,
        is_active: updatedValue ? 1 : 0,
        sort_order: item.sort_order
      });
      toast.success(`Announcement ${updatedValue ? 'activated' : 'hidden'}!`);
      fetchAnnouncements();
      refreshSettings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status.');
    }
  };

  const handleMove = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === announcements.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...announcements];
    
    // Swap items in local array
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Recalculate sort_order (1-indexed)
    const orders = newItems.map((item, idx) => ({
      id: item.id,
      sort_order: idx + 1
    }));

    // Update local state first
    setAnnouncements(newItems);

    // Save ordering
    try {
      // In Laravel backend, we can just save it or write a simple reorder loop or reuse an endpoint.
      // Wait, let's write a simple loop: we'll call individual updates or reuse reorder logic.
      // Wait! Let's check: did we add a reorder endpoint for announcements?
      // In WebsiteControlController, we didn't add reorderAnnouncements explicitly, but we have:
      // Route::put('/announcements/{id}'... which updates individual announcements.
      // To keep it simple, we can just send individual PUT requests in parallel or we can loop.
      // Wait! Let's check WebsiteControlController to see if we had Route::post('/announcements/reorder').
      // No, we only added: Route::put('/announcements/{id}', ...
      // So we can update them in a loop! Let's do:
      await Promise.all(orders.map(o => {
        const matchingItem = newItems.find(item => item.id === o.id);
        return api.put(`/announcements/${o.id}`, {
          text: matchingItem.text,
          is_active: matchingItem.is_active,
          sort_order: o.sort_order
        });
      }));
      toast.success('Announcements reordered!');
      refreshSettings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save announcement order.');
      fetchAnnouncements(); // Reset
    }
  };

  return (
    <div className="p-6 text-slate-100 min-h-screen bg-slate-950">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <Megaphone className="text-indigo-400 animate-bounce" /> Homepage Announcements ticker
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage scrolling marquee messages, add/edit/delete ticker info, and enable/disable notifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Add/Configure announcement bar */}
        <div className="space-y-6">
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-sm font-black text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus size={16} className="text-indigo-400" /> Create Announcement
            </h2>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message Content</label>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  rows={4}
                  required
                  placeholder="e.g. 📢 Admissions Open for BA/BSc/BCA 2026-27! Apply online today."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!newText.trim() || loading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg cursor-pointer"
              >
                <Plus size={16} /> Publish Ticker Item
              </button>
            </form>
          </div>

          {/* Quick instructions */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 text-xs text-slate-400 space-y-3 leading-relaxed">
            <p className="font-bold text-slate-300 flex items-center gap-1.5">
              <HelpCircle size={14} className="text-indigo-400" /> Ticker Control Tips:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Keep messages under 150 characters to prevent massive tickers.</li>
              <li>Include emojis (✨, 🏆, 📢, 📅) at the start for better aesthetics.</li>
              <li>Click the eyeball icon to temporarily hide an announcement without deleting it.</li>
              <li>Use the Up/Down arrows to reorder which item shows first in the scrolling sequence.</li>
            </ul>
          </div>

        </div>

        {/* Right column: Ticker List */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-sm font-black text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
              Active Ticker Sequence ({announcements.length})
            </h2>

            {loading && announcements.length === 0 ? (
              <div className="flex justify-center items-center py-10">
                <Plus className="text-indigo-500 animate-spin" size={24} />
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No announcements currently published. Create one on the left!
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`bg-slate-950/60 border ${item.id === editingId ? 'border-indigo-600' : 'border-slate-800'} ${item.is_active ? 'opacity-100' : 'opacity-50'} rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all`}
                  >
                    {/* Content area */}
                    <div className="flex-1 w-full">
                      {item.id === editingId ? (
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={2}
                          className="w-full bg-slate-900 border border-indigo-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                        />
                      ) : (
                        <p className="text-sm text-slate-200 leading-relaxed font-semibold">{item.text}</p>
                      )}
                    </div>

                    {/* Controls & Actions */}
                    <div className="flex items-center justify-between w-full md:w-auto shrink-0 gap-3 border-t md:border-t-0 border-slate-850 pt-3 md:pt-0">
                      
                      {/* Reordering Up/Down */}
                      <div className="flex gap-1 border-r border-slate-800 pr-2">
                        <button
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 bg-slate-900 hover:bg-slate-850 rounded-lg text-slate-400 disabled:opacity-20 hover:text-white"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === announcements.length - 1}
                          className="p-1.5 bg-slate-900 hover:bg-slate-850 rounded-lg text-slate-400 disabled:opacity-20 hover:text-white"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>

                      {/* Active Eye Status */}
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`p-2 rounded-xl transition-colors hover:scale-105 ${item.is_active ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' : 'bg-slate-900 text-slate-500 border border-slate-850'}`}
                        title={item.is_active ? 'Hide announcement' : 'Show announcement'}
                      >
                        {item.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>

                      {/* Actions (Save/Cancel or Edit/Delete) */}
                      {item.id === editingId ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleSaveEdit(item.id, item)}
                            className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 bg-slate-850 text-slate-400 rounded-xl hover:text-white transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-2 bg-slate-900 text-slate-300 rounded-xl hover:bg-slate-800 hover:text-white border border-slate-850 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 bg-rose-950/40 text-rose-300 rounded-xl hover:bg-rose-900/60 border border-rose-900/20 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
