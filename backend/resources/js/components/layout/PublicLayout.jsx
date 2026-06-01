import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Search, ChevronDown, Phone, Mail, Award, BookOpen,
  MapPin, LogIn, Sparkles
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import logoImg from '../../assets/logo.png';
import muLogo from '../../assets/mu_logo.png';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function PublicLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isGalleryPage = location.pathname === '/gallery';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { settings, announcements: apiAnnouncements } = useSiteSettings();
  const [dbCourses, setDbCourses] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [dbDepartments, setDbDepartments] = useState([]);

  useEffect(() => {
    axios.get('/api/public/courses')
      .then(res => setDbCourses(res.data))
      .catch(() => {});
    axios.get('/api/public/fee-structures')
      .then(res => setFeeStructures(res.data))
      .catch(() => {});
    axios.get('/api/public/departments')
      .then(res => setDbDepartments(res.data))
      .catch(() => {});
  }, []);

  const getCourseTab = (course) => {
    if (course.type) {
      return course.type;
    }
    const name = course.name.toLowerCase();
    if (name.includes('phd') || name.includes('ph.d') || name.includes('doctor')) return 'phd';
    if (name.includes('msc') || name.includes('ma') || name.includes('m.sc') || name.includes('master')) return 'pg';
    return 'ug';
  };

  const getCourseLinks = () => {
    let filtered = dbCourses;

    if (!filtered || filtered.length === 0) {
      return [
        { label: 'UG: Bachelor of Arts (BA)', path: '/courses?type=ug&id=ba' },
        { label: 'UG: BSc Mathematics', path: '/courses?type=ug&id=bsc-math' },
        { label: 'UG: BSc Biology', path: '/courses?type=ug&id=bsc-bio' },
        { label: 'UG: BCA', path: '/courses?type=ug&id=bca' },
        { label: 'UG: BA BEd Integrated', path: '/courses?type=ug&id=ba-bed' },
        { label: 'UG: BSc BEd Integrated', path: '/courses?type=ug&id=bsc-bed' },
        { label: 'PG: MSc Botany', path: '/courses?type=pg&id=msc-botany' },
        { label: 'PG: MSc Chemistry', path: '/courses?type=pg&id=msc-chemistry' },
        { label: 'PG: MSc Mathematics', path: '/courses?type=pg&id=msc-math' },
        { label: 'PG: MSc Physics', path: '/courses?type=pg&id=msc-physics' },
        { label: 'PG: MSc Zoology', path: '/courses?type=pg&id=msc-zoology' },
        { label: 'PhD: Chemistry', path: '/courses?type=phd&id=phd-chemistry' },
      ];
    }

    return filtered.map(c => {
      const tab = getCourseTab(c);
      const prefix = tab === 'phd' ? 'PhD' : tab === 'pg' ? 'PG' : 'UG';
      return {
        label: `${prefix}: ${c.name}`,
        path: `/courses?type=${tab}&id=${c.id}`
      };
    });
  };

  const getDepartmentLinks = () => {
    if (!dbDepartments || dbDepartments.length === 0) {
      return [
        { label: 'Arts Department', path: '/departments?dept=arts' },
        { label: 'Computer Department', path: '/departments?dept=computer' },
        { label: 'Education Department', path: '/departments?dept=education' },
        { label: 'Botany Department', path: '/departments?dept=botany' },
        { label: 'Chemistry Department', path: '/departments?dept=chemistry' },
        { label: 'Mathematics Department', path: '/departments?dept=mathematics' },
        { label: 'Physics Department', path: '/departments?dept=physics' },
        { label: 'Zoology Department', path: '/departments?dept=zoology' },
      ];
    }

    return dbDepartments.map(d => ({
      label: d.name,
      path: `/departments?dept=${d.id}`
    }));
  };

  const [announcements, setAnnouncements] = useState([
    '✨ Welcome to Gautam Budha Mahila College, Gaya - Admissions Open for Session 2026-27!',
    '📅 Digital Detox - Women\'s Day Notice: Seminar scheduled for next Monday.',
    '🏆 Congratulations to our Gold Medalist students in Magadh University exams!',
    '📚 CIA Examination Results and Academic Calendar 2026 are now available for download.'
  ]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (apiAnnouncements && apiAnnouncements.length > 0) {
      setAnnouncements(apiAnnouncements.map(a => a.text));
    } else {
      axios.get('/api/public/notices?is_important=1')
        .then(res => {
          if (res.data && res.data.length > 0) {
            const titles = res.data.map(n => `📢 ${n.title}`);
            setAnnouncements(titles);
          }
        })
        .catch(() => {});
    }
  }, [apiAnnouncements]);

  const navMenus = [
    {
      title: 'About Us',
      links: [
        { label: 'About College', path: '/about?tab=about' },
        { label: 'VC\'s Message', path: '/about?tab=chairman' },
        { label: 'Principal\'s Message', path: '/about?tab=director' },
        { label: 'Patron\'s Message', path: '/about?tab=principal' },
        { label: 'Vision & Mission', path: '/about?tab=vision' },
        { label: 'SWOC Analysis', path: '/about?tab=swoc' },
        { label: 'Institutional Distinctiveness', path: '/about?tab=distinctiveness' },
        { label: 'E-Governance', path: '/about?tab=egovernance' },
        { label: 'Organogram', path: '/about?tab=organogram' },
        { label: 'Administrative Setup', path: '/about?tab=administrative' },
        { label: 'Perspective Plan', path: '/about?tab=perspective' },
      ]
    },
    {
      title: 'Academics',
      links: [
        { label: 'Academic Calendar', path: '/academics?tab=calendar' },
        { label: 'Time Table', path: '/academics?tab=timetable' },
        { label: 'Academic Activities', path: '/academics?tab=activities' },
        { label: 'CO PO & PSO', path: '/academics?tab=copo' },
        { label: 'CIA Exam Results', path: '/academics?tab=cia' },
        { label: 'Syllabus Download', path: '/academics?tab=syllabus' },
        { label: 'Academic Achievements', path: '/academics?tab=achievements' },
        { label: 'MoUs & Collaborations', path: '/academics?tab=mous' },
      ]
    },
    {
      title: 'Admission',
      links: [
        { label: 'Admission Process', path: '/admission?tab=process' },
        { label: 'Apply Online Form', path: '/admission?tab=apply' },
        { label: 'Fee Payment UI', path: '/admission?tab=payment' },
        { label: 'Required Documents', path: '/admission?tab=docs' },
        { label: 'Fee Structure', path: '/admission?tab=fees' },
        { label: 'Eligibility Criteria', path: '/admission?tab=eligibility' },
      ]
    },
    {
      title: 'Courses',
      links: getCourseLinks()
    },
    {
      title: 'Departments',
      links: getDepartmentLinks()
    },
    {
      title: 'Infrastructure',
      links: [
        { label: 'Classrooms', path: '/infrastructure?item=classrooms' },
        { label: 'College Library', path: '/infrastructure?item=library' },
        { label: 'Laboratories', path: '/infrastructure?item=labs' },
        { label: 'Computer Labs', path: '/infrastructure?item=complabs' },
        { label: 'Seminar Hall', path: '/infrastructure?item=seminar' },
        { label: 'RO Water Plant', path: '/infrastructure?item=water' },
        { label: 'Sports Complex', path: '/infrastructure?item=sports' },
      ]
    }
  ];

  const primaryColor = settings?.primary_color || '#0b1b3d';
  const secondaryColor = settings?.secondary_color || '#cc0000';
  const accentColor = settings?.accent_color || '#facc15';
  const collegeName = settings?.college_name || 'Gautam Budha Mahila College, Gaya';
  const collegeNameHindi = settings?.college_name_hindi || 'गौतम बुद्ध महिला महाविद्यालय, गयाजी';
  const collegeSubtitle = settings?.college_subtitle || 'S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001';
  const phoneNumber = settings?.phone || '0631-2220642';
  const emailAddress = settings?.email || 'info@gbmcollegegaya.org';
  const address = settings?.address || 'S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001';
  const getBackendUrl = () => {
    if (window.location.port === '5173') {
      return `${window.location.protocol}//${window.location.hostname}:8000`;
    }
    return window.location.origin;
  };

  const backendUrl = getBackendUrl();

  const logoSrc = settings?.logo_path
    ? (settings.logo_path.startsWith('http') ? settings.logo_path : `${backendUrl}/api${settings.logo_path}`)
    : `${backendUrl}/logo.png`;
  const affiliationName = settings?.affiliation_name || 'Magadh University';
  const affiliationLogo = settings?.affiliation_logo_path
    ? (settings.affiliation_logo_path.startsWith('http') ? settings.affiliation_logo_path : `${backendUrl}/api${settings.affiliation_logo_path}`)
    : `${backendUrl}/mu_logo.png`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">

      {/* ===== 1. TOP UTILITY BAR ===== */}
      {!isGalleryPage && (
        <div
          className="text-white py-1.5 px-4 md:px-6 z-50 border-b border-white/10"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
            <div className="flex items-center gap-4 text-[11px]">
              <a href={`tel:${phoneNumber}`} className="flex items-center gap-1 hover:text-blue-300 transition-colors">
                <Phone size={11} className="opacity-70" />
                <span>{phoneNumber}</span>
              </a>
              <a href={`mailto:${emailAddress}`} className="flex items-center gap-1 hover:text-blue-300 transition-colors">
                <Mail size={11} className="opacity-70" />
                <span>{emailAddress}</span>
              </a>
              <span className="hidden md:flex items-center gap-1 text-white/70">
                <MapPin size={11} className="opacity-70" />
                <span>{address}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <div className="hidden sm:flex items-center gap-2">
                <a href="#" aria-label="Facebook" className="hover:text-blue-300 transition-colors opacity-80 hover:opacity-100">
                  <FaFacebook size={13} />
                </a>
                <a href="#" aria-label="Twitter" className="hover:text-blue-300 transition-colors opacity-80 hover:opacity-100">
                  <FaTwitter size={13} />
                </a>
                <a href="#" aria-label="Youtube" className="hover:text-red-400 transition-colors opacity-80 hover:opacity-100">
                  <FaYoutube size={13} />
                </a>
                <a href="#" aria-label="Instagram" className="hover:text-pink-400 transition-colors opacity-80 hover:opacity-100">
                  <FaInstagram size={13} />
                </a>
                <span className="w-px h-3 bg-white/20 mx-1" />
              </div>
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-semibold px-3 py-1 rounded-full transition-colors text-[11px]"
                >
                  <LogIn size={11} />
                  Portal
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-semibold px-3 py-1 rounded-full transition-colors text-[11px]"
                >
                  <LogIn size={11} />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== 2. MAIN BRANDING HEADER ===== */}
      <div className="bg-white py-4 px-4 md:px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {isGalleryPage ? (
            <div className="text-left space-y-1 max-w-lg w-full md:w-auto">
              <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-900 font-bold text-[8px] sm:text-[9px] uppercase tracking-wider rounded">
                Media Gallery
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-900 tracking-tight leading-none mt-1">
                Campus Media Gallery
              </h1>
              <p className="text-slate-500 text-[10px] sm:text-[11px] leading-normal mt-1 max-w-md hidden md:block">
                Explore snapshots of academic functions, college infrastructures, sports achievements, and cultural programs.
              </p>
            </div>
          ) : (
            <Link 
              to="/" 
              className="flex items-center gap-4 sm:gap-5 md:gap-6 text-left"
            >
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 bg-blue-50 flex items-center justify-center p-0 shadow-md overflow-hidden shrink-0"
                style={{ borderColor: primaryColor }}
              >
                <img
                  src={logoSrc}
                  alt="College Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1
                  className="text-lg md:text-xl font-bold font-hindi tracking-wide leading-tight mb-0.5"
                  style={{ color: secondaryColor }}
                >
                  {collegeNameHindi}
                </h1>
                <h2
                  className="text-2xl md:text-3xl font-black tracking-tight leading-tight"
                  style={{ color: primaryColor }}
                >
                  {collegeName}
                </h2>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-1 flex items-center gap-1 justify-start">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  {collegeSubtitle}
                </p>
              </div>
            </Link>
          )}

          {isGalleryPage ? (
            <Link 
              to="/" 
              className="flex items-center gap-2.5 sm:gap-3.5 text-left shrink-0"
            >
              <div
                className="w-11 h-11 md:w-13 md:h-13 rounded-full border bg-blue-50 flex items-center justify-center p-0 shadow-sm overflow-hidden shrink-0"
                style={{ borderColor: primaryColor }}
              >
                <img
                  src={logoSrc}
                  alt="College Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1
                  className="text-[10px] md:text-xs font-bold font-hindi tracking-wide leading-tight mb-0.5"
                  style={{ color: secondaryColor }}
                >
                  {collegeNameHindi}
                </h1>
                <h2
                  className="text-xs md:text-sm font-extrabold tracking-tight leading-tight"
                  style={{ color: primaryColor }}
                >
                  {collegeName}
                </h2>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1 justify-start">
                  <MapPin size={10} className="text-slate-400 shrink-0" />
                  {collegeSubtitle}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-orange-200 bg-orange-50/50 p-2.5 rounded-lg shadow-sm">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-lg border border-orange-600 shadow">
                  B
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-orange-800 leading-none">Accredited by</p>
                  <p className="text-xs font-black text-slate-800 mt-0.5">IQAC NAAC</p>
                </div>
              </div>

              <div className="flex items-center gap-2 border border-blue-200 bg-blue-50/50 p-2.5 rounded-lg shadow-sm">
                <div className="w-10 h-10 rounded bg-white flex items-center justify-center p-0.5 border border-slate-200 overflow-hidden shadow">
                  <img src={affiliationLogo} alt="Affiliation Logo" className="w-full h-full object-contain" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-blue-800 leading-none">Affiliated to</p>
                  <p className="text-xs font-black text-slate-800 mt-0.5">{affiliationName}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== 3. NAVIGATION BAR ===== */}
      {!isGalleryPage && (
        <nav
          className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}
          style={{
            borderTop: `2px solid ${secondaryColor}`,
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
          }}
        >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-12">
          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center lg:gap-1 xl:gap-3 h-full">
            <Link
              to="/"
              className="text-white hover:bg-white/10 font-semibold lg:px-2 xl:px-3 py-1.5 text-[11px] xl:text-[13px] rounded transition-colors uppercase tracking-wide nav-link-custom"
            >
              Home
            </Link>

            {navMenus.map((menu, index) => (
              <div
                key={menu.title}
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-0.5 text-white hover:bg-white/10 font-semibold lg:px-2 xl:px-3 py-1.5 text-[11px] xl:text-[13px] rounded transition-colors uppercase tracking-wide nav-link-custom">
                  {menu.title}
                  <ChevronDown size={13} className="text-white/60" />
                </button>

                {activeDropdown === index && (
                  <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 shadow-xl rounded-lg py-0 z-50 overflow-hidden nav-dropdown">
                    <div
                      className="px-4 py-2 border-b border-blue-100"
                      style={{ backgroundColor: `${primaryColor}12` }}
                    >
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                        {menu.title}
                      </p>
                    </div>
                    {menu.links.map((link) => (
                      <Link
                        key={link.label}
                        to={link.path}
                        className="block px-4 py-2 text-xs font-medium text-slate-700 hover:text-white transition-colors"
                        style={{}}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = primaryColor;
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#334155';
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              to="/notices"
              className="text-white hover:bg-white/10 font-semibold lg:px-2 xl:px-3 py-1.5 text-[11px] xl:text-[13px] rounded transition-colors uppercase tracking-wide nav-link-custom"
            >
              Notices
            </Link>
            <Link
              to="/contact"
              className="text-white hover:bg-white/10 font-semibold lg:px-2 xl:px-3 py-1.5 text-[11px] xl:text-[13px] rounded transition-colors uppercase tracking-wide nav-link-custom"
            >
              Inquiry
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden xl:flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1.5 w-56">
            <Search size={14} className="text-white/60" />
            <input
              type="text"
              placeholder="Search courses, syllabus..."
              className="bg-transparent border-none text-xs focus:outline-none w-full text-white placeholder-white/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/courses?search=${e.target.value}`);
                }
              }}
            />
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden w-full flex items-center justify-between">
            <span className="font-black text-sm text-white truncate mr-2">
              {collegeName}
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-white hover:bg-white/10 border border-white/20 focus:outline-none shrink-0"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ===== 4. MOBILE MENU ===== */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg px-4 py-3 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 mb-3">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, syllabus..."
                className="bg-transparent border-none text-xs focus:outline-none w-full text-slate-700 placeholder-slate-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsMobileMenuOpen(false);
                    navigate(`/courses?search=${e.target.value}`);
                  }
                }}
              />
            </div>

            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 font-bold text-sm text-slate-800 border-b border-slate-100"
            >
              Home
            </Link>

            {navMenus.map((menu) => (
              <div key={menu.title} className="py-2 border-b border-slate-100">
                <p className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-1">
                  {menu.title}
                </p>
                <div className="pl-3 grid grid-cols-1 gap-1">
                  {menu.links.map((link) => (
                    <Link
                      key={link.label}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-1 text-xs text-slate-700 hover:text-blue-900 font-medium block"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <Link
              to="/notices"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 font-bold text-sm text-slate-800 border-b border-slate-100"
            >
              Notices
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 font-bold text-sm text-slate-800"
            >
              Contact Us
            </Link>
          </div>
        )}
      </nav>
      )}

      {/* ===== 5. ANNOUNCEMENTS TICKER ===== */}
      {!isGalleryPage && (
        <div
          className="text-white h-10 flex items-center shadow-inner relative z-30"
          style={{ backgroundColor: secondaryColor }}
        >
          <div
            className="px-5 h-full flex items-center font-bold text-[11px] uppercase tracking-wider relative z-10 border-r shrink-0"
            style={{
              backgroundColor: `${secondaryColor}dd`,
              borderRightColor: `${secondaryColor}22`
            }}
          >
            <Sparkles size={12} className="mr-1.5 opacity-80" />
            Announcements
          </div>
          <div className="flex-1 marquee-container text-xs font-semibold overflow-hidden">
            <div className="marquee-text space-x-12">
              {announcements.map((note, idx) => (
                <span key={idx} className="hover:text-yellow-300 cursor-pointer inline-block">
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== 6. MAIN CONTENT ===== */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ===== 7. FOOTER ===== */}
      <footer
        className="text-white border-t pt-12 pb-6"
        style={{ backgroundColor: primaryColor, borderTopColor: `${primaryColor}dd` }}
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 — About */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-400">{collegeName}</h3>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              {collegeName} is committed to providing quality education in Science, Commerce, Arts, Education and Computer Application.
              We nurture young minds with holistic learning and a focus on women empowerment.
            </p>
            <div className="text-xs text-blue-300">
              <p className="font-bold">Affiliation Status:</p>
              <p className="italic">Affiliated to Magadh University. Recognized under 2(f) &amp; 12(B) of UGC Act.</p>
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4
              className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b"
              style={{ borderBottomColor: `${primaryColor}aa` }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-blue-200/80">
              <li>
                <Link to="/about?tab=about" className="hover:text-white transition-colors">About the College</Link>
              </li>
              <li>
                <Link to="/admission?tab=process" className="hover:text-white transition-colors">Admission Procedure</Link>
              </li>
              <li>
                <Link to="/academics?tab=calendar" className="hover:text-white transition-colors">Academic Calendar</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">Offered Courses</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors">Campus Photo Gallery</Link>
              </li>
              <li>
                <Link to="/notices" className="hover:text-white transition-colors">Important Notices &amp; Syllabus</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact &amp; Inquiry</Link>
              </li>
            </ul>
          </div>

          {/* Col 3 — Departments */}
          <div>
            <h4
              className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b"
              style={{ borderBottomColor: `${primaryColor}aa` }}
            >
              Academic Departments
            </h4>
            <ul className="space-y-2 text-xs text-blue-200/80">
              {getDepartmentLinks().map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact Us */}
          <div className="space-y-4">
            <h4
              className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b"
              style={{ borderBottomColor: `${primaryColor}aa` }}
            >
              Contact Us
            </h4>
            <div className="text-xs text-blue-200/80 space-y-3">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: accentColor }} />
                <span>{address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" style={{ color: accentColor }} />
                <span>{phoneNumber}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="shrink-0" style={{ color: accentColor }} />
                <span>{emailAddress}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Facebook" className="text-blue-300 hover:text-white transition-colors">
                <FaFacebook size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="text-blue-300 hover:text-white transition-colors">
                <FaTwitter size={16} />
              </a>
              <a href="#" aria-label="Youtube" className="text-blue-300 hover:text-white transition-colors">
                <FaYoutube size={16} />
              </a>
              <a href="#" aria-label="Instagram" className="text-blue-300 hover:text-white transition-colors">
                <FaInstagram size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div
          className="max-w-7xl mx-auto px-6 border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-300"
          style={{ borderTopColor: `${primaryColor}dd` }}
        >
          <p>&copy; {new Date().getFullYear()} {collegeName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-white transition-colors">Student Portal</Link>
            <span className="text-blue-600">•</span>
            <Link to="/login" className="hover:text-white transition-colors">Admin Login</Link>
            <span className="text-blue-600">•</span>
            <Link to="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
