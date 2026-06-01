import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineOfficeBuilding,
  HiOutlineClipboardCheck,
  HiOutlineDocumentText,
  HiOutlineChevronLeft,
  HiOutlineLogout,
  HiOutlineChartBar,
  HiOutlineSpeakerphone,
  HiOutlinePhotograph,
  HiOutlineCalendar,
  HiOutlineMail,
  HiOutlineFolderOpen,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome, roles: ['admin', 'faculty', 'student'] },
  
  // Core Management CRUD
  { path: '/students', label: 'Students', icon: HiOutlineUserGroup, roles: ['admin', 'faculty'] },
  { path: '/faculty', label: 'Faculty', icon: HiOutlineAcademicCap, roles: ['admin'] },
  { path: '/courses', label: 'Courses', icon: HiOutlineBookOpen, roles: ['admin', 'faculty', 'student'] },
  { path: '/departments', label: 'Departments', icon: HiOutlineOfficeBuilding, roles: ['admin'] },
  { path: '/attendance', label: 'Attendance', icon: HiOutlineClipboardCheck, roles: ['admin', 'faculty'] },
  { path: '/exams', label: 'Exams', icon: HiOutlineDocumentText, roles: ['admin', 'faculty'] },
  { path: '/results', label: 'Results', icon: HiOutlineChartBar, roles: ['admin', 'faculty', 'student'] },
  
  // Public Content Managers
  { path: '/admissions-manager', label: 'Admissions Mgr', icon: HiOutlineFolderOpen, roles: ['admin'] },
  { path: '/notices-manager', label: 'Notices Mgr', icon: HiOutlineSpeakerphone, roles: ['admin'] },
  { path: '/gallery-manager', label: 'Gallery Mgr', icon: HiOutlinePhotograph, roles: ['admin'] },
  { path: '/events-manager', label: 'Events Mgr', icon: HiOutlineCalendar, roles: ['admin'] },
  { path: '/syllabus-manager', label: 'Syllabus Mgr', icon: HiOutlineDocumentText, roles: ['admin'] },
  { path: '/messages-manager', label: 'Public Inquiries', icon: HiOutlineMail, roles: ['admin'] },
  
  // CMS Website Controls
  { path: '/settings-editor', label: 'Branding & Theme', icon: HiOutlineOfficeBuilding, roles: ['admin'] },
  { path: '/slider-manager', label: 'Hero Sliders', icon: HiOutlinePhotograph, roles: ['admin'] },
  { path: '/announcements-manager', label: 'Announcements', icon: HiOutlineSpeakerphone, roles: ['admin'] },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Determine user role and filter items
  const userRole = user?.role || 'student';
  const allowedNavItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 h-screen
          glass-strong
          flex flex-col
          transition-all duration-300 ease-in-out
          
          /* Mobile slide in/out */
          -translate-x-full lg:translate-x-0
          ${collapsed ? '' : 'translate-x-0'}
          
          /* Desktop width toggle */
          ${collapsed ? 'lg:w-20' : 'lg:w-[260px]'}
          w-[260px]
          
          border-r border-dark-700/30
        `}
      >
        {/* Toggle Button (Floating Circular Button on Right Border) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 -right-3 w-6 h-6 rounded-full bg-dark-800 border border-dark-700/50 flex items-center justify-center text-dark-400 hover:text-white hover:bg-dark-700 shadow-md z-50 transition-all duration-200 hidden lg:flex"
        >
          <HiOutlineChevronLeft className={`w-3.5 h-3.5 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* Logo Section */}
        <div className={`
          flex items-center h-16 border-b border-dark-700/30 transition-all duration-300
          ${collapsed ? 'lg:justify-center lg:px-0 justify-between px-4' : 'pl-6 pr-4'}
        `}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            {!collapsed && (
              <span className="text-lg font-bold gradient-text whitespace-nowrap">
                CMS
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`
          flex-1 py-4 space-y-1.5 overflow-y-auto transition-all duration-300
          ${collapsed ? 'lg:px-2 px-4' : 'px-4'}
        `}>
          {allowedNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              className={({ isActive }) => `
                relative flex items-center rounded-xl
                transition-all duration-200 group
                w-full
                ${collapsed 
                  ? 'lg:justify-center lg:px-0 py-2.5 px-4 justify-start gap-4' 
                  : 'gap-4 px-4 py-2.5'
                }
                ${isActive
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-dark-400 hover:text-white hover:bg-dark-700/50'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && !collapsed && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary-500"
                    />
                  )}
                  
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
                  
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {collapsed && hoveredItem === item.path && (
                    <div
                      className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-dark-700 text-white text-sm font-medium whitespace-nowrap z-50 shadow-xl hidden lg:block"
                    >
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className={`
          border-t border-dark-700/30 py-4 transition-all duration-300
          ${collapsed ? 'lg:px-2 lg:justify-center' : 'px-4'}
          flex items-center
        `}>
          <div className={`flex items-center w-full gap-3 ${collapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-dark-400 capitalize">{user?.role || 'admin'}</p>
              </div>
            )}
            
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-dark-400 hover:text-red-400 transition-colors shrink-0"
                title="Logout"
              >
                <HiOutlineLogout className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
