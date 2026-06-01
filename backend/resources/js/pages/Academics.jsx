import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, Award, BookOpen, Download, Search, 
  Layers, CheckCircle, FileText 
} from 'lucide-react';
import axios from 'axios';

export default function Academics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'calendar';

  const [syllabi, setSyllabi] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedSem, setSelectedSem] = useState('all');
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);

  const tabs = [
    { id: 'calendar', label: 'Academic Calendar' },
    { id: 'timetable', label: 'Time Table' },
    { id: 'activities', label: 'Academic Activities' },
    { id: 'copo', label: 'CO, PO & PSO' },
    { id: 'cia', label: 'CIA Exam Results' },
    { id: 'syllabus', label: 'Syllabus Download' },
    { id: 'achievements', label: 'Academic Achievements' },
    { id: 'mous', label: 'MoUs & Collaborations' },
  ];

  // Fetch syllabus list from API
  useEffect(() => {
    if (activeTab === 'syllabus') {
      setLoadingSyllabus(true);
      axios.get(`/api/public/syllabus?course_name=${selectedCourse}&semester=${selectedSem}`)
        .then((res) => {
          setSyllabi(res.data);
          setLoadingSyllabus(false);
        })
        .catch(() => {
          // Fallback mock syllabus data
          setSyllabi([
            { id: 1, course_name: 'BA', semester: 1, pdf_path: '#' },
            { id: 2, course_name: 'BSc Mathematics', semester: 2, pdf_path: '#' },
            { id: 3, course_name: 'BCA', semester: 3, pdf_path: '#' },
            { id: 4, course_name: 'MSc Chemistry', semester: 1, pdf_path: '#' },
            { id: 5, course_name: 'MSc Botany', semester: 2, pdf_path: '#' },
            { id: 6, course_name: 'BSc Biology', semester: 4, pdf_path: '#' },
          ]);
          setLoadingSyllabus(false);
        });
    }
  }, [activeTab, selectedCourse, selectedSem]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center space-y-3 mb-10">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-widest rounded">
          Academics Section
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tight">
          Curriculum & Study Systems
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Explore schedules, exams, and download syllabus files authenticated by Magadh University.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-2 sm:p-4 rounded-2xl shadow-sm h-fit flex flex-row lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-x-visible scrollbar-none whitespace-nowrap lg:whitespace-normal">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0 lg:w-full text-center lg:text-left ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="lg:col-span-3 bg-white border border-slate-200 p-4 sm:p-6 md:p-8 rounded-3xl shadow-sm min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* CALENDAR TAB */}
              {activeTab === 'calendar' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">Academic Calendar 2026-27</h2>
                  <p className="text-sm text-slate-600">
                    Important milestones, holidays, and semester exam periods approved by Magadh University.
                  </p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                    {[
                      { event: 'College Reopening & Orientation', date: 'July 1, 2026' },
                      { event: 'Commencement of Regular Classes', date: 'July 5, 2026' },
                      { event: 'First Internal (CIA-1) Examinations', date: 'September 15-20, 2026' },
                      { event: 'Second Internal (CIA-2) Examinations', date: 'November 10-15, 2026' },
                      { event: 'Winter Semester Practical Exams', date: 'December 1-10, 2026' },
                      { event: 'Magadh University Main Theory Exams', date: 'December 15 onwards, 2026' },
                    ].map((row, idx) => (
                      <div key={idx} className="p-4 flex justify-between items-center text-xs font-semibold hover:bg-slate-50">
                        <span className="text-slate-800">{row.event}</span>
                        <span className="text-blue-900 bg-blue-50 px-3 py-1 rounded">{row.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TIMETABLE TAB */}
              {activeTab === 'timetable' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">General Time Table</h2>
                  <p className="text-sm text-slate-600">
                    Find standard classroom timings. Student specific time-tables can be downloaded inside student portals.
                  </p>
                  <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="text-blue-900" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">College Classroom Hours</h4>
                        <p className="text-xs text-slate-500">Monday - Saturday (09:00 AM to 03:00 PM)</p>
                      </div>
                    </div>
                    <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
                      <li>**Period 1**: 09:00 AM - 09:50 AM</li>
                      <li>**Period 2**: 09:50 AM - 10:40 AM</li>
                      <li>**Period 3**: 10:40 AM - 11:30 AM</li>
                      <li>**Recess / Lunch break**: 11:30 AM - 12:10 PM</li>
                      <li>**Period 4**: 12:10 PM - 01:00 PM</li>
                      <li>**Period 5**: 01:00 PM - 01:50 PM</li>
                      <li>**Practical Labs Session**: 01:50 PM - 03:00 PM</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ACTIVITIES TAB */}
              {activeTab === 'activities' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900">Academic Activities</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Our academic cycle is filled with active workshops, industrial tours to Patna and Bodh Gaya, guest lectures by CSIR scientists, science exhibition displays, and coding hackathons organized by the Department of Computer Applications.
                  </p>
                </div>
              )}

              {/* CO PO PSO TAB */}
              {activeTab === 'copo' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">Course Outcomes & Program Outcomes</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Gautam Budha Mahila College complies with Choice Based Credit System (CBCS) learning objectives:
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl">
                      <h4 className="font-bold text-sm text-slate-800">Program Outcomes (PO)</h4>
                      <p className="text-xs text-slate-500 mt-1">Focuses on critical thinking, ethical conduct, computational expertise, and analytical skill development.</p>
                    </div>
                    <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl">
                      <h4 className="font-bold text-sm text-slate-800">Course Outcomes (CO)</h4>
                      <p className="text-xs text-slate-500 mt-1">Specific subject learnings (e.g. Zoology lab expertise, chemical analysis validation, database queries creation).</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CIA EXAMS TAB */}
              {activeTab === 'cia' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900">Continuous Internal Assessment (CIA)</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Under Magadh University directives, a student\'s performance is evaluated via Continuous Internal Assessments:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
                    <li>**Midterm Exams**: Worth 20% of semester score.</li>
                    <li>**Practical Assignments & Zoology Files**: Worth 10%.</li>
                    <li>**Attendance & Classroom conduct**: Worth 10%.</li>
                  </ul>
                </div>
              )}

              {/* SYLLABUS DOWNLOAD SYSTEM */}
              {activeTab === 'syllabus' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">Syllabus Download System</h2>
                  <p className="text-xs text-slate-500">Filter and retrieve official Magadh University syllabus files.</p>
                  
                  {/* Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Course Name</label>
                      <select 
                        value={selectedCourse} 
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                      >
                        <option value="all">All Courses</option>
                        <option value="BA">Bachelor of Arts (BA)</option>
                        <option value="BSc Mathematics">BSc Mathematics</option>
                        <option value="BSc Biology">BSc Biology</option>
                        <option value="BCA">BCA</option>
                        <option value="MSc Botany">MSc Botany</option>
                        <option value="MSc Chemistry">MSc Chemistry</option>
                        <option value="MSc Mathematics">MSc Mathematics</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Semester</label>
                      <select 
                        value={selectedSem} 
                        onChange={(e) => setSelectedSem(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                      >
                        <option value="all">All Semesters</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                      </select>
                    </div>
                  </div>

                  {/* List */}
                  <div className="space-y-3">
                    {loadingSyllabus ? (
                      <div className="text-center py-6 text-xs text-slate-400">Loading syllabus data...</div>
                    ) : syllabi.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400">No syllabus documents found for this filter.</div>
                    ) : (
                      syllabi.map((syllabus) => (
                        <div key={syllabus.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center hover:bg-slate-50 transition-colors shadow-sm bg-white">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-red-50 text-[#cc0000] flex items-center justify-center border border-red-100 shrink-0">
                              <FileText size={18} />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-slate-800">{syllabus.course_name} Syllabus</h4>
                              <p className="text-xs text-slate-400">Semester {syllabus.semester}</p>
                            </div>
                          </div>
                          <a 
                            href={syllabus.pdf_path.startsWith('/') ? `/api${syllabus.pdf_path}` : '#'}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-blue-900 text-white hover:bg-blue-800 px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow"
                          >
                            <Download size={14} /> Download PDF
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ACHIEVEMENTS TAB */}
              {activeTab === 'achievements' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900">Academic Achievements</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Our students excel at University board positions, regularly securing place titles inside Magadh University merit ranks. Our research publications in Chemistry are cited in major journals.
                  </p>
                </div>
              )}

              {/* MOUS & COLLABORATIONS */}
              {activeTab === 'mous' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900">MoUs & Collaborations</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Gautam Budha Mahila College has signed Memorandum of Understanding (MoUs) with local software houses in Gaya and educational research laboratories in Patna, facilitating project work for BCA and MSc students.
                  </p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
