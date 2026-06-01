import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Calendar, MapPin, Edit3 } from 'lucide-react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/public/events');
      setEvents(res.data);
    } catch (err) {
      toast.error('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setImageFile(null);
    setIsEditMode(false);
    setSelectedId(null);
    setIsOpen(true);
  };

  const openEditModal = (evt) => {
    setTitle(evt.title);
    setDescription(evt.description || '');
    setDate(evt.date);
    setLocation(evt.location || '');
    setImageFile(null);
    setIsEditMode(true);
    setSelectedId(evt.id);
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date) {
      toast.error('Event Title and Date are required.');
      return;
    }

    setSubmitting(true);
    const postData = new FormData();
    postData.append('title', title);
    postData.append('description', description);
    postData.append('date', date);
    postData.append('location', location);
    if (imageFile) {
      postData.append('image', imageFile);
    }

    try {
      if (isEditMode) {
        postData.append('_method', 'PUT');
        await axios.post(`/events/${selectedId}`, postData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Event updated successfully.');
      } else {
        await axios.post('/events', postData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Event scheduled successfully.');
      }
      setIsOpen(false);
      fetchEvents();
    } catch (err) {
      toast.error('Failed to save event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel and delete this event permanently?')) return;
    try {
      await axios.delete(`/events/${id}`);
      toast.success('Event deleted successfully.');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to delete event.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Events Scheduler</h2>
          <p className="text-xs text-dark-400">Schedule guest lectures, seminars, cultural fests, and sports days.</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-1">
          <Plus size={16} /> Schedule Event
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-dark-500">Loading scheduled events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-xs text-dark-500">No events scheduled. Create one now.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <Card key={evt.id} className="p-5 flex gap-4 items-start">
              {evt.image_path && (
                <img 
                  src={`/api${evt.image_path}`} 
                  alt={evt.title} 
                  className="w-20 h-20 rounded-lg object-cover border border-dark-800 shrink-0"
                />
              )}
              <div className="space-y-2 flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400">
                  {evt.date}
                </span>
                <h4 className="font-bold text-white text-sm truncate">{evt.title}</h4>
                <p className="text-xs text-dark-400 truncate flex items-center gap-1">
                  <MapPin size={12} /> {evt.location || 'College Campus'}
                </p>
                <p className="text-xs text-dark-300 line-clamp-2">{evt.description}</p>
                
                <div className="flex justify-end gap-2 border-t border-dark-800/40 pt-2.5 mt-2">
                  <button 
                    onClick={() => openEditModal(evt)}
                    className="p-1 rounded bg-dark-850 hover:bg-dark-800 border border-dark-700 text-yellow-400"
                  >
                    <Plus size={12} className="rotate-45" /> {/* simple edits representation */}
                  </button>
                  <button 
                    onClick={() => handleDelete(evt.id)}
                    className="p-1 rounded bg-dark-850 hover:bg-dark-800 border border-dark-700 text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* SCHEDULE MODAL */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={isEditMode ? 'Edit Event Details' : 'Schedule New Event'}>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input 
            label="Event Title *" 
            placeholder="e.g. Umang Annual Cultural Fest" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-dark-300 uppercase block mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the event milestones and guidelines..."
              className="w-full bg-dark-950/80 border border-dark-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary-500 placeholder-dark-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Event Date *" 
              type="date"
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
            <Input 
              label="Location / Venue" 
              placeholder="e.g. Main Auditorium"
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-dark-300 uppercase block mb-1">Attach Flyer / Photo</label>
            <input 
              type="file" 
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-xs text-dark-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-dark-800 file:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Schedule Event'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
