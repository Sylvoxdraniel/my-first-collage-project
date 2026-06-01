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
  HiOutlineUserAdd,
  HiOutlineKey,
  HiOutlineCreditCard,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome, roles: ['admin', 'faculty', 'student'] },
  
  // Core Management CRUD
  { path: '/students', label: 'Students', icon: HiOutlineUserGroup, roles: ['admin', 'faculty'] },
  { path: '/faculty', label: 'Faculty', icon: HiOutlineAcademicCap, roles: ['admin'] },
  { path: '/courses-manager', label: 'Courses', icon: HiOutlineBookOpen, roles: ['admin', 'faculty'] },
  { path: '/courses', label: 'Courses', icon: HiOutlineBookOpen, roles: ['student'] },
  { path: '/departments', label: 'Departments', icon: HiOutlineOfficeBuilding, roles: ['admin'] },
  { path: '/attendance', label: 'Attendance', icon: HiOutlineClipboardCheck, roles: ['admin', 'faculty'] },
  { path: '/exams', label: 'Exams', icon: HiOutlineDocumentText, roles: ['admin', 'faculty'] },
  { path: '/results', label: 'Results', icon: HiOutlineChartBar, roles: ['admin', 'faculty', 'student'] },
  
  // Public Content Managers
  { path: '/admissions-manager', label: 'Admissions Mgr', icon: HiOutlineFolderOpen, roles: ['admin'] },
  { path: '/notices-manager', label: 'Notices Mgr', icon: HiOutlineSpeakerphone, roles: ['admin'] },
  { path: '/gallery-manager', label: 'Gallery Mgr', icon: HiOutlinePhotograph, roles: ['admin', 'faculty'] },
  { path: '/events-manager', label: 'Events Mgr', icon: HiOutlineCalendar, roles: ['admin'] },
  { path: '/syllabus-manager', label: 'Syllabus Mgr', icon: HiOutlineDocumentText, roles: ['admin'] },
  { path: '/messages-manager', label: 'Public Inquiries', icon: HiOutlineMail, roles: ['admin'] },
  
  // CMS Website Controls
  { path: '/brand-theme', label: 'Brand & Theme', icon: HiOutlineOfficeBuilding, roles: ['admin'] },
  { path: '/slider-manager', label: 'Hero Sliders', icon: HiOutlinePhotograph, roles: ['admin'] },
  { path: '/announcements-manager', label: 'Announcements', icon: HiOutlineSpeakerphone, roles: ['admin'] },
  { path: '/user-management', label: 'User Management', icon: HiOutlineUserAdd, roles: ['admin'] },
  { path: '/page-content-manager', label: 'Page Content', icon: HiOutlineDocumentText, roles: ['admin'] },
  { path: '/otp-settings', label: 'OTP Settings', icon: HiOutlineKey, roles: ['admin'] },
  { path: '/payment-settings', label: 'Payment Settings', icon: HiOutlineCreditCard, roles: ['admin'] },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarVariants = {
    expanded: { width: 260 },
    collapsed: { width: 80 },
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

      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed left-0 top-0 h-screen z-50
          glass-strong
          flex flex-col
          border-r border-dark-700/30
          transition-transform duration-300
          ${collapsed ? '-translate-x-full lg:translate-x-0 items-center' : 'translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-dark-700/30">
          <motion.div
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-lg font-bold gradient-text whitespace-nowrap overflow-hidden"
                >
                  CMS
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
            className={`
              p-1.5 rounded-lg bg-dark-700/50 hover:bg-dark-600
              text-dark-400 hover:text-white transition-colors
              hidden lg:flex items-center justify-center
              ${collapsed ? 'rotate-180' : ''}
            `}
          >
            <HiOutlineChevronLeft className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {allowedNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              className={({ isActive }) => `
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 group
                ${isActive
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-dark-400 hover:text-white hover:bg-dark-700/50'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary-500"
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    />
                  )}
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed state */}
                  {collapsed && hoveredItem === item.path && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-dark-700 text-white text-sm font-medium whitespace-nowrap z-50 shadow-xl"
                    >
                      {item.label}
                    </motion.div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-dark-700/30 p-3">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 min-w-0 overflow-hidden"
                >
                  <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-dark-400 capitalize">{user?.role || 'admin'}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!collapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-dark-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <HiOutlineLogout className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
