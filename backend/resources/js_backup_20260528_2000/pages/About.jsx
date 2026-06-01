import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, BookOpen, Users, Compass, Eye, Shield, Landmark, 
  MapPin, CheckCircle, HelpCircle, Activity 
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function About() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'about';
  const { settings } = useSiteSettings();

  const tabs = [
    { id: 'about', label: 'About Us' },
    { id: 'chairman', label: 'VC\'s Message' },
    { id: 'director', label: 'Principal\'s Message' },
    { id: 'principal', label: 'Patron\'s Message' },
    { id: 'vision', label: 'Vision & Mission' },
    { id: 'swoc', label: 'SWOC Analysis' },
    { id: 'distinctiveness', label: 'Institutional Distinctiveness' },
    { id: 'egovernance', label: 'E-Governance' },
    { id: 'organogram', label: 'Organogram' },
    { id: 'administrative', label: 'Administrative Setup' },
    { id: 'perspective', label: 'Institutional Perspective' },
    { id: 'iqac', label: 'IQAC & NAAC' },
    { id: 'aishe', label: 'AISHE & NCTE Data' },
    { id: 'conduct', label: 'Code of Conduct' },
    { id: 'antiragging', label: 'Anti-Ragging Cell' },
    { id: 'placement', label: 'Placement Cell' },
    { id: 'alumni', label: 'Alumni Association' },
    { id: 'womencell', label: 'Women Cell' },
  ];

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center space-y-3 mb-10">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs uppercase tracking-widest rounded">
          About Section
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tight">
          Know About Our Institution
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Gautam Budha Mahila College, Gaya is Bihars premier seat of academic excellence, preparing graduates for leadership roles since 1953.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-2 lg:p-4 rounded-2xl shadow-sm h-fit flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible whitespace-nowrap lg:whitespace-normal scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0 text-left lg:w-full ${
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
        <div className="lg:col-span-3 bg-white border border-slate-200 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-sm min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* ABOUT US TAB */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">About Gautam Budha Mahila College</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Established in 1953, **Gautam Budha Mahila College, Gaya** has grown to become one of the premier educational institutions in Bihar. Affiliated with **Magadh University**, the college is known for its academic rigor, experienced faculty, and modern laboratory systems.
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The college offers a wide range of undergraduate (UG) and postgraduate (PG) courses across multiple streams including Science, Arts, Education, and Computer Applications. Located in Gaya, our state-of-the-art campus is designed to stimulate intellectual curiosity, scientific research, and overall student development.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 flex items-start gap-3">
                      <Landmark className="text-blue-900 shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">UGC Recognition</h4>
                        <p className="text-xs text-slate-500 mt-1">Recognized under section 2(f) and 12(B) of the UGC Act.</p>
                      </div>
                    </div>
                    {/* <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 flex items-start gap-3">
                      <Award className="text-orange-500 shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">NAAC B Certified</h4>
                        <p className="text-xs text-slate-500 mt-1">Evaluated and accredited by National Assessment and Accreditation Council.</p>
                      </div>
                    </div> */}
                  </div>
                </div>
              )}

              {/* CHAIRMAN TAB */}
              {activeTab === 'chairman' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="w-36 h-44 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow shrink-0">
                      <img 
                        src={settings?.vc_image_path || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop"} 
                        alt="Vice Chancellor" 
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl font-black text-slate-900">{settings?.vc_name || "Prof. (Dr.) Dilip Kumar Kesari"}</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase">{settings?.vc_designation || "Vice Chancellor, Magadh University"}</p>
                      <p className="text-sm text-slate-600 leading-relaxed italic">
                        "{settings?.vc_message || "Welcome to Gautam Budha Mahila College. Education is not just about loading minds with facts, it is about sparking a flame of scientific inquiry. We strive to provide our students with the resource support they need to become responsible global citizens and leaders in their chosen professions."}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* DIRECTOR TAB */}
              {activeTab === 'director' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="w-36 h-44 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow shrink-0">
                      <img 
                        src={settings?.principal_image_path || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"} 
                        alt="Principal" 
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl font-black text-slate-900">{settings?.principal_name || "Prof. (Dr.) Seema Patel"}</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase">{settings?.principal_designation || "Principal, Gautam Budha Mahila College"}</p>
                      <p className="text-sm text-slate-600 leading-relaxed italic">
                        "{settings?.principal_message || "At Gautam Budha Mahila College, we have established a culture of academic rigor and student achievements. With a focus on research, modern laboratories, and expert guidance, our campus continues to be the top choice for students looking to excel in science and computer applications."}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PRINCIPAL TAB */}
              {activeTab === 'principal' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="w-36 h-44 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow shrink-0">
                      <img 
                        src={settings?.patron_image_path || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop"} 
                        alt="Patron" 
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl font-black text-slate-900">{settings?.patron_name || "Dr. Sunita Sharma"}</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase">{settings?.patron_designation || "Patron, Gautam Budha Mahila College"}</p>
                      <p className="text-sm text-slate-600 leading-relaxed italic">
                        "{settings?.patron_message || "It is an honor to lead this institution. We have structured a syllabus support framework, dynamic co-curricular activities, and sports events to ensure that education is holistic, enjoyable, and creates highly employable graduates."}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* VISION & MISSION TAB */}
              {activeTab === 'vision' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-black text-blue-900 flex items-center gap-2">
                      <Compass /> Our Vision
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      To become a premier center of higher education and research, transforming youth into self-reliant, highly ethical, and globally competent professionals capable of contributing to societal development.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-black text-emerald-800 flex items-center gap-2">
                      <Eye /> Our Mission
                    </h2>
                    <ul className="space-y-3 pl-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>To provide state-of-the-art laboratory and learning resources.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>To implement advanced, industry-focused academic curricula and syllabus.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>To promote research, student workshops, and collaborations.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>To encourage participation in community services (NSS) and sports.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* SWOC ANALYSIS TAB */}
              {activeTab === 'swoc' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">SWOC Analysis</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="border border-emerald-100 bg-emerald-50/40 p-5 rounded-2xl">
                      <h4 className="font-bold text-sm text-emerald-800 mb-2">Strengths (S)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Highly qualified faculty with PhDs, prime location in Gaya, and well-equipped science and computer labs.
                      </p>
                    </div>
                    <div className="border border-orange-100 bg-orange-50/40 p-5 rounded-2xl">
                      <h4 className="font-bold text-sm text-orange-800 mb-2">Weaknesses (W)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Limited international student exchange programs and potential to expand corporate industry MoUs.
                      </p>
                    </div>
                    <div className="border border-blue-100 bg-blue-50/40 p-5 rounded-2xl">
                      <h4 className="font-bold text-sm text-blue-900 mb-2">Opportunities (O)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Launching more skill-based certification courses, starting PG courses in Physics, and developing a local incubation cell.
                      </p>
                    </div>
                    <div className="border border-red-100 bg-red-50/40 p-5 rounded-2xl">
                      <h4 className="font-bold text-sm text-red-800 mb-2">Challenges (C)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Rapid technological shifts requiring constant hardware upgrades and competition from national online degree providers.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ORGANOGRAM & ADMIN SETUPS */}
              {activeTab === 'distinctiveness' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900">Institutional Distinctiveness</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Gautam Budha Mahila College Gaya stands out for its **Gold Medalist Mentorship Programme**. We assign highly qualified PhD faculty members to counsel top-performing students, preparing them for Magadh university merit slots, resulting in high academic yields.
                  </p>
                </div>
              )}

              {activeTab === 'egovernance' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900">E-Governance</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We have implemented E-governance across all domains:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
                    <li>**Administration**: Online biometric and student portal databases.</li>
                    <li>**Student Admission**: Online application system & payment gateway simulation.</li>
                    <li>**Examinations**: Online portal for marks uploads, grade sheet generation, and results publication.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'organogram' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 font-sans">Organogram Chart</h2>
                  <div className="border border-slate-100 bg-slate-50 p-6 rounded-2xl flex flex-col items-center">
                    {/* Visual tree representation */}
                    <div className="bg-blue-900 text-white font-bold text-xs px-4 py-2 rounded shadow mb-4">
                      Managing Committee / Chairman
                    </div>
                    <div className="w-0.5 h-6 bg-slate-300 mb-4" />
                    <div className="bg-indigo-950 text-white font-bold text-xs px-4 py-2 rounded shadow mb-4">
                      College Director
                    </div>
                    <div className="w-0.5 h-6 bg-slate-300 mb-4" />
                    <div className="bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded shadow mb-4">
                      Principal
                    </div>
                    <div className="w-0.5 h-6 bg-slate-300" />
                    <div className="w-64 h-0.5 bg-slate-300 mb-4" />
                    <div className="flex gap-4">
                      <div className="bg-slate-800 text-white px-3 py-1.5 rounded text-[10px] font-bold shadow">
                        HODs Academics
                      </div>
                      <div className="bg-slate-800 text-white px-3 py-1.5 rounded text-[10px] font-bold shadow">
                        Admin Registrar
                      </div>
                      <div className="bg-slate-800 text-white px-3 py-1.5 rounded text-[10px] font-bold shadow">
                        IQAC Cell
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'administrative' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900">Administrative Setup</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The college administration operates under the guidance of the Director and Principal. Key sections include the Academic Council, the Examination Controller Committee, and the Registrar Office managing student databases, admissions, and Magadh University compliance.
                  </p>
                </div>
              )}

               {activeTab === 'perspective' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900">Institutional Perspective Plan</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The 5-Year Institutional Perspective Plan concentrates on obtaining PG status for all biological and physical science departments, expanding student-centered NSS social support schemes, and constructing smart audio-visual seminar halls.
                  </p>
                </div>
              )}

              {activeTab === 'iqac' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900">IQAC &amp; NAAC Committee</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The Internal Quality Assurance Cell (IQAC) of Gautam Budha Mahila College monitors academic quality standards, audits teaching feedback loops, organizes workshops on NAAC benchmarks, and ensures continuous institutional quality improvements.
                  </p>
                  <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 mt-4">
                    <h4 className="font-bold text-sm text-slate-800">IQAC Functions</h4>
                    <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5 mt-2">
                      <li>Development of quality benchmarks/parameters for academic and administrative activities.</li>
                      <li>Facilitating the creation of a learner-centric environment conducive to quality education.</li>
                      <li>Arrangement for feedback response from students, parents, and other stakeholders.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'aishe' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900">AISHE &amp; NCTE Disclosures</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Under the regulations of the Ministry of Education, we publish our annual AISHE (All India Survey on Higher Education) certificates, Teacher Education NCTE approvals for the integrated B.Ed/B.Sc. B.Ed courses, and statutory disclosure reports.
                  </p>
                </div>
              )}

              {activeTab === 'conduct' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900">Code of Conduct</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Our Code of Conduct outlines the ethical guidelines and responsibilities expected from our students, academic faculty, and administrative staff:
                  </p>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5 mt-2">
                    <li>**For Students**: Regular attendance (min 75%), adherence to deadlines, maintenance of discipline, and prohibition of ragging.</li>
                    <li>**For Staff**: Ethical teaching practices, professional integrity, and guidance of student research.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'antiragging' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-red-700">Anti-Ragging Cell</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Gautam Budha Mahila College has a strict **Zero-Tolerance Policy** towards ragging. The Anti-Ragging Cell, headed by senior faculty members, conducts surprise audits, organizes sensitization talks, and acts swiftly on student grievances.
                  </p>
                  <p className="text-xs text-slate-500 font-bold mt-2">Emergency Help: Contact office or submit an Inquiry form to report any incident.</p>
                </div>
              )}

              {activeTab === 'placement' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900">Placement &amp; Career Guidance Cell</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The placement cell facilitates corporate tie-ups, conducts resume writing workshops, mock interview sessions, and organizes career guidance seminars to prepare students for corporate roles, civil services exams, and software professions.
                  </p>
                </div>
              )}

              {activeTab === 'alumni' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900">Alumni Association</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Our strong network of alumni spans academics, civil service, healthcare, and IT sectors. The Alumni Association connects past graduates with current students through mentoring sessions, guest lectures, and annual reunion programs.
                  </p>
                </div>
              )}

              {activeTab === 'womencell' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-pink-700">Women Cell &amp; Welfare Committee</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Dedicated to women empowerment, our Women Cell addresses gender sensitization concerns, hosts self-defense bootcamps, celebrates Women's Day seminars, and ensures a safe, equal, and thriving academic environment for all female students.
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
