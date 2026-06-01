import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import {
  Award, BookOpen, Calendar, ChevronRight, FileText,
  Users, GraduationCap, Trophy, Sparkles, ArrowRight, Phone,
  CheckCircle, Microscope, Library, Building, FlaskConical, Camera
} from 'lucide-react';
import axios from 'axios';
import muLogo from '../assets/mu_logo.png';
import { useSiteSettings } from '../context/SiteSettingsContext';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* ── Animated Counter Hook ── */
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ── Scroll-triggered section wrapper ── */
function FadeInSection({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`fade-in-section ${visible ? 'visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Default fallback sliders (used before DB loads) ── */
const DEFAULT_SLIDERS = [
  {
    title: 'TENTH CONVOCATION',
    subtitle: 'Magadh University, Bodh Gaya',
    caption: 'GOLD MEDALIST',
    description: 'Empowering students through academic excellence and state-of-the-art research. Our students secure gold medals in Magadh University boards year after year.',
    image_path: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1400&auto=format&fit=crop',
    button_text: 'Apply Online 2026',
    button_link: '/admission?tab=apply',
  },
  {
    title: 'ACADEMIC EXCELLENCE',
    subtitle: 'Gautam Budha Mahila College, Gaya',
    caption: 'TOPPERS RECOGNISED',
    description: 'Our students continue to achieve top ranks in Magadh University. Join a community of scholars, researchers, and future leaders.',
    image_path: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1400&auto=format&fit=crop',
    button_text: 'Explore Courses',
    button_link: '/courses',
  },
  {
    title: 'MODERN INFRASTRUCTURE',
    subtitle: 'Labs · Library · Seminar Halls',
    caption: 'STATE-OF-THE-ART',
    description: 'Experience world-class laboratories, a well-stocked library, smart classrooms, and dedicated research facilities.',
    image_path: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1400&auto=format&fit=crop',
    button_text: 'View Campus',
    button_link: '/infrastructure?item=labs',
  },
];

/* ── Category badge colours ── */
const CATEGORY_COLORS = {
  admission: 'bg-blue-100 text-blue-800',
  exam:      'bg-orange-100 text-orange-800',
  academic:  'bg-green-100 text-green-800',
  general:   'bg-slate-100 text-slate-700',
  default:   'bg-indigo-100 text-indigo-800',
};

export default function Home() {
  const navigate = useNavigate();
  const { sliders, settings } = useSiteSettings();

  const [notices, setNotices]         = useState([]);
  const [events, setEvents]           = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  /* ── Dynamic sliders from Laravel DB ── */
  const activeSlides = sliders && sliders.length > 0 ? sliders : DEFAULT_SLIDERS;

  /* ── Fetch public notices + events from Laravel API ── */
  useEffect(() => {
    Promise.all([
      axios.get('/api/public/notices'),
      axios.get('/api/public/events'),
    ])
      .then(([noticeRes, eventRes]) => {
        setNotices(noticeRes.data.slice(0, 6));
        setEvents(eventRes.data.slice(0, 3));
      })
      .catch(() => {
        setNotices([
          { id: 1, title: 'Admissions Open for BA, BSc, BCA, BEd, MSc 2026-27', category: 'admission', created_at: '2026-05-25' },
          { id: 2, title: 'Syllabus and Exam Schedule for MU Sem-II/IV Exams Published', category: 'exam', created_at: '2026-05-24' },
          { id: 3, title: 'National Seminar on "Emerging Trends in Zoology" — June 10', category: 'academic', created_at: '2026-05-22' },
          { id: 4, title: 'Extension of Online Fee Payment Date to June 5, 2026', category: 'admission', created_at: '2026-05-20' },
          { id: 5, title: 'NSS Enrollment Guidelines and Activity Schedule Released', category: 'general', created_at: '2026-05-18' },
          { id: 6, title: 'CIA Examination Results – Semester IV Now Available', category: 'exam', created_at: '2026-05-16' },
        ]);
        setEvents([
          { id: 1, title: 'Umang Annual Cultural Fest 2026', date: '2026-06-15', location: 'College Main Auditorium' },
          { id: 2, title: 'Inter-College Sports Tournament', date: '2026-06-22', location: 'Sports Ground, Gaya' },
          { id: 3, title: 'National Chemistry Symposium', date: '2026-07-05', location: 'Seminar Hall A' },
        ]);
      })
      .finally(() => setDataLoading(false));
  }, []);

  /* ── Stats counter visibility ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const statsYearsVal = parseInt(settings?.stats_years || '20', 10);
  const statsProgramsVal = parseInt(settings?.stats_programs || '18', 10);
  const statsStudentsVal = parseInt(settings?.stats_students || '3500', 10);
  const statsFacultyVal = parseInt(settings?.stats_faculty || '80', 10);

  const years    = useCountUp(statsYearsVal,    1600, statsVisible);
  const programs = useCountUp(statsProgramsVal, 1400, statsVisible);
  const students = useCountUp(statsStudentsVal, 1800, statsVisible);
  const faculty  = useCountUp(statsFacultyVal,  1500, statsVisible);

  /* ── Colours from Laravel settings (dynamic) ── */
  const primary   = settings?.primary_color   || '#0b1b3d';
  const secondary = settings?.secondary_color || '#cc0000';
  const accent    = settings?.accent_color    || '#d4a017';
  const heroBg    = settings?.hero_bg         || '#0b1b3d';
  const btnStyle  = settings?.button_style    || 'rounded-lg';

  return (
    <div className="bg-white text-slate-800">

      {/* ══════════════════════════════════════════
          SECTION 1 — HERO SLIDER  (dynamic from DB)
      ══════════════════════════════════════════ */}
      <section className="relative" style={{ backgroundColor: heroBg }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          loop
          className="h-[420px] md:h-[520px] w-full"
        >
          {activeSlides.map((slide, i) => {
            const imgSrc = slide.image_path?.startsWith('http')
              ? slide.image_path
              : `/api${slide.image_path}`;

            return (
              <SwiperSlide key={i}>
                <div
                  className="w-full h-full bg-cover bg-center relative flex items-center"
                  style={{ backgroundImage: `url(${imgSrc})` }}
                >
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to right, ${primary}ee 0%, ${primary}99 55%, transparent 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20" />

                  {/* Slide content */}
                  <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.65, ease: 'easeOut' }}
                      className="max-w-xl space-y-4"
                    >
                      {/* Caption badge */}
                      <span
                        className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded shadow-sm"
                        style={{ backgroundColor: accent, color: '#1a1a1a' }}
                      >
                        {slide.caption || 'HIGHLIGHT'}
                      </span>

                      {/* Main heading */}
                      <h2 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-sm">
                        {slide.title}
                      </h2>

                      {/* Subtitle */}
                      <p className="text-base md:text-lg font-semibold" style={{ color: accent }}>
                        {slide.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-white/85 leading-relaxed max-w-md">
                        {slide.description}
                      </p>

                      {/* Buttons */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        {slide.button_text && (
                          <Link to={slide.button_link || '#'}>
                            <button
                              className={`px-6 py-2.5 text-sm font-bold transition-all hover:scale-105 shadow-lg flex items-center gap-2 ${btnStyle}`}
                              style={{ backgroundColor: accent, color: '#1a1a1a' }}
                            >
                              {slide.button_text} <ArrowRight size={15} />
                            </button>
                          </Link>
                        )}
                        <Link to="/about">
                          <button className="px-6 py-2.5 text-sm font-semibold text-white border border-white/40 hover:bg-white/10 rounded-lg transition-colors">
                            Learn More
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — HIGHLIGHTS STRIP
      ══════════════════════════════════════════ */}
      <FadeInSection>
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Magadh University Affiliation */}
            <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm college-card">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-sm">
                <img src={muLogo} alt="Magadh University" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">Magadh University Affiliation</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">UG, PG &amp; PhD syllabus aligned with Magadh University standards.</p>
              </div>
            </div>

            {/* Gold Medalist Legacy */}
            <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm college-card">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 border border-yellow-100 flex items-center justify-center shrink-0">
                <Trophy size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">Gold Medalist Legacy</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">25+ university-level gold medals secured by college toppers.</p>
              </div>
            </div>

            {/* Admissions Open */}
            <div
              className="flex items-center gap-4 rounded-2xl p-5 shadow-sm text-white college-card cursor-pointer"
              style={{ backgroundColor: secondary }}
              onClick={() => navigate('/admission?tab=apply')}
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Admissions Open 2026-27</h3>
                <p className="text-xs text-white/80 mt-1">BA · BSc · BCA · BEd · MSc — Apply Online Now</p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ══════════════════════════════════════════
          SECTION 2.5 — ABOUT COLLEGE PREVIEW
      ══════════════════════════════════════════ */}
      <FadeInSection>
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: Image with offset border */}
          <div className="relative">
            <div className="absolute -inset-3 bg-red-650/10 rounded-3xl translate-x-2 translate-y-2 pointer-events-none" />
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop" 
              alt="College Campus" 
              className="w-full h-80 object-cover rounded-2xl border border-slate-200 shadow-md relative z-10"
            />
          </div>

          {/* Right: Info */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border bg-slate-50" style={{ color: primary, borderColor: primary }}>
              Welcome to Gautam Budha Mahila College
            </span>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">
              Empowering Women Through Quality Higher Education Since 1953
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Gautam Budha Mahila College, Gaya, is a constituent unit of Magadh University, Bodh Gaya. Recognized under sections 2(f) and 12(B) of the UGC Act, our institution stands as a premier seat of learning in Bihar. We offer specialized undergraduate, postgraduate, and research programmes designed to foster academic rigor and holistic development.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-semibold pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                UGC Approved &amp; Affiliated
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                25+ University Gold Medalists
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                Advanced Science Laboratories
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                Active NSS &amp; Sports Clubs
              </li>
            </ul>
            <div className="pt-2">
              <Link to="/about">
                <button
                  className="px-6 py-2.5 rounded-lg text-xs font-bold text-white hover:opacity-90 transition-opacity shadow-sm"
                  style={{ backgroundColor: primary }}
                >
                  Read College Profile
                </button>
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ══════════════════════════════════════════
          SECTION 3 — MESSAGES (Principal / VC)
      ══════════════════════════════════════════ */}
      <FadeInSection>
        <section className="bg-slate-50 border-y border-slate-200 py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: secondary, borderColor: secondary }}>
                Leadership
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-3">Messages from Our Leaders</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Principal */}
              <FadeInSection delay={100}>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-5 shadow-sm college-card">
                  <div className="w-24 h-24 rounded-xl border border-blue-100 overflow-hidden shrink-0">
                    <img
                      src={settings?.principal_image_path || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop"}
                      alt="Principal"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded" style={{ backgroundColor: `${primary}15`, color: primary }}>
                      {settings?.principal_designation || "Principal's Message"}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{settings?.principal_name || "Prof. (Dr.) Seema Patel"}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{settings?.principal_message || "Our mission is to create an educational atmosphere that inspires research and innovation. We emphasise value-based education to equip students for global careers."}"
                    </p>
                    <Link to="/about?tab=director" className="text-xs font-bold flex items-center gap-1 hover:underline" style={{ color: primary }}>
                      Read Full Message <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </FadeInSection>

              {/* VC */}
              <FadeInSection delay={200}>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-5 shadow-sm college-card">
                  <div className="w-24 h-24 rounded-xl border border-red-100 overflow-hidden shrink-0">
                    <img
                      src={settings?.vc_image_path || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop"}
                      alt="Vice Chancellor"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded" style={{ backgroundColor: `${secondary}15`, color: secondary }}>
                      {settings?.vc_designation || "VC's Message"}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{settings?.vc_name || "Prof. (Dr.) Dilip Kumar Kesari"}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{settings?.vc_message || "Gautam Budha Mahila College represents educational growth, community service, and academic leadership. I welcome all students to discover their maximum potential."}"
                    </p>
                    <Link to="/about?tab=chairman" className="text-xs font-bold flex items-center gap-1 hover:underline" style={{ color: secondary }}>
                      Read Full Message <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ══════════════════════════════════════════
          SECTION 4 — STATS COUNTER
      ══════════════════════════════════════════ */}
      <section className="py-10 md:py-16 text-white" style={{ backgroundColor: primary }} ref={statsRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: years,    suffix: '+', label: 'Years of Excellence' },
              { value: programs, suffix: '+', label: 'Programmes Offered'  },
              { value: students, suffix: '+', label: 'Enrolled Students'   },
              { value: faculty,  suffix: '+', label: 'Faculty Members'     },
            ].map(({ value, suffix, label }) => (
              <div key={label} className="space-y-2">
                <p className="text-4xl md:text-5xl font-black" style={{ color: accent }}>
                  {value.toLocaleString()}{suffix}
                </p>
                <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — NOTICE BOARD + EVENTS
      ══════════════════════════════════════════ */}
      <FadeInSection>
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Notice Board — 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText size={20} style={{ color: primary }} />
                Latest Notices
              </h3>
              <Link to="/notices" className="text-xs font-bold flex items-center gap-1 hover:underline" style={{ color: primary }}>
                View All <ChevronRight size={13} />
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
              {dataLoading ? (
                <div className="p-8 text-center text-sm text-slate-400">Loading notices…</div>
              ) : notices.map((notice) => {
                const catClass = CATEGORY_COLORS[notice.category] || CATEGORY_COLORS.default;
                return (
                  <div key={notice.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5 ${catClass}`}>
                      {notice.category || 'Notice'}
                    </span>
                    <div className="min-w-0">
                      <Link
                        to={`/notices?id=${notice.id}`}
                        className="text-sm font-semibold text-slate-800 hover:text-blue-800 leading-snug block truncate"
                      >
                        {notice.title}
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {notice.created_at?.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Events — 1 col */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar size={20} style={{ color: secondary }} />
                Upcoming Events
              </h3>
              <Link to="/student-activities" className="text-xs font-bold flex items-center gap-1 hover:underline" style={{ color: secondary }}>
                View All <ChevronRight size={13} />
              </Link>
            </div>

            <div className="space-y-4">
              {dataLoading ? (
                <div className="text-sm text-slate-400">Loading events…</div>
              ) : events.map((evt) => (
                <div key={evt.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm college-card">
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${secondary}15`, color: secondary }}
                  >
                    {evt.date}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800 mt-2 leading-snug">{evt.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{evt.location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ══════════════════════════════════════════
          SECTION 6 — FEATURED COURSES
      ══════════════════════════════════════════ */}
      <FadeInSection>
        <section className="bg-slate-50 border-t border-slate-200 py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: primary, borderColor: primary }}>
                Academics
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-3">Featured Programmes &amp; Courses</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
                Undergraduate, Postgraduate, and PhD programmes designed for career success and academic excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  badge: 'Undergraduate',
                  title: 'Bachelor of Arts (BA)',
                  description: 'Hindi Literature, Geography, History, Economics, Sociology. Duration: 3 Years.',
                  link: '/courses?type=ug&id=ba',
                },
                {
                  badge: 'Undergraduate',
                  title: 'BSc (Mathematics & Biology)',
                  description: 'Botany, Chemistry, Physics, Zoology, Mathematics with fully equipped laboratories. 3 Years.',
                  link: '/courses?type=ug&id=bsc-math',
                },
                {
                  badge: 'Undergraduate',
                  title: 'Computer Applications (BCA)',
                  description: 'Web Development, Database Management, Python programming, and Software Engineering. 3 Years.',
                  link: '/courses?type=ug&id=bca',
                },
              ].map((course) => (
                <FadeInSection key={course.title} delay={100}>
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm college-card flex flex-col h-full">
                    <span
                      className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full self-start mb-3"
                      style={{ backgroundColor: `${primary}12`, color: primary }}
                    >
                      {course.badge}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug">{course.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed flex-1">{course.description}</p>
                    <Link
                      to={course.link}
                      className="mt-4 text-xs font-bold flex items-center gap-1 hover:underline"
                      style={{ color: primary }}
                    >
                      Course Details <ChevronRight size={13} />
                    </Link>
                  </div>
                </FadeInSection>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/courses">
                <button
                  className="px-8 py-3 rounded-lg font-bold text-sm text-white hover:opacity-90 transition-opacity shadow-sm"
                  style={{ backgroundColor: primary }}
                >
                  View All Courses
                </button>
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ══════════════════════════════════════════
          SECTION 6.2 — DEPARTMENTS PREVIEW
      ══════════════════════════════════════════ */}
      <FadeInSection>
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: secondary, borderColor: secondary }}>
              Academic Departments
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-3">Explore Our Departments</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              Our departments are guided by experienced PhD professors offering student mentorship schemes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Computer Science', path: '/departments?dept=computer', desc: 'BCA & IT Labs' },
              { title: 'Zoology', path: '/departments?dept=zoology', desc: 'Museum & Research Cabinets' },
              { title: 'Botany', path: '/departments?dept=botany', desc: 'Plant Taxonomy archives' },
              { title: 'Chemistry', path: '/departments?dept=chemistry', desc: 'Spectroscopy Labs' },
            ].map((dept) => (
              <Link key={dept.title} to={dept.path} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-900 hover:shadow-md transition-all college-card text-center block">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-3">
                  <BookOpen size={20} />
                </div>
                <h4 className="font-bold text-slate-800 text-sm leading-snug">{dept.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{dept.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* ══════════════════════════════════════════
          SECTION 6.4 — INFRASTRUCTURE PREVIEW
      ══════════════════════════════════════════ */}
      <FadeInSection>
        <section className="bg-slate-50 border-y border-slate-200 py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: primary, borderColor: primary }}>
                Infrastructure
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-3">Campus Facilities &amp; Resources</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
                Discover the state-of-the-art campus learning resources built for academic success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Digital Library', icon: <Library size={22} />, desc: 'Access to 15,000+ textbook specimens and online journals via E-Granthalaya.' },
                { title: 'Science Laboratories', icon: <Microscope size={22} />, desc: 'Fully equipped Botany, Zoology, and Chemistry practical research desks.' },
                { title: 'Smart Classrooms', icon: <Building size={22} />, desc: 'Audio-visual enabled smart desks designed for advanced digital pedagogies.' }
              ].map((item) => (
                <div key={item.title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm college-card">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-base text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/infrastructure">
                <button className="px-6 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-bold transition-all">
                  Explore Campus Facilities
                </button>
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ══════════════════════════════════════════
          SECTION 6.6 — RESEARCH & INNOVATION
      ══════════════════════════════════════════ */}
      <FadeInSection>
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border bg-slate-50" style={{ color: secondary, borderColor: secondary }}>
              Research Cell
            </span>
            <h3 className="text-2xl font-black text-slate-900">Research &amp; Innovation Framework</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Gautam Budha Mahila College promotes research workshops, journal publications, and student science research projects. Our Zoology and Botany faculty members act as approved PhD supervisors guiding national research scholars.
            </p>
            <div className="flex gap-4">
              <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 flex-1">
                <h4 className="font-bold text-slate-800 text-sm">8+ PhD Supervisors</h4>
                <p className="text-xs text-slate-500 mt-1">Experienced doctoral research guides.</p>
              </div>
              <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 flex-1">
                <h4 className="font-bold text-slate-800 text-sm">PG Lab Cabinets</h4>
                <p className="text-xs text-slate-500 mt-1">Equipped with specialized testing gear.</p>
              </div>
            </div>
            <div className="pt-2">
              <Link to="/research">
                <button className="px-6 py-2.5 rounded-lg text-xs font-bold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: secondary }}>
                  View Research Guidelines
                </button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 bg-blue-600/5 rounded-3xl translate-x-2 translate-y-2 pointer-events-none" />
            <img 
              src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=600&auto=format&fit=crop" 
              alt="Research Lab" 
              className="w-full h-80 object-cover rounded-2xl border border-slate-200 shadow-md relative z-10"
            />
          </div>
        </section>
      </FadeInSection>

      {/* ══════════════════════════════════════════
          SECTION 6.8 — GALLERY PREVIEW
      ══════════════════════════════════════════ */}
      <FadeInSection>
        <section className="bg-slate-50 border-t border-slate-200 py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: primary, borderColor: primary }}>
                Media &amp; Events
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-3">Campus Life Gallery</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
                Catch glimpses of annual sports meets, NSS community welfare rallies, and cultural functions.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=350&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=350&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=350&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=350&auto=format&fit=crop'
              ].map((img, idx) => (
                <div key={idx} className="h-48 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group cursor-pointer">
                  <img src={img} alt="Campus Event" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/gallery">
                <button className="px-6 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-bold transition-all">
                  View Full Gallery
                </button>
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ══════════════════════════════════════════
          SECTION 7 — CALL TO ACTION
      ══════════════════════════════════════════ */}
      <FadeInSection>
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16">
          <div
            className="rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-xl"
            style={{ background: `linear-gradient(135deg, ${primary} 0%, #1e3a8a 100%)` }}
          >
            {/* BG glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-3 max-w-lg text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: accent }}>
                <Sparkles size={13} /> Admissions Open for 2026-27
              </span>
              <h3 className="text-2xl md:text-3xl font-black leading-tight">
                Take the First Step Toward Your Future
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Submit your application form online in minutes. Upload documents and track your admission status in real-time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/admission?tab=apply">
                <button
                  className="px-7 py-3 rounded-xl font-black text-sm hover:opacity-90 transition-all hover:scale-105 shadow-lg"
                  style={{ backgroundColor: accent, color: '#1a1a1a' }}
                >
                  Apply Online Now
                </button>
              </Link>
              <Link to="/contact">
                <button className="px-7 py-3 rounded-xl text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors">
                  Inquire Now
                </button>
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}
