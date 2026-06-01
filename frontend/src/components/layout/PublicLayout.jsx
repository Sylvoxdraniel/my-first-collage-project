import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, ChevronDown, Phone, Mail, Award, BookOpen, 
  MapPin, LogIn, Sparkles 
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import logoImg from '../../assets/logo.png';
import muLogo from '../../assets/mu_logo.png';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function PublicLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { settings, announcements: apiAnnouncements } = useSiteSettings();
  const [announcements, setAnnouncements] = useState([
    '✨ Welcome to Gautam Budha Mahila College, Gaya - Admissions Open for Session 2026-27!',
    '📅 Digital Detox - Women\'s Day Notice: Seminar scheduled for next Monday.',
    '🏆 Congratulations to our Gold Medalist students in Magadh University exams!',
    '📚 CIA Examination Results and Academic Calendar 2026 are now available for download.'
  ]);

  // Fetch notices for marquee ticker if API is available
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
        { label: 'Fee Structure', path: '/admission?tab=fees' },
        { label: 'Required Documents', path: '/admission?tab=docs' },
        { label: 'Eligibility Criteria', path: '/admission?tab=eligibility' },
        { label: 'Fee Payment UI', path: '/admission?tab=payment' },
      ]
    },
    {
      title: 'Courses',
      links: [
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
        { label: 'PhD: Botany', path: '/courses?type=phd&id=phd-botany' },
        { label: 'PhD: Chemistry', path: '/courses?type=phd&id=phd-chemistry' },
      ]
    },
    {
      title: 'Departments',
      links: [
        { label: 'Arts Department', path: '/departments?dept=arts' },
        { label: 'Computer Department', path: '/departments?dept=computer' },
        { label: 'Education Department', path: '/departments?dept=education' },
        { label: 'Botany Department', path: '/departments?dept=botany' },
        { label: 'Chemistry Department', path: '/departments?dept=chemistry' },
        { label: 'Mathematics Department', path: '/departments?dept=mathematics' },
        { label: 'Physics Department', path: '/departments?dept=physics' },
        { label: 'Zoology Department', path: '/departments?dept=zoology' },
      ]
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP UTILITY NAVBAR (Navy Blue) */}
      <div className="text-white text-xs py-2 px-6 flex flex-wrap justify-between items-center border-b z-50" style={{ backgroundColor: settings?.primary_color || '#0b1b3d', borderBottomColor: settings?.primary_color ? `${settings.primary_color}dd` : '#1e3a8a' }}>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="hover:text-blue-300 transition-colors font-medium">Home</Link>
          <span className="text-blue-800">|</span>
          <Link to="/research" className="hover:text-blue-300 transition-colors">Research & Innovation</Link>
          <span className="text-blue-800">|</span>
          <Link to="/student-activities" className="hover:text-blue-300 transition-colors">NSS & Sports</Link>
          <span className="text-blue-800">|</span>
          <Link to="/gallery" className="hover:text-blue-300 transition-colors">Photo Gallery</Link>
          <span className="text-blue-800">|</span>
          <Link to="/contact" className="hover:text-blue-300 transition-colors">Contact Us</Link>
        </div>
        <div className="flex items-center gap-4 mt-1 sm:mt-0">
          {/* <div className="flex items-center gap-1.5 font-mono text-[10px] bg-slate-900/40 px-2 py-0.5 rounded border border-slate-700/50">
            <Award size={12} className="text-yellow-400 animate-pulse" />
            <span>NAAC ACCREDITED B</span>
          </div> */}
          <div className="text-red-400 font-bold tracking-wider animate-pulse blink bg-red-950/40 px-2 py-0.5 rounded border border-red-900/50">
            ★ ADMISSION OPEN 2026-27
          </div>
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded transition-colors shadow">
              <LogIn size={12} /> Portal
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="flex items-center gap-1.5 bg-blue-800 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded transition-colors shadow">
              <LogIn size={12} /> Login
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN BRANDING HEADER (White Background) */}
      <div className="bg-white py-4 px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-full border-2 bg-blue-50 flex items-center justify-center p-0 shadow-md overflow-hidden" style={{ borderColor: settings?.primary_color || '#0b1b3d' }}>
              <img src={settings?.logo_path ? (settings.logo_path.startsWith('http') ? settings.logo_path : `/api${settings.logo_path}`) : logoImg} alt="G.B.M. College Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold font-hindi tracking-wide leading-tight" style={{ color: settings?.secondary_color || '#b91c1c' }}>
                {settings?.college_name_hindi || 'गौतम बुद्ध महिला महाविद्यालय, गयाजी'}
              </h1>
              <h2 className="text-xl md:text-2xl font-black tracking-tight leading-tight" style={{ color: settings?.primary_color || '#0b1b3d' }}>
                {settings?.college_name || 'Gautam Budha Mahila College, Gaya'}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1 justify-center md:justify-start">
                <MapPin size={12} className="text-slate-400" /> {settings?.college_subtitle || 'S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001'}
              </p>
            </div>
          </Link>

          {/* NAAC & University Accreditations */}
          <div className="flex items-center gap-4">
            {/* <div className="flex items-center gap-2 border border-orange-200 bg-orange-50/50 p-2 rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-lg border border-orange-600 shadow">
                B
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-orange-800 leading-none">Accredited by</p>
                <p className="text-xs font-black text-slate-800 mt-0.5">IQAC NAAC</p>
              </div>
            </div> */}

            <div className="flex items-center gap-2 border border-blue-200 bg-blue-50/50 p-2 rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded bg-white flex items-center justify-center p-0.5 border border-slate-200 overflow-hidden shadow">
                <img src={muLogo} alt="Magadh University Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-blue-800 leading-none">Affiliated to</p>
                <p className="text-xs font-black text-slate-800 mt-0.5">Magadh University</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION DROPDOWNS BAR */}
      <nav className="border-b sticky top-0 z-40 shadow-sm transition-all duration-300" style={{ borderTop: `2px solid ${settings?.secondary_color || '#cc0000'}`, backgroundColor: settings?.navbar_bg || '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-14">
          {/* Main Desktop Links */}
          <div className="hidden lg:flex items-center gap-1.5 h-full">
            <Link to="/" className="text-slate-700 hover:text-blue-900 font-bold px-3 py-2 text-sm rounded-md transition-colors hover:bg-slate-100/50">
              Home
            </Link>

            {navMenus.map((menu, index) => (
              <div 
                key={menu.title} 
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-slate-700 hover:text-blue-900 font-bold px-3 py-2 text-sm rounded-md transition-colors hover:bg-slate-100/50">
                  {menu.title}
                  <ChevronDown size={14} className="text-slate-400 group-hover:text-blue-900" />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === index && (
                  <div className="absolute top-12 left-0 w-64 bg-white border border-slate-200 shadow-2xl rounded-xl py-2 z-50 overflow-hidden animate-fadeIn">
                    <div className="px-4 py-1.5 bg-blue-50 border-b border-blue-100 mb-1">
                      <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">{menu.title}</p>
                    </div>
                    {menu.links.map((link) => (
                      <Link
                        key={link.label}
                        to={link.path}
                        className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link to="/notices" className="text-slate-700 hover:text-blue-900 font-bold px-3 py-2 text-sm rounded-md transition-colors hover:bg-slate-100/50">
              Notices
            </Link>
            <Link to="/contact" className="text-slate-700 hover:text-blue-900 font-bold px-3 py-2 text-sm rounded-md transition-colors hover:bg-slate-100/50">
              Inquiry
            </Link>
          </div>

          {/* Quick Search */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 w-60">
            <Search size={14} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search courses, syllabus..." 
              className="bg-transparent border-none text-xs focus:outline-none w-full text-slate-700 placeholder-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/courses?search=${e.target.value}`);
                }
              }}
            />
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden w-full flex items-center justify-between">
            <span className="font-black text-sm text-blue-900">Gautam Budha Mahila College, Gaya</span>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdowns */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg px-4 py-3 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 mb-3">
              <Search size={14} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none text-xs focus:outline-none w-full text-slate-700"
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
                <p className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-1">{menu.title}</p>
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

      {/* 4. ANNOUNCEMENTS TICKER BAR (Red / White) */}
      <div className="text-white h-10 flex items-center shadow-inner relative z-30" style={{ backgroundColor: settings?.secondary_color || '#cc0000' }}>
        <div className="px-6 h-full flex items-center font-bold text-xs uppercase tracking-wider relative z-10 border-r shadow-[2px_0_5px_rgba(0,0,0,0.2)]" style={{ backgroundColor: settings?.secondary_color ? `${settings.secondary_color}dd` : '#aa0000', borderRightColor: settings?.secondary_color ? `${settings.secondary_color}22` : '#880000' }}>
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

      {/* 5. MAIN PAGE CONTENT OUTLET */}
      <main className="flex-1 relative">
        <Outlet />
      </main>

      {/* 6. DYNAMIC PUBLIC FOOTER */}
      <footer className="text-white border-t pt-12 pb-6" style={{ backgroundColor: settings?.primary_color || '#0b1b3d', borderTopColor: settings?.primary_color ? `${settings.primary_color}dd` : '#1e3a8a' }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-400">Gautam Budha Mahila College</h3>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Gautam Budha Mahila College, Gaya is committed to providing quality education in Science, Commerce, Arts, Education and Computer Application. Affiliated with Magadh University.
            </p>
            <div className="text-xs text-blue-300">
              <p className="font-bold">Affiliation Status:</p>
              <p className="italic">Recognized under 2(f) & 12(B) of UGC Act.</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-blue-900 pb-2">Quick Links</h4>
            <ul className="space-y-2 text-xs text-blue-200/80">
              <li><Link to="/about?tab=about" className="hover:text-white transition-colors">About the College</Link></li>
              <li><Link to="/admission?tab=process" className="hover:text-white transition-colors">Admission Procedure</Link></li>
              <li><Link to="/academics?tab=calendar" className="hover:text-white transition-colors">Academic Calendar</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Offered Courses</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Campus Photo Gallery</Link></li>
              <li><Link to="/notices" className="hover:text-white transition-colors">Important Notices & Syllabus</Link></li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-blue-900 pb-2">Academic Depts</h4>
            <ul className="space-y-2 text-xs text-blue-200/80">
              <li><Link to="/departments?dept=arts" className="hover:text-white">Department of Arts</Link></li>
              <li><Link to="/departments?dept=computer" className="hover:text-white">Department of Computer Applications</Link></li>
              <li><Link to="/departments?dept=education" className="hover:text-white">Department of Education (BEd)</Link></li>
              <li><Link to="/departments?dept=chemistry" className="hover:text-white">Department of Chemistry</Link></li>
              <li><Link to="/departments?dept=botany" className="hover:text-white">Department of Botany</Link></li>
              <li><Link to="/departments?dept=zoology" className="hover:text-white">Department of Zoology</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b pb-2" style={{ borderBottomColor: settings?.secondary_color || '#1e3a8a' }}>Contact Us</h4>
            <div className="text-xs text-blue-200/80 space-y-3">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="shrink-0" style={{ color: settings?.accent_color || '#facc15' }} />
                <span>{settings?.address || 'S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} style={{ color: settings?.accent_color || '#facc15' }} />
                <span>{settings?.phone || '0631-2220642'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} style={{ color: settings?.accent_color || '#facc15' }} />
                <span>{settings?.email || 'info@gbmcollegegaya.org'}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-300" style={{ borderTopColor: settings?.primary_color ? `${settings.primary_color}dd` : '#1e3a8a' }}>
          <p>© 2026 {settings?.college_name || 'Gautam Budha Mahila College, Gaya'}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-white">Student Portal</Link>
            <span>•</span>
            <Link to="/login" className="hover:text-white">Admin Login</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
