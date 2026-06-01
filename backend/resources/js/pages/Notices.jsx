import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, Search, AlertCircle, Calendar } from 'lucide-react';
import axios from 'axios';

export default function Notices() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [focusedNotice, setFocusedNotice] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/public/notices?category=${selectedCategory}&search=${searchQuery}`)
      .then((res) => {
        setNotices(res.data);
        if (initialId && res.data.length > 0) {
          const matched = res.data.find(n => n.id.toString() === initialId);
          if (matched) setFocusedNotice(matched);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback notices
        const fallback = [
          { id: 1, title: 'Admissions Open for BA, BSc, BCA, BEd, MSc 2026-27', content: 'Online applications are invited for undergraduate and postgraduate programs. Candidates can fill forms at our Admission desk.', category: 'admission', is_important: true, pdf_path: '/uploads/notices/sample.pdf', created_at: '2026-05-25' },
          { id: 2, title: 'Syllabus and Exam Schedule for MU Sem-II/IV Exams', content: 'Magadh University semester exams will commence in mid-June. Timetable is published on the official notice boards.', category: 'exam', is_important: true, pdf_path: '/uploads/notices/sample.pdf', created_at: '2026-05-24' },
          { id: 3, title: 'National Seminar on "Emerging Trends in Zoology"', content: 'Department of Zoology is organizing a national-level seminar. CSIR scholars will hold lectures on cytological breakthroughs.', category: 'academic', is_important: false, pdf_path: null, created_at: '2026-05-22' },
          { id: 4, title: 'Extension of Online Fee Payment Date to June 5', content: 'The final date to submit college semester fees has been extended to June 5 with no late charge.', category: 'admission', is_important: false, pdf_path: null, created_at: '2026-05-20' },
          { id: 5, title: 'NSS Enrollment Guidelines and Activity Schedule', content: 'NSS wing will enroll first year students. Check physical guidelines on campus.', category: 'general', is_important: false, pdf_path: null, created_at: '2026-05-18' }
        ];
        setNotices(fallback);
        if (initialId) {
          const matched = fallback.find(n => n.id.toString() === initialId);
          if (matched) setFocusedNotice(matched);
        }
        setLoading(false);
      });
  }, [selectedCategory, searchQuery, initialId]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Title */}
      <div className="text-center space-y-3 mb-10">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-widest rounded">
          Notice Board
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tight">
          Notices & Announcements
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Stay updated with the latest college notices, exam schedules, and holiday announcements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Filter and Notices list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="academic">Academic</option>
              <option value="exam">Examinations</option>
              <option value="admission">Admissions</option>
            </select>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs focus:outline-none w-full text-slate-700"
              />
            </div>
          </div>

          {/* List of Notices */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-10 text-xs text-slate-400">Loading notices...</div>
            ) : notices.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">No notices found matching filters.</div>
            ) : (
              notices.map((notice) => (
                <div 
                  key={notice.id} 
                  onClick={() => setFocusedNotice(notice)}
                  className={`bg-white border rounded-2xl p-5 hover:border-slate-300 transition-all shadow-sm cursor-pointer ${
                    focusedNotice?.id === notice.id ? 'border-blue-900 ring-1 ring-blue-900/10 bg-blue-50/10' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-blue-100 text-blue-950 font-bold px-2 py-0.5 rounded uppercase">
                        {notice.category}
                      </span>
                      {notice.is_important && (
                        <span className="text-[9px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <AlertCircle size={10} /> Important
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar size={12} /> {notice.created_at.slice(0, 10)}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{notice.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{notice.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Notice Detail Showcase */}
        <div className="lg:col-span-1">
          {focusedNotice ? (
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6 sticky top-24">
              <div className="space-y-2">
                <span className="text-[9px] bg-blue-100 text-blue-950 font-bold px-2 py-0.5 rounded uppercase">
                  {focusedNotice.category}
                </span>
                <h3 className="font-bold text-base text-slate-900 leading-snug">{focusedNotice.title}</h3>
                <p className="text-[10px] text-slate-400 font-mono">Published: {focusedNotice.created_at.slice(0, 10)}</p>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4 whitespace-pre-line">
                {focusedNotice.content}
              </div>

              {focusedNotice.pdf_path && (
                <div className="border-t border-slate-100 pt-4">
                  <a
                    href={focusedNotice.pdf_path.startsWith('/') ? `/api${focusedNotice.pdf_path}` : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download size={14} /> Download Notice PDF
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/60 p-8 rounded-3xl text-center text-slate-400 text-xs space-y-2 sticky top-24">
              <FileText size={32} className="mx-auto text-slate-300" />
              <p>Select any announcement from the notice board list to see full details and download attachments.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
