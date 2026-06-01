import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineMenu,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineCog,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/students': 'Students',
  '/faculty': 'Faculty',
  '/courses': 'Courses',
  '/departments': 'Departments',
  '/attendance': 'Attendance',
  '/exams': 'Examinations',
  '/results': 'Results',
};

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const pageTitle = pageTitles[location.pathname] || 'Page';

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowDropdown(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass border-b border-dark-700/30">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl bg-dark-700/50 hover:bg-dark-600 text-dark-400 hover:text-white transition-colors"
          >
            <HiOutlineMenu className="w-5 h-5" />
          </motion.button>

          <div>
            <h1 className="text-lg font-semibold text-white">{pageTitle}</h1>
            <p className="text-xs text-dark-500 hidden sm:block">College Management System</p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-800/50 border border-dark-600/30 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-xl bg-dark-700/50 hover:bg-dark-600 text-dark-400 hover:text-white transition-colors"
          >
            <HiOutlineBell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">3</span>
            </span>
          </motion.button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-dark-700/50 hover:bg-dark-600 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-dark-200">{user?.name || 'User'}</span>
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl glass-strong shadow-2xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-dark-700/50">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-dark-400">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-700/50 transition-colors">
                      <HiOutlineUser className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-dark-700/50 transition-colors">
                      <HiOutlineCog className="w-4 h-4" />
                      Settings
                    </button>
                    <hr className="border-dark-700/50 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <HiOutlineLogout className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
