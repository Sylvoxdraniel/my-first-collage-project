import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Award, BookOpen, Calendar, ChevronRight, Phone, Mail, FileText, Users, Star, ArrowUpRight, GraduationCap, Building, Trophy, Sparkles, BookMarked, FlaskConical, Landmark, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import muLogo from '../assets/mu_logo.png';
import { useSiteSettings } from '../context/SiteSettingsContext';
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

  const primaryColor = settings?.primary_color || '#0b1b3d';
  const secondaryColor = settings?.secondary_color || '#cc0000';

  const sectionRefs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    sectionRefs.current.forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

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

  const [dbDepartments, setDbDepartments] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get('/api/public/notices'),
      axios.get('/api/public/events'),
      axios.get('/api/public/departments').catch(() => ({ data: [] }))
    ])
      .then(([noticesRes, eventsRes, deptsRes]) => {
        setNotices(noticesRes.data.slice(0, 5));
        setEvents(eventsRes.data.slice(0, 4));
        setDbDepartments(deptsRes.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching homepage content:', err);
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
          { id: 3, title: 'National Level Chemistry Symposium', date: '2026-07-05', location: 'Seminar Hall A' },
          { id: 4, title: 'NSS Orientation & Planning Meet', date: '2026-07-12', location: 'Seminar Hall B' }
        ]);
        setLoading(false);
      });
  }, []);

  const staticDepartments = [
    { id: 'arts', name: 'Department of Arts', icon: BookMarked, color: 'from-violet-500 to-purple-600', desc: 'Hindi, English, History, Geography, Economics, Sociology and more humanities subjects.' },
    { id: 'computer', name: 'Computer Science', icon: GraduationCap, color: 'from-blue-500 to-cyan-600', desc: 'BCA program with Web Development, DBMS, Python, Software Engineering, and AI fundamentals.' },
    { id: 'education', name: 'Department of Education', icon: BookOpen, color: 'from-amber-500 to-orange-600', desc: 'B.Ed program preparing future educators with pedagogy, psychology, and teaching practice.' },
    { id: 'chemistry', name: 'Department of Chemistry', icon: FlaskConical, color: 'from-emerald-500 to-green-600', desc: 'Organic, Inorganic, Physical Chemistry with fully equipped modern laboratories.' },
    { id: 'botany', name: 'Department of Botany', icon: Landmark, color: 'from-lime-500 to-green-600', desc: 'Plant sciences, taxonomy, ecology, and botanical research with herbarium facilities.' },
    { id: 'zoology', name: 'Department of Zoology', icon: Star, color: 'from-rose-500 to-pink-600', desc: 'Animal biology, entomology, genetics, and hands-on dissection laboratory experience.' }
  ];

  const getDisplayDepartments = () => {
    if (!dbDepartments || dbDepartments.length === 0) {
      return staticDepartments;
    }

    return dbDepartments.map(dbd => {
      const match = staticDepartments.find(sd => 
        sd.name.toLowerCase() === dbd.name.toLowerCase() ||
        dbd.name.toLowerCase().includes(sd.name.toLowerCase()) ||
        sd.name.toLowerCase().includes(dbd.name.toLowerCase())
      );

      return {
        id: dbd.id,
        name: dbd.name,
        icon: match?.icon || GraduationCap,
        color: match?.color || 'from-blue-500 to-cyan-600',
        desc: dbd.description || match?.desc || 'Explore academic courses, facilities, and faculties in this department.'
      };
    });
  };

  const departments = getDisplayDepartments();

  const stats = [
    { icon: Users, value: '2000+', label: 'Students Enrolled', color: 'bg-blue-100 text-blue-600' },
    { icon: GraduationCap, value: '50+', label: 'Expert Faculty', color: 'bg-emerald-100 text-emerald-600' },
    { icon: BookOpen, value: '25+', label: 'Courses Offered', color: 'bg-amber-100 text-amber-600' },
    { icon: Trophy, value: '15+', label: 'Years Established', color: 'bg-rose-100 text-rose-600' }
  ];

  const features = [
    { icon: Award, title: 'NAAC Accredited', desc: 'Recognized for maintaining high standards in teaching, infrastructure, and governance.' },
    { icon: Users, title: 'Expert Faculty', desc: 'Highly qualified and dedicated professors with decades of teaching and research experience.' },
    { icon: BookOpen, title: 'Modern Labs', desc: 'State-of-the-art laboratories for Physics, Chemistry, Zoology, Botany, and Computer Science.' },
    { icon: Trophy, title: 'University Toppers', desc: 'Consistent record of producing Magadh University gold medalists and rank holders every year.' }
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop'
  ];

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return { day: d.getDate(), month: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear() };
  };

  const categoryColors = {
    admission: 'bg-green-100 text-green-700',
    exam: 'bg-orange-100 text-orange-700',
    academic: 'bg-blue-100 text-blue-700',
    general: 'bg-slate-100 text-slate-600'
  };

  return (
    <div className="bg-white text-slate-800">

      {/* ========== 1. HERO CAROUSEL ========== */}
      <div className="relative w-full overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={800}
          loop={true}
          className="h-[75vh] md:h-[70vh] min-h-[480px] md:min-h-[580px] w-full"
        >
          {activeSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full relative flex items-center">
                <img
                  src={slide.image_path.startsWith('http') ? slide.image_path : `/api${slide.image_path}`}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-[1]" />

                <div className="max-w-7xl mx-auto px-6 md:px-8 w-full z-10 relative">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl space-y-3 sm:space-y-5"
                  >
                    <span
                      className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      {slide.caption || 'HIGHLIGHT'}
                    </span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-lg md:text-xl font-semibold text-white/90 drop-shadow">
                      {slide.subtitle}
                    </p>
                    <p className="hidden sm:block text-xs md:text-base text-slate-200/90 leading-relaxed max-w-xl">
                      {slide.description || 'Empowering students through knowledge, academic excellence, and state-of-the-art practical research labs.'}
                    </p>
                    <div className="flex gap-3 sm:gap-4 pt-2">
                      {slide.button_text && (
                        <Link to={slide.button_link || '#'}>
                          <button
                            className="text-white font-bold px-5 py-2 sm:px-8 sm:py-3 rounded-lg hover:scale-105 transition-all shadow-lg flex items-center gap-2 text-xs sm:text-sm"
                            style={{ backgroundColor: secondaryColor }}
                          >
                            {slide.button_text} <ArrowUpRight size={16} />
                          </button>
                        </Link>
                      )}
                      <Link to="/about">
                        <button className="border-2 border-white/60 hover:bg-white/10 text-white px-5 py-2 sm:px-8 sm:py-3 rounded-lg transition-all text-xs sm:text-sm font-semibold">
                          Learn More
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Decorative wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* ========== 2. STATS COUNTER ROW ========== */}
      <section className="relative z-30 md:-mt-16 -mt-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <stat.icon size={22} />
              </div>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== 3. WELCOME / ABOUT SECTION ========== */}
      <section
        className="fade-in-section py-16 md:py-20 px-6 bg-white"
        ref={el => sectionRefs.current[0] = el}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: secondaryColor }}>
                About Our College
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                Welcome to {settings?.college_name || 'Our College'}
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Established with a vision to empower women through quality education, our college has been a beacon of academic excellence in the Gaya region. Affiliated with Magadh University, Bodh Gaya, we offer a wide range of undergraduate, postgraduate, and professional programs.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Our dedicated faculty, modern infrastructure, well-equipped laboratories, and vibrant campus life create an environment that nurtures intellectual growth, critical thinking, and holistic development of every student.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 font-bold text-sm hover:gap-3 transition-all" style={{ color: secondaryColor }}>
              Read More About Us <ChevronRight size={16} />
            </Link>
          </div>

          {/* Right: Decorative Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop"
                alt="College Campus"
                className="w-full h-[380px] object-cover"
              />
            </div>
            {/* Decorative accent border */}
            <div
              className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border-4 -z-10"
              style={{ borderColor: secondaryColor + '30' }}
            />
            {/* Small badge overlay */}
            <div
              className="absolute -bottom-6 -left-4 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-2">
                <Award size={18} />
                <span>NAAC Accredited</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 4. LATEST NEWS & NOTICES ========== */}
      <section
        className="fade-in-section py-16 px-6 bg-slate-50"
        ref={el => sectionRefs.current[1] = el}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left: Latest Notices */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                    <FileText size={20} className="text-white" />
                  </div>
                  Latest Notices
                </h3>
                <Link to="/notices" className="text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: secondaryColor }}>
                  View All <ChevronRight size={16} />
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden divide-y divide-slate-100">
                {loading ? (
                  <div className="space-y-0 divide-y divide-slate-100">
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} className="p-4 flex items-center gap-4 animate-pulse">
                        <div className="w-14 h-14 bg-slate-200 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-3/4" />
                          <div className="h-3 bg-slate-100 rounded w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notices.length > 0 ? (
                  notices.map((notice) => {
                    const d = formatDate(notice.created_at);
                    return (
                      <div key={notice.id} className="p-4 flex items-start gap-4 group notice-item">
                        <div
                          className="w-14 h-14 rounded-lg flex flex-col items-center justify-center flex-shrink-0 text-white"
                          style={{ backgroundColor: secondaryColor }}
                        >
                          <span className="text-lg font-black leading-none">{d.day}</span>
                          <span className="text-[10px] uppercase font-bold">{d.month}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/notices?id=${notice.id}`}
                            className="font-semibold text-sm text-slate-800 hover:text-blue-900 block leading-snug group-hover:underline"
                          >
                            {notice.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${categoryColors[notice.category] || 'bg-slate-100 text-slate-600'}`}>
                              {notice.category}
                            </span>
                            <span className="text-[10px] text-slate-400">{notice.created_at.slice(0, 10)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    No recent notices available
                  </div>
                )}
              </div>
            </div>

            {/* Right: Upcoming Events */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: secondaryColor }}>
                    <Calendar size={20} className="text-white" />
                  </div>
                  Upcoming Events
                </h3>
                <Link to="/student-activities" className="text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: secondaryColor }}>
                  View All <ChevronRight size={16} />
                </Link>
              </div>

              <div className="space-y-4">
                {loading ? (
                  [1, 2, 3].map(n => (
                    <div key={n} className="bg-white rounded-xl p-5 shadow-md animate-pulse">
                      <div className="h-3 bg-slate-200 rounded w-1/4 mb-3" />
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  ))
                ) : events.length > 0 ? (
                  events.map((evt) => {
                    const d = formatDate(evt.date);
                    return (
                      <div key={evt.id} className="event-card">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-14 h-14 rounded-lg flex flex-col items-center justify-center flex-shrink-0 text-white"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <span className="text-lg font-black leading-none">{d.day}</span>
                            <span className="text-[10px] uppercase font-bold">{d.month}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-slate-800 leading-snug">{evt.title}</h4>
                            <div className="flex items-center gap-1.5 mt-2 text-slate-500">
                              <MapPin size={13} />
                              <span className="text-xs">{evt.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-xl p-8 text-center text-slate-400 text-sm shadow-md border border-slate-100">
                    No upcoming events scheduled
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 5. OUR DEPARTMENTS ========== */}
      <section
        className="fade-in-section py-16 md:py-20 px-6 bg-slate-50"
        ref={el => sectionRefs.current[2] = el}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: secondaryColor }}>
              Explore Academics
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Our Departments</h2>
            <p className="text-slate-500 mt-3 text-sm leading-relaxed">
              Discover our wide range of academic departments offering undergraduate, postgraduate, and research programs designed for career success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {departments.map((dept, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="department-card p-6 border border-slate-100 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <dept.icon size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{dept.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{dept.desc}</p>
                <Link
                  to={dept.id ? `/departments?dept=${dept.id}` : "/departments"}
                  className="text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
                  style={{ color: secondaryColor }}
                >
                  View Details <ChevronRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 6. WHY CHOOSE US ========== */}
      <section
        className="fade-in-section py-16 md:py-20 px-6 bg-white"
        ref={el => sectionRefs.current[3] = el}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: secondaryColor }}>
              Our Strengths
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Why Choose Us</h2>
            <p className="text-slate-500 mt-3 text-sm leading-relaxed">
              We are committed to providing a transformative educational experience that prepares students for excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  <feat.icon size={28} />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 7. PRINCIPAL'S MESSAGE ========== */}
      <section
        className="fade-in-section py-16 md:py-20 px-6 bg-blue-50"
        ref={el => sectionRefs.current[4] = el}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Image / Avatar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                <div
                  className="w-64 h-72 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop"
                    alt="Principal"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = '<span class="text-6xl font-black text-white/30">SP</span>';
                    }}
                  />
                </div>
                <div
                  className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-4 -z-10"
                  style={{ borderColor: primaryColor + '20' }}
                />
              </div>
            </motion.div>

            {/* Right: Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <p className="text-sm font-bold uppercase tracking-wider" style={{ color: secondaryColor }}>
                From the Principal's Desk
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                A Message of Inspiration
              </h2>
              <div className="relative pl-6 border-l-4" style={{ borderColor: secondaryColor }}>
                <p className="text-slate-600 leading-relaxed italic text-base">
                  "Our mission at {settings?.college_name || 'this college'} is to create an educational atmosphere that inspires research and innovation. We emphasize value-based education and practical excellence to equip students for global careers. Every student who walks through our doors is given the opportunity to discover their potential and become leaders of tomorrow."
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900">Prof. (Dr.) Seema Patel</h4>
                <p className="text-sm text-slate-500">Principal, {settings?.college_name || 'Our College'}</p>
              </div>
              <Link
                to="/about?tab=director"
                className="inline-flex items-center gap-2 font-bold text-sm hover:gap-3 transition-all"
                style={{ color: secondaryColor }}
              >
                Read Full Message <ChevronRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== 8. CAMPUS GALLERY PREVIEW ========== */}
      <section
        className="fade-in-section py-16 md:py-20 px-6 bg-white"
        ref={el => sectionRefs.current[5] = el}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: secondaryColor }}>
              Life at Campus
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Campus Gallery</h2>
            <p className="text-slate-500 mt-3 text-sm leading-relaxed">
              Take a glimpse into our vibrant campus, modern facilities, and engaging student activities.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <Link 
                key={i}
                to="/gallery"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`Campus ${i + 1}`}
                    className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/gallery" target="_blank" rel="noopener noreferrer">
              <button
                className="font-bold px-8 py-3 rounded-lg text-white hover:scale-105 transition-all shadow-lg text-sm inline-flex items-center gap-2"
                style={{ backgroundColor: primaryColor }}
              >
                View Full Gallery <ArrowUpRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== 9. CALL TO ACTION ========== */}
      <section className="py-16 px-6">
        <div
          className="max-w-7xl mx-auto rounded-2xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, #1e3a5f)` }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative z-10 space-y-6"
          >
            <div className="inline-flex items-center gap-2 text-sm font-bold text-yellow-300">
              <Sparkles size={16} />
              <span>Admissions Open for 2026-27</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight max-w-2xl mx-auto">
              Ready to Start Your Academic Journey?
            </h2>
            <p className="text-blue-200 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Take the first step toward your future. Submit your application online, explore our programs, and join a community of excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/admission?tab=apply">
                <button
                  className="font-bold px-8 py-3.5 rounded-lg hover:scale-105 transition-all shadow-lg text-sm text-white"
                  style={{ backgroundColor: secondaryColor }}
                >
                  Apply Now
                </button>
              </Link>
              <Link to="/contact">
                <button className="border-2 border-white/40 hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-lg text-sm transition-all">
                  Contact Us
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
