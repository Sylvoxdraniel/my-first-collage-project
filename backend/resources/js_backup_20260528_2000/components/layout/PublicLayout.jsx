import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Search, ChevronDown, ChevronRight,
  Phone, Mail, MapPin, LogIn,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import logoImg from '../../assets/logo.png';
import muLogo from '../../assets/mu_logo.png';
import { useSiteSettings } from '../../context/SiteSettingsContext';

/* ──────────────────────────────────────────────
   Navigation menu structure (unchanged)
────────────────────────────────────────────── */
const NAV_MENUS = [
  {
    title: 'About Us',
    links: [
      { label: 'About College',               path: '/about?tab=about' },
      { label: "VC's Message",                path: '/about?tab=chairman' },
      { label: "Principal's Message",         path: '/about?tab=director' },
      { label: "Patron's Message",            path: '/about?tab=principal' },
      { label: 'Vision & Mission',            path: '/about?tab=vision' },
      { label: 'SWOC Analysis',               path: '/about?tab=swoc' },
      { label: 'Institutional Distinctiveness',path: '/about?tab=distinctiveness' },
      { label: 'E-Governance',                path: '/about?tab=egovernance' },
      { label: 'Organogram',                  path: '/about?tab=organogram' },
      { label: 'Administrative Setup',        path: '/about?tab=administrative' },
      { label: 'Perspective Plan',            path: '/about?tab=perspective' },
    ],
  },
  {
    title: 'Academics',
    links: [
      { label: 'Academic Calendar',   path: '/academics?tab=calendar' },
      { label: 'Time Table',          path: '/academics?tab=timetable' },
      { label: 'Academic Activities', path: '/academics?tab=activities' },
      { label: 'CO PO & PSO',         path: '/academics?tab=copo' },
      { label: 'CIA Exam Results',    path: '/academics?tab=cia' },
      { label: 'Syllabus Download',   path: '/academics?tab=syllabus' },
      { label: 'Achievements',        path: '/academics?tab=achievements' },
      { label: 'MoUs & Collaborations',path: '/academics?tab=mous' },
    ],
  },
  {
    title: 'Admission',
    links: [
      { label: 'Admission Process',   path: '/admission?tab=process' },
      { label: 'Apply Online Form',   path: '/admission?tab=apply' },
      { label: 'Fee Structure',       path: '/admission?tab=fees' },
      { label: 'Required Documents',  path: '/admission?tab=docs' },
      { label: 'Eligibility Criteria',path: '/admission?tab=eligibility' },
      { label: 'Fee Payment',         path: '/admission?tab=payment' },
    ],
  },
  {
    title: 'Courses',
    links: [
      { label: 'UG: Bachelor of Arts (BA)',   path: '/courses?type=ug&id=ba' },
      { label: 'UG: BSc Mathematics',         path: '/courses?type=ug&id=bsc-math' },
      { label: 'UG: BSc Biology',             path: '/courses?type=ug&id=bsc-bio' },
      { label: 'UG: BCA',                     path: '/courses?type=ug&id=bca' },
      { label: 'UG: BA BEd Integrated',       path: '/courses?type=ug&id=ba-bed' },
      { label: 'UG: BSc BEd Integrated',      path: '/courses?type=ug&id=bsc-bed' },
      { label: 'PG: MSc Botany',              path: '/courses?type=pg&id=msc-botany' },
      { label: 'PG: MSc Chemistry',           path: '/courses?type=pg&id=msc-chemistry' },
      { label: 'PG: MSc Mathematics',         path: '/courses?type=pg&id=msc-math' },
      { label: 'PG: MSc Physics',             path: '/courses?type=pg&id=msc-physics' },
      { label: 'PG: MSc Zoology',             path: '/courses?type=pg&id=msc-zoology' },
      { label: 'PhD: Botany',                 path: '/courses?type=phd&id=phd-botany' },
      { label: 'PhD: Chemistry',              path: '/courses?type=phd&id=phd-chemistry' },
    ],
  },
  {
    title: 'Departments',
    links: [
      { label: 'Arts',         path: '/departments?dept=arts' },
      { label: 'Computer',     path: '/departments?dept=computer' },
      { label: 'Education',    path: '/departments?dept=education' },
      { label: 'Botany',       path: '/departments?dept=botany' },
      { label: 'Chemistry',    path: '/departments?dept=chemistry' },
      { label: 'Mathematics',  path: '/departments?dept=mathematics' },
      { label: 'Physics',      path: '/departments?dept=physics' },
      { label: 'Zoology',      path: '/departments?dept=zoology' },
    ],
  },
  {
    title: 'Infrastructure',
    links: [
      { label: 'Classrooms',   path: '/infrastructure?item=classrooms' },
      { label: 'Library',      path: '/infrastructure?item=library' },
      { label: 'Laboratories', path: '/infrastructure?item=labs' },
      { label: 'Computer Labs',path: '/infrastructure?item=complabs' },
      { label: 'Seminar Hall', path: '/infrastructure?item=seminar' },
      { label: 'RO Water Plant',path: '/infrastructure?item=water' },
      { label: 'Sports Complex',path: '/infrastructure?item=sports' },
    ],
  },
  {
    title: 'IQAC/NAAC',
    links: [
      { label: 'IQAC Cell',               path: '/about?tab=iqac' },
      { label: 'AQAR Reports',            path: '/notices?tab=aqar' },
      { label: 'AISHE / NCTE Data',       path: '/about?tab=aishe' },
      { label: 'Best Practices',          path: '/about?tab=distinctiveness' },
      { label: 'Code of Conduct',         path: '/about?tab=conduct' },
    ],
  },
  {
    title: 'Student Corner',
    links: [
      { label: 'E-Content & E-Library',   path: '/gallery?tab=econtent' },
      { label: 'College Newsletter',      path: '/gallery?tab=newsletter' },
      { label: 'Scholarships Schemes',    path: '/admission?tab=scholarships' },
      { label: 'Skill Development',       path: '/academics?tab=skills' },
    ],
  },
  {
    title: 'Committees',
    links: [
      { label: 'Anti-Ragging Cell',       path: '/about?tab=antiragging' },
      { label: 'Placement Cell',          path: '/about?tab=placement' },
      { label: 'Grievance Redressal',     path: '/contact?tab=grievance' },
      { label: 'Alumni Association',      path: '/about?tab=alumni' },
      { label: 'Women Cell & Committee',  path: '/about?tab=womencell' },
    ],
  },
];

export default function PublicLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen]         = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled]         = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');
  const [textSize, setTextSize]             = useState('normal'); 
  const [contrastMode, setContrastMode]     = useState('normal'); 
  const [windowWidth, setWindowWidth]       = useState(1200);
  const [nestedActiveDropdown, setNestedActiveDropdown] = useState(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (textSize === 'large') {
      root.style.fontSize = '17px';
    } else if (textSize === 'xlarge') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [textSize]);

  useEffect(() => {
    const root = document.documentElement;
    if (contrastMode === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [contrastMode]);

  /* Dynamic data from Laravel backend */
  const { settings, announcements: apiAnnouncements } = useSiteSettings();

  const [announcements, setAnnouncements] = useState([
    '✨ Welcome to Gautam Budha Mahila College, Gaya — Admissions Open for Session 2026-27!',
    "📅 Women's Day Seminar scheduled for next Monday at the Main Auditorium.",
    '🏆 Congratulations to our Gold Medalist students in Magadh University examinations!',
    '📚 CIA Examination Results and Academic Calendar 2026 are now available for download.',
  ]);

  /* Close mobile menu on navigation */
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  /* Sticky nav shadow on scroll */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Load announcements from Laravel API (dynamic) */
  useEffect(() => {
    if (apiAnnouncements && apiAnnouncements.length > 0) {
      setAnnouncements(apiAnnouncements.map(a => a.text));
    }
  }, [apiAnnouncements]);

  /* Helpers */
  const logoSrc = settings?.logo_path
    ? (settings.logo_path.startsWith('http') ? settings.logo_path : `/api${settings.logo_path}`)
    : logoImg;

  const primary   = settings?.primary_color   || '#0b1b3d';
  const secondary = settings?.secondary_color || '#cc0000';
  const accent    = settings?.accent_color    || '#d4a017';

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  /* Duplicate ticker content for seamless loop */
  const tickerText = announcements.join('     ·     ');

  // Dynamic Navigation Link Partitioning for Medium Screen Compatibility
  const is2xl = windowWidth >= 1536;
  const isXl = windowWidth >= 1280 && windowWidth < 1536;
  const isLg = windowWidth >= 1024 && windowWidth < 1280;

  const researchLink = { type: 'link', label: 'Research', path: '/research' };
  const nssLink = { type: 'link', label: 'NSS & Sports', path: '/student-activities' };
  const galleryLink = { type: 'link', label: 'Gallery', path: '/gallery' };
  const noticesLink = { type: 'link', label: 'Notices', path: '/notices' };
  const contactLink = { type: 'link', label: 'Contact Us', path: '/contact' };

  let mainItems = [];
  let moreItems = [];

  if (is2xl) {
    mainItems = [
      ...NAV_MENUS.map((m, i) => ({ type: 'menu', menuIndex: i, ...m })),
      researchLink,
      nssLink,
      galleryLink,
      noticesLink,
      contactLink
    ];
    moreItems = [];
  } else if (isXl) {
    mainItems = [
      ...NAV_MENUS.slice(0, 5).map((m, i) => ({ type: 'menu', menuIndex: i, ...m })),
      researchLink,
      noticesLink,
      contactLink
    ];
    moreItems = [
      ...NAV_MENUS.slice(5).map((m, i) => ({ type: 'menu', menuIndex: i + 5, ...m })),
      nssLink,
      galleryLink
    ];
  } else {
    // lg
    mainItems = [
      ...NAV_MENUS.slice(0, 5).map((m, i) => ({ type: 'menu', menuIndex: i, ...m })),
      contactLink
    ];
    moreItems = [
      ...NAV_MENUS.slice(5).map((m, i) => ({ type: 'menu', menuIndex: i + 5, ...m })),
      researchLink,
      nssLink,
      galleryLink,
      noticesLink
    ];
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-poppins">

      {/* ═══════════════════════════════════════
          1. TOP UTILITY BAR
      ═══════════════════════════════════════ */}
      <div
        className="hidden md:flex items-center justify-between px-6 py-1.5 text-[11px]"
        style={{ backgroundColor: primary, color: 'rgba(255,255,255,0.85)' }}
      >
        {/* Left — contact & quick links */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-white/95 font-medium pr-3 border-r border-white/20">
            <span>Affiliation: Magadh University (UGC Approved)</span>
          </div>

          <a
            href={`tel:${settings?.phone || '06312220642'}`}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone size={10} />
            {settings?.phone || '0631-2220642'}
          </a>
          <span className="opacity-20">|</span>
          <a
            href={`mailto:${settings?.email || 'info@gbmcollegegaya.org'}`}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Mail size={10} />
            {settings?.email || 'info@gbmcollegegaya.org'}
          </a>
        </div>

        {/* Right — accessibility, admission badge + login */}
        <div className="flex items-center gap-4">
          
          {/* Text Size Accessibility Controls */}
          <div className="flex items-center gap-1 border-r border-white/20 pr-3">
            <span className="text-[10px] text-white/50 uppercase font-semibold mr-1">Text Size:</span>
            <button 
              onClick={() => setTextSize('normal')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${textSize === 'normal' ? 'bg-white text-slate-955' : 'hover:bg-white/10 text-white'}`}
              title="Normal Text Size"
            >
              A
            </button>
            <button 
              onClick={() => setTextSize('large')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${textSize === 'large' ? 'bg-white text-slate-955' : 'hover:bg-white/10 text-white'}`}
              title="Large Text Size"
            >
              A+
            </button>
            <button 
              onClick={() => setTextSize('xlarge')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${textSize === 'xlarge' ? 'bg-white text-slate-955' : 'hover:bg-white/10 text-white'}`}
              title="Largest Text Size"
            >
              A++
            </button>
          </div>

          {/* High Contrast Accessibility Control */}
          <div className="flex items-center gap-1 border-r border-white/20 pr-3">
            <span className="text-[10px] text-white/50 uppercase font-semibold mr-1">Theme:</span>
            <button 
              onClick={() => setContrastMode('normal')}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${contrastMode === 'normal' ? 'bg-white text-slate-955' : 'hover:bg-white/10 text-white'}`}
            >
              Standard
            </button>
            <button 
              onClick={() => setContrastMode('high')}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${contrastMode === 'high' ? 'bg-white text-slate-955' : 'hover:bg-white/10 text-white'}`}
            >
              Contrast
            </button>
          </div>

          <span
            className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider admission-badge shrink-0"
            style={{ backgroundColor: secondary, color: '#fff' }}
          >
            ★ Admission Open 2026-27
          </span>

          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-semibold border border-white/20 hover:bg-white/15 transition-colors text-white"
            >
              <LogIn size={11} /> Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-semibold border border-white/20 hover:bg-white/15 transition-colors text-white"
            >
              <LogIn size={11} /> Admin Login
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          2. MAIN BRANDING HEADER
      ═══════════════════════════════════════ */}
      <header className="bg-white border-b border-slate-100 py-4 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo + Name */}
          <Link to="/" className="flex items-center gap-4 group min-w-0">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 bg-blue-50 flex items-center justify-center overflow-hidden shrink-0 shadow"
              style={{ borderColor: primary }}
            >
              <img
                src={logoSrc}
                alt={`${settings?.college_name || 'College'} Logo`}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="min-w-0">
              {/* Hindi name — dynamic from DB */}
              <p
                className="text-sm md:text-base font-bold leading-tight font-hindi truncate"
                style={{ color: secondary }}
              >
                {settings?.college_name_hindi || 'गौतम बुद्ध महिला महाविद्यालय, गयाजी'}
              </p>
              {/* English name — dynamic from DB */}
              <h1
                className="text-lg md:text-2xl font-extrabold leading-tight tracking-tight truncate"
                style={{ color: primary }}
              >
                {settings?.college_name || 'Gautam Budha Mahila College, Gaya'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                <MapPin size={11} className="text-slate-400 shrink-0" />
                <span className="truncate">
                  {settings?.college_subtitle || 'S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001'}
                </span>
              </p>
            </div>
          </Link>

          {/* Affiliation Badge — desktop only */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5 border border-blue-100 bg-blue-50/60 px-4 py-2.5 rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-0.5 overflow-hidden shrink-0 shadow-sm">
                <img src={muLogo} alt="Magadh University Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <p className="text-[9px] uppercase font-bold text-blue-700 tracking-wider leading-none">Affiliated To</p>
                <p className="text-xs font-black text-slate-800 mt-0.5 leading-tight">Magadh University</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Bodh Gaya, Bihar</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          3. MAIN NAVIGATION BAR
      ═══════════════════════════════════════ */}
      <nav
        className={`sticky top-0 z-40 transition-shadow duration-300 border-b border-black/10 ${isScrolled ? 'shadow-md' : ''}`}
        style={{ backgroundColor: secondary }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-13 flex items-center justify-between">

          {/* ── Desktop Links ── */}
          <div className="hidden lg:flex items-center gap-x-1 xl:gap-x-1.5 2xl:gap-x-2.5 h-13 shrink-0">
            <Link
              to="/"
              className="px-2 xl:px-2.5 2xl:px-3.5 py-4 text-xs xl:text-[13px] 2xl:text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
            >
              Home
            </Link>

            {mainItems.map((item) => {
              if (item.type === 'link') {
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="px-2 xl:px-2.5 2xl:px-3.5 py-4 text-xs xl:text-[13px] 2xl:text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
                  >
                    {item.label}
                  </Link>
                );
              } else {
                return (
                  <div
                    key={item.title}
                    className="relative h-13 flex items-center shrink-0"
                    onMouseEnter={() => setActiveDropdown(item.menuIndex)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className="flex items-center gap-0.5 px-2 xl:px-2.5 2xl:px-3.5 py-4 text-xs xl:text-[13px] 2xl:text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                    >
                      {item.title}
                      <ChevronDown
                        size={11}
                        className={`text-white/60 transition-transform duration-200 ${activeDropdown === item.menuIndex ? 'rotate-180 text-white' : ''}`}
                      />
                    </button>

                    {activeDropdown === item.menuIndex && (
                      <div className="nav-dropdown absolute top-full left-0 w-64 bg-white border border-slate-200 shadow-xl rounded-b-xl py-1.5 z-50 text-slate-800">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {item.title}
                          </p>
                        </div>
                        {item.links.map((link) => (
                          <Link
                            key={link.label}
                            to={link.path}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors group"
                          >
                            <ChevronRight size={11} className="text-slate-355 group-hover:text-red-650 shrink-0" />
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
            })}

            {moreItems.length > 0 && (
              <div
                className="relative h-13 flex items-center shrink-0"
                onMouseEnter={() => setActiveDropdown('more')}
                onMouseLeave={() => {
                  setActiveDropdown(null);
                  setNestedActiveDropdown(null);
                }}
              >
                <button
                  className="flex items-center gap-0.5 px-2 xl:px-2.5 2xl:px-3.5 py-4 text-xs xl:text-[13px] 2xl:text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  More
                  <ChevronDown
                    size={11}
                    className={`text-white/60 transition-transform duration-200 ${activeDropdown === 'more' ? 'rotate-180 text-white' : ''}`}
                  />
                </button>

                {activeDropdown === 'more' && (
                  <div className="nav-dropdown absolute top-full right-0 w-64 bg-white border border-slate-200 shadow-xl rounded-b-xl py-1.5 z-50 text-slate-800">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        More Sections
                      </p>
                    </div>
                    {moreItems.map((item, idx) => {
                      if (item.type === 'link') {
                        return (
                          <Link
                            key={item.label}
                            to={item.path}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors group"
                          >
                            <ChevronRight size={11} className="text-slate-355 group-hover:text-red-650 shrink-0" />
                            {item.label}
                          </Link>
                        );
                      } else {
                        return (
                          <div
                            key={item.title}
                            className="relative"
                            onMouseEnter={() => setNestedActiveDropdown(idx)}
                            onMouseLeave={() => setNestedActiveDropdown(null)}
                          >
                            <button
                              className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-slate-655 hover:bg-red-50 hover:text-red-700 transition-colors group"
                            >
                              <span className="flex items-center gap-2">
                                <ChevronRight size={11} className="text-slate-355 group-hover:text-red-650 shrink-0" />
                                {item.title}
                              </span>
                              <ChevronRight size={11} className="text-slate-400 group-hover:text-red-700 shrink-0" />
                            </button>

                            {nestedActiveDropdown === idx && (
                              <div className="nav-dropdown absolute top-0 right-full mr-0.5 w-64 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-50 text-slate-800">
                                <div className="px-4 py-2 border-b border-slate-100">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    {item.title}
                                  </p>
                                </div>
                                {item.links.map((link) => (
                                  <Link
                                    key={link.label}
                                    to={link.path}
                                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors group"
                                  >
                                    <ChevronRight size={11} className="text-slate-355 group-hover:text-red-655 shrink-0" />
                                    {link.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Search Box (Desktop) ── */}
          <div className="hidden xl:flex items-center bg-white/10 border border-white/20 rounded-full px-3 py-1.5 gap-2 w-52 shrink-0">
            <Search size={14} className="text-white/60 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search courses..."
              className="bg-transparent border-none outline-none text-xs text-white placeholder-white/50 w-full"
            />
          </div>

          {/* ── Mobile Row ── */}
          <div className="lg:hidden w-full flex items-center justify-between py-2">
            <span className="text-sm font-bold truncate" style={{ color: primary }}>
              {(settings?.college_name || 'Gautam Budha Mahila College').split(',')[0]}
            </span>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors ml-2 shrink-0"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg max-h-[80vh] overflow-y-auto">
            {/* Mobile Search */}
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center bg-slate-100 rounded-full px-3 py-2 gap-2">
                <Search size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="bg-transparent outline-none text-xs flex-1"
                />
              </div>
            </div>

            <Link to="/" className="block px-5 py-3 font-semibold text-sm text-slate-800 border-b border-slate-100">
              Home
            </Link>

            {NAV_MENUS.map((menu) => (
              <div key={menu.title} className="border-b border-slate-100">
                <p className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-blue-700 bg-slate-50">
                  {menu.title}
                </p>
                {menu.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="flex items-center gap-2 px-7 py-2 text-xs text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <ChevronRight size={11} className="text-slate-300 shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}

             <Link to="/research" className="block px-5 py-3 font-semibold text-sm text-slate-800 border-b border-slate-100">Research</Link>
             <Link to="/student-activities" className="block px-5 py-3 font-semibold text-sm text-slate-800 border-b border-slate-100">NSS &amp; Sports</Link>
             <Link to="/gallery" className="block px-5 py-3 font-semibold text-sm text-slate-800 border-b border-slate-100">Gallery</Link>
             <Link to="/notices" className="block px-5 py-3 font-semibold text-sm text-slate-800 border-b border-slate-100">Notices</Link>
             <Link to="/contact" className="block px-5 py-3 font-semibold text-sm text-slate-800 border-b border-slate-100">Contact Us</Link>

            {/* Mobile login */}
            <div className="px-5 py-4 border-t border-slate-100">
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: primary }}
                >
                  <LogIn size={15} /> Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: primary }}
                >
                  <LogIn size={15} /> Admin Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════
          4. ANNOUNCEMENT TICKER  (dynamic from DB)
      ═══════════════════════════════════════ */}
      <div
        className="flex items-center h-10 text-white shrink-0 overflow-hidden"
        style={{ backgroundColor: secondary }}
      >
        {/* Label badge */}
        <div
          className="hidden sm:flex items-center px-4 h-full shrink-0 border-r border-white/20 text-[11px] font-bold uppercase tracking-widest"
          style={{ backgroundColor: `color-mix(in srgb, ${secondary} 80%, black)` }}
        >
          📢 Announcements
        </div>

        {/* Seamless infinite ticker */}
        <div className="ticker-outer flex-1">
          <div className="ticker-track">
            <span className="ticker-content text-xs font-medium">
              {tickerText}
            </span>
            <span className="ticker-content text-xs font-medium" aria-hidden="true">
              {tickerText}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          5. PAGE CONTENT
      ═══════════════════════════════════════ */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ═══════════════════════════════════════
          6. FOOTER
      ═══════════════════════════════════════ */}
      <footer style={{ backgroundColor: primary }} className="text-white pt-12 pb-0">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">

          {/* Col 1: Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                <img src={logoSrc} alt="College Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <div>
                <p className="text-sm font-black leading-tight" style={{ color: accent }}>
                  {(settings?.college_name || 'GBM College').split(',')[0]}
                </p>
                <p className="text-[11px] text-white/50 mt-0.5">Gaya, Bihar</p>
              </div>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              A premier women's institution in Gaya affiliated with Magadh University. Offering UG, PG &amp; PhD programmes with a legacy of academic excellence.
            </p>
            <p className="text-[10px] text-white/35 italic">
              Recognized under 2(f) &amp; 12(B) of UGC Act.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-white/10" style={{ color: accent }}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                ['About the College',   '/about?tab=about'],
                ['Admission Procedure', '/admission?tab=process'],
                ['Academic Calendar',   '/academics?tab=calendar'],
                ['Offered Courses',     '/courses'],
                ['Campus Gallery',      '/gallery'],
                ['Important Notices',   '/notices'],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors group">
                    <ChevronRight size={11} className="text-white/25 group-hover:text-white/60 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Departments */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-white/10" style={{ color: accent }}>
              Departments
            </h4>
            <ul className="space-y-2">
              {[
                ['Arts',                   '/departments?dept=arts'],
                ['Computer Applications',  '/departments?dept=computer'],
                ['Education (BEd)',        '/departments?dept=education'],
                ['Chemistry',              '/departments?dept=chemistry'],
                ['Botany',                 '/departments?dept=botany'],
                ['Zoology',                '/departments?dept=zoology'],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors group">
                    <ChevronRight size={11} className="text-white/25 group-hover:text-white/60 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-white/10" style={{ color: accent }}>
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs text-white/60">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: accent }} />
                <span className="leading-relaxed">
                  {settings?.address || 'S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={13} className="shrink-0" style={{ color: accent }} />
                <a href={`tel:${settings?.phone}`} className="hover:text-white transition-colors">
                  {settings?.phone || '0631-2220642'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={13} className="shrink-0" style={{ color: accent }} />
                <a href={`mailto:${settings?.email}`} className="hover:text-white transition-colors break-all">
                  {settings?.email || 'info@gbmcollegegaya.org'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t border-white/10 py-4 px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-white/40">
            <p>
              © {new Date().getFullYear()} {settings?.college_name || 'Gautam Budha Mahila College, Gaya'}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/login"   className="hover:text-white/70 transition-colors">Student Portal</Link>
              <span className="opacity-30">•</span>
              <Link to="/login"   className="hover:text-white/70 transition-colors">Admin Login</Link>
              <span className="opacity-30">•</span>
              <Link to="/contact" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
