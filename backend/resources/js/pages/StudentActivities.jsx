import React, { useState, useEffect } from 'react';
import { Trophy, Activity, HeartHandshake, MapPin, Calendar, Clock } from 'lucide-react';
import axios from 'axios';

export default function StudentActivities() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const schemes = [
    { title: 'National Service Scheme (NSS)', desc: 'Our active NSS wing holds village camps, blood donation drives, environmental tree planting sessions, and sanitization education campaigns in Gaya rural blocks.' },
    { title: 'College Sports tournaments', desc: 'Gautam Budha Mahila College cricket, volleyball, and table-tennis squads participate in Magadh University tournaments, securing multiple championship trophies.' },
    { title: 'Umang Annual Cultural Fest', desc: 'A 3-day annual festival featuring group dance displays, literature debates, fashion segments, and digital science models exhibitions.' }
  ];

  useEffect(() => {
    setLoading(true);
    axios.get('/api/public/events')
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
        // Fallback events
        setEvents([
          { id: 1, title: 'Umang Annual Cultural Fest 2026', date: '2026-06-15', location: 'College Main Auditorium', description: 'The annual cultural festival "Umang" featuring dance, music, drama, and fine arts competitions.' },
          { id: 2, title: 'Inter-College Sports Tournament', date: '2026-06-22', location: 'Sports Ground Gaya', description: 'Annual sports meet including track and field events, basketball, badminton, and table tennis.' },
          { id: 3, title: 'National Level Chemistry Symposium', date: '2026-07-05', location: 'Seminar Hall A', description: 'Keynote speeches and student paper presentations on sustainable and green chemistry practices.' }
        ]);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return { day: '', month: '', year: '' };
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }),
      year: d.getFullYear()
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-widest rounded">
          Campus Life
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tight">
          NSS, Sports & Student Activities
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Education at Gautam Budha Mahila College is holistically designed. Explore our co-curricular activities, community social schemes, and upcoming events.
        </p>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schemes.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center">
              {idx === 0 ? <HeartHandshake size={24} /> : idx === 1 ? <Trophy size={24} /> : <Activity size={24} />}
            </div>
            <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Events Section */}
      <div className="space-y-8">
        <div className="border-t border-slate-200 pt-10">
          <h2 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tight flex items-center gap-3">
            <Calendar className="text-blue-900" /> College Event Calendar
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Browse all upcoming events, cultural programs, sports activities, and academic seminars.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            Loading college events...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No events scheduled at the moment. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {events.map((evt) => {
              const d = formatDate(evt.date);
              return (
                <div key={evt.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
                  <div className="p-6 space-y-4">
                    {/* Date and Location Header */}
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex flex-col items-center justify-center font-bold shadow-md">
                        <span className="text-base leading-none">{d.day}</span>
                        <span className="text-[9px] uppercase tracking-wider">{d.month}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-900 transition-colors">
                          {evt.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <MapPin size={12} className="shrink-0" />
                          <span>{evt.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {evt.description && (
                      <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {evt.description}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-150 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {evt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> Full Day
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
