import React from 'react';
import { ShieldAlert, Trophy, Award, Activity, HeartHandshake } from 'lucide-react';

export default function StudentActivities() {
  const schemes = [
    { title: 'National Service Scheme (NSS)', desc: 'Our active NSS wing holds village camps, blood donation drives, environmental tree planting sessions, and sanitization education campaigns in Gaya rural blocks.' },
    { title: 'College Sports tournaments', desc: 'Gautam Budha Mahila College cricket, volleyball, and table-tennis squads participate in Magadh University tournaments, securing multiple championship trophies.' },
    { title: 'Umang Annual Cultural Fest', desc: 'A 3-day annual festival featuring group dance displays, literature debates, fashion segments, and digital science models exhibitions.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-widest rounded">
          Campus Life
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tight">
          NSS, Sports & Student Activities
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Education at Gautam Budha Mahila College is holistically designed. Explore our co-curricular and community social schemes.
        </p>
      </div>

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
    </div>
  );
}
