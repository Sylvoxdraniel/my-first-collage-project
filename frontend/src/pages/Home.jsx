import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { 
  Award, BookOpen, Calendar, ChevronRight, Phone, Mail, FileText, 
  Users, Star, ArrowUpRight, GraduationCap, Building, Trophy, Sparkles
} from 'lucide-react';
import axios from 'axios';
import muLogo from '../assets/mu_logo.png';
import { useSiteSettings } from '../context/SiteSettingsContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Home() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sliders, settings } = useSiteSettings();
  const [activeSlides, setActiveSlides] = useState([]);

  useEffect(() => {
    if (sliders && sliders.length > 0) {
      setActiveSlides(sliders);
    } else {
      setActiveSlides([
        {
          title: 'TENTH CONVOCATION',
          subtitle: 'Magadh University, Bodh Gaya',
          caption: 'GOLD MEDALIST',
          description: 'Empowering students through knowledge, academic excellence, and state-of-the-art practical research labs. Our students continue to secure gold medals in Magadh University boards.',
          image_path: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
          button_text: 'Apply Online 2026',
          button_link: '/admission?tab=apply'
        },
        {
          title: 'ACADEMIC EXCELLENCE',
          subtitle: 'Gautam Budha Mahila College',
          caption: 'TOPPERS CONGRATULATIONS',
          description: 'Our students continue to secure gold medals in Magadh University boards.',
          image_path: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
          button_text: 'Apply Online 2026',
          button_link: '/admission?tab=apply'
        },
        {
          title: 'INFRASTRUCTURE & LABS',
          subtitle: 'Modern Zoology & Physics Labs',
          caption: 'STATE-OF-THE-ART FACILITIES',
          description: 'State-of-the-art practical research labs with modern equipments.',
          image_path: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop',
          button_text: 'Apply Online 2026',
          button_link: '/admission?tab=apply'
        }
      ]);
    }
  }, [sliders]);

  useEffect(() => {
    // Fetch latest notices and events from the public API
    Promise.all([
      axios.get('/api/public/notices'),
      axios.get('/api/public/events')
    ])
      .then(([noticesRes, eventsRes]) => {
        setNotices(noticesRes.data.slice(0, 5));
        setEvents(eventsRes.data.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching homepage content:', err);
        // Fallback mock data in case DB is not seeded
        setNotices([
          { id: 1, title: 'Admissions Open for BA, BSc, BCA, BEd, MSc 2026-27', category: 'admission', created_at: '2026-05-25' },
          { id: 2, title: 'Syllabus and Exam Schedule for MU Sem-II/IV Exams', category: 'exam', created_at: '2026-05-24' },
          { id: 3, title: 'National Seminar on "Emerging Trends in Zoology" on June 10', category: 'academic', created_at: '2026-05-22' },
          { id: 4, title: 'Extension of Online Fee Payment Date to June 5', category: 'admission', created_at: '2026-05-20' },
          { id: 5, title: 'NSS Enrollment Guidelines and Activity Schedule', category: 'general', created_at: '2026-05-18' }
        ]);
        setEvents([
          { id: 1, title: 'Umang Annual Cultural Fest 2026', date: '2026-06-15', location: 'College Main Auditorium' },
          { id: 2, title: 'Inter-College Sports Tournament', date: '2026-06-22', location: 'Sports Ground Gaya' },
          { id: 3, title: 'National Level Chemistry Symposium', date: '2026-07-05', location: 'Seminar Hall A' }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-slate-50 text-slate-800 pb-16">
      
      {/* 1. HERO CAROUSEL SECTION (Red/Navy theme as requested) */}
      <div className="relative overflow-hidden" style={{ backgroundColor: settings?.hero_bg || '#990000' }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="h-[450px] lg:h-[550px] w-full"
        >
          {activeSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div 
                className="w-full h-full bg-cover bg-center relative flex items-center"
                style={{ backgroundImage: `url(${slide.image_path.startsWith('http') ? slide.image_path : `/api${slide.image_path}`})` }}
              >
                {/* Gradient Overlays using custom branding colors */}
                <div 
                  className="absolute inset-0 mix-blend-multiply z-0" 
                  style={{ 
                    background: `linear-gradient(to right, ${settings?.primary_color || '#0b1b3d'}e6, ${settings?.hero_bg || '#990000'}e6)` 
                  }} 
                />
                <div className="absolute inset-0 bg-black/30 z-0" />

                <div className="max-w-7xl mx-auto px-8 w-full z-10 text-white relative">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl space-y-4"
                  >
                    <span 
                      className="inline-block px-3 py-1 text-slate-950 font-black text-xs uppercase tracking-widest rounded shadow"
                      style={{ backgroundColor: settings?.accent_color || '#eab308' }}
                    >
                      {slide.caption || 'HIGHLIGHT'}
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md">
                      {slide.title}
                    </h2>
                    <p className="text-lg sm:text-xl font-bold drop-shadow" style={{ color: settings?.accent_color || '#eab308' }}>
                      {slide.subtitle}
                    </p>
                    <p className="text-sm sm:text-base text-slate-100/90 leading-relaxed max-w-lg">
                      {slide.description || 'Empowering students through knowledge, academic excellence, and state-of-the-art practical research labs.'}
                    </p>
                    <div className="flex gap-4 pt-4">
                      {slide.button_text && (
                        <Link to={slide.button_link || '#'}>
                          <button 
                            className={`hover:scale-105 text-slate-950 font-black px-6 py-2.5 transition-all shadow-lg flex items-center gap-2 ${settings?.button_style || 'rounded'}`}
                            style={{ backgroundColor: settings?.accent_color || '#eab308' }}
                          >
                            {slide.button_text} <ArrowUpRight size={16} />
                          </button>
                        </Link>
                      )}
                      <Link to="/about">
                        <button className="border border-white/60 hover:bg-white/10 text-white px-6 py-2.5 rounded transition-all">
                          Read More
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Dynamic Torn Paper Jagged Wave at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-50 torn-paper-top z-20 pointer-events-none" />
      </div>

      {/* 2. UNIVERSITY AFFILIATION & NAAC HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#cc0000] flex items-center justify-center border border-red-100">
              <Award size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">NAAC Accredited B College</h3>
              <p className="text-xs text-slate-500 mt-1">Recognized for high quality teaching and infrastructure setup.</p>
            </div>
          </div> */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center p-1 border border-slate-200 overflow-hidden shadow shrink-0">
              <img src={muLogo} alt="Magadh University Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Magadh University Affiliation</h3>
              <p className="text-xs text-slate-500 mt-1">Our UG, PG, and PhD syllabus matches the University requirements.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Gold Medalist Legacy</h3>
              <p className="text-xs text-slate-500 mt-1">Over 25+ university-level gold medals secured by college toppers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DOUBLE MESSAGE SECTION (Director & Chairman) */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Director Message */}
          <div className="bg-slate-50 border border-slate-200/60 p-8 rounded-2xl flex flex-col md:flex-row gap-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-xl pointer-events-none" />
            <div className="w-28 h-28 rounded-xl bg-blue-100 border border-blue-200 flex-shrink-0 mx-auto md:mx-0 overflow-hidden shadow">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop" 
                alt="Director" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="space-y-3">
              <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-black tracking-wider uppercase">Principal Message</span>
              <h3 className="text-xl font-bold text-blue-900">Prof. (Dr.) Seema Patel</h3>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Our mission at Gautam Budha Mahila College is to create an educational atmosphere that inspires research and innovation. We emphasize value-based education and practical excellence to equip students for global careers."
              </p>
              <Link to="/about?tab=director" className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1">
                Read Full Message <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Chairman Message */}
          <div className="bg-slate-50 border border-slate-200/60 p-8 rounded-2xl flex flex-col md:flex-row gap-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-xl pointer-events-none" />
            <div className="w-28 h-28 rounded-xl bg-red-100 border border-red-200 flex-shrink-0 mx-auto md:mx-0 overflow-hidden shadow">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop" 
                alt="Chairman" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="space-y-3">
              <span className="text-[10px] bg-red-100 text-[#cc0000] px-2 py-0.5 rounded font-black tracking-wider uppercase">VC Message</span>
              <h3 className="text-xl font-bold text-[#cc0000]">Prof. (Dr.) Dilip Kumar Kesari</h3>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Gautam Budha Mahila College Gaya represents educational growth, community service, and academic leadership. I welcome all students to step inside our campus and discover their maximum potential with our dedicated faculty."
              </p>
              <Link to="/about?tab=chairman" className="text-xs text-[#cc0000] hover:text-[#aa0000] font-bold inline-flex items-center gap-1">
                Read Full Message <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS COUNTER */}
      <section className="bg-[#0b1b3d] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <p className="text-4xl md:text-5xl font-black text-yellow-400">20+</p>
            <p className="text-xs uppercase text-blue-200 tracking-wider font-semibold">Years of Excellence</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl md:text-5xl font-black text-yellow-400">18+</p>
            <p className="text-xs uppercase text-blue-200 tracking-wider font-semibold">Programs Offered</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl md:text-5xl font-black text-yellow-400">3,500+</p>
            <p className="text-xs uppercase text-blue-200 tracking-wider font-semibold">Enrolled Students</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl md:text-5xl font-black text-yellow-400">80+</p>
            <p className="text-xs uppercase text-blue-200 tracking-wider font-semibold">Faculty Members</p>
          </div>
        </div>
      </section>

      {/* 5. NOTICE BOARD & EVENTS BLOCK */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Public Notice Board */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="text-blue-800" size={22} />
              Latest Notices & Notice Board
            </h3>
            <Link to="/notices" className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading notices...</div>
            ) : (
              notices.map((notice) => (
                <div key={notice.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                  <div className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 mt-0.5">
                    {notice.category}
                  </div>
                  <div className="space-y-1">
                    <Link to={`/notices?id=${notice.id}`} className="font-bold text-sm text-slate-800 hover:text-blue-900 block leading-snug">
                      {notice.title}
                    </Link>
                    <p className="text-[10px] text-slate-400">{notice.created_at.slice(0, 10)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Events Block */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="text-red-700" size={22} />
              Upcoming Events
            </h3>
            <Link to="/student-activities" className="text-xs font-bold text-red-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-slate-400 text-xs">Loading events...</div>
            ) : (
              events.map((evt) => (
                <div key={evt.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow transition-shadow space-y-2">
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-black tracking-wider">
                    {evt.date}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800">{evt.title}</h4>
                  <p className="text-xs text-slate-500">{evt.location}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. FEATURED DEPARTMENTS / COURSES */}
      <section className="bg-[#f1f5f9] py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-slate-900">Featured Programs & Courses</h2>
            <p className="text-slate-500 text-sm">
              Discover our wide selection of Undergraduate (UG), Postgraduate (PG), and PhD research programs designed for career success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* BA */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition-all">
              <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded uppercase">Undergraduate</span>
              <h3 className="font-bold text-lg text-slate-900 mt-2">Bachelor of Arts (BA)</h3>
              <p className="text-xs text-slate-500 mt-2">Subjects include Hindi Literature, Geography, History, Economics, and Sociology. Duration: 3 Years.</p>
              <Link to="/courses?type=ug&id=ba" className="text-xs text-blue-600 hover:text-blue-800 font-bold mt-4 inline-flex items-center gap-1">
                Course Details <ChevronRight size={14} />
              </Link>
            </div>

            {/* BSc Math & Bio */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition-all">
              <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded uppercase">Undergraduate</span>
              <h3 className="font-bold text-lg text-slate-900 mt-2">BSc (Maths & Biology)</h3>
              <p className="text-xs text-slate-500 mt-2">Specializations in Botany, Chemistry, Physics, Zoology, and Mathematics. Access to fully equipped laboratories. 3 Years.</p>
              <Link to="/courses?type=ug&id=bsc-math" className="text-xs text-blue-600 hover:text-blue-800 font-bold mt-4 inline-flex items-center gap-1">
                Course Details <ChevronRight size={14} />
              </Link>
            </div>

            {/* BCA */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition-all">
              <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded uppercase">Undergraduate</span>
              <h3 className="font-bold text-lg text-slate-900 mt-2">Computer Applications (BCA)</h3>
              <p className="text-xs text-slate-500 mt-2">Learn Web Development, Database Management, Python programming, and Software Engineering. 3 Years.</p>
              <Link to="/courses?type=ug&id=bca" className="text-xs text-blue-600 hover:text-blue-800 font-bold mt-4 inline-flex items-center gap-1">
                Course Details <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link to="/courses">
              <button className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-lg shadow transition-colors">
                View All Courses
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section className="max-w-5xl mx-auto px-6 mt-16">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="absolute top-[-40%] right-[-10%] w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-300">
              <Sparkles size={12} /> Admissions Open for 2026-27
            </span>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-none">
              Take the First Step Toward Your Golden Future
            </h3>
            <p className="text-sm text-blue-200 leading-relaxed">
              Submit your application form online in minutes. Upload documents and track review status.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <Link to="/admission?tab=apply">
              <button className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 hover:scale-105 font-black px-6 py-3 rounded-xl shadow-lg transition-all text-sm">
                Apply Online Now
              </button>
            </Link>
            <Link to="/contact">
              <button className="border border-white/40 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-sm transition-colors">
                Inquire Form
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
