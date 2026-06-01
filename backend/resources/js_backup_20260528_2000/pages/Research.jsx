import React from 'react';
import { BookOpen, Award, FileText, Globe, GraduationCap } from 'lucide-react';

export default function Research() {
  const publications = [
    { title: 'Cytological breakthroughs in zoological classification models', journal: 'International Journal of Zoology Research', year: '2025', author: 'Dr. Vikas Meena' },
    { title: 'Spectroscopic validation of green synthesis inorganic catalysts', journal: 'Journal of Chemical Science Innovations', year: '2024', author: 'Dr. C. P. Mittal' },
    { title: 'Computational data structures optimization using predictive algorithms', journal: 'IT Journal of Software Engineering', year: '2025', author: 'Prof. Ramesh K. Verma' }
  ];

  const seminars = [
    { title: 'National Seminar on "Emerging Trends in Zoology"', date: 'June 10, 2026', location: 'College Main Auditorium' },
    { title: 'International Conference on Green Chemistry and Toxicology', date: 'October 14-16, 2025', location: 'Seminar Hall A' },
    { title: 'Webinar: Cyber Security Frameworks in E-Governance', date: 'December 05, 2025', location: 'Virtual Classroom 2' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-widest rounded">
          Research Division
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tight">
          Research, Publications & Seminars
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Gautam Budha Mahila College Gaya values academic research. Explore our published works, seminars, and conferences.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Publications */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <BookOpen className="text-blue-900" size={20} />
            Faculty Research Publications
          </h3>
          <div className="space-y-4">
            {publications.map((pub, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-[9px] bg-blue-50 text-blue-900 font-bold px-2 py-0.5 rounded">
                    UGC Care Listed
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{pub.year}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-800 leading-snug">{pub.title}</h4>
                <div className="text-[10px] text-slate-500 mt-2 flex justify-between">
                  <span>Author: {pub.author}</span>
                  <span className="italic">{pub.journal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seminars & Conferences */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Globe className="text-red-700" size={20} />
            Seminars, Projects & Workshops
          </h3>
          <div className="space-y-4">
            {seminars.map((sem, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow space-y-2">
                <span className="text-[9px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded">
                  {sem.date}
                </span>
                <h4 className="font-bold text-xs text-slate-800 leading-snug">{sem.title}</h4>
                <p className="text-[10px] text-slate-400">Location: {sem.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
