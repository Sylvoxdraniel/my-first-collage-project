import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineAcademicCap, HiArrowLeft } from 'react-icons/hi';
import { HiOutlineUserGroup, HiOutlineBookOpen, HiOutlineOfficeBuilding } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: HiOutlineUserGroup, text: 'Student Records & Management' },
    { icon: HiOutlineAcademicCap, text: 'Faculty Administration' },
    { icon: HiOutlineBookOpen, text: 'Academic Portal & Courses' },
    { icon: HiOutlineOfficeBuilding, text: 'Department Management' },
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
    >
      {/* ── LEFT PANEL (hidden on mobile) ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'rgba(99,102,241,0.12)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'rgba(16,185,129,0.10)',
            filter: 'blur(50px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-between p-12">
          {/* Top: Logo + Title */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                }}
              >
                <HiOutlineAcademicCap style={{ color: '#fff', width: '28px', height: '28px' }} />
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Admin Portal
                </p>
                <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700, lineHeight: 1.2 }}>
                  CollegeMS
                </p>
              </div>
            </div>
          </div>

          {/* Middle: Headline + bullets */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              style={{
                color: '#ffffff',
                fontSize: '36px',
                fontWeight: 800,
                lineHeight: 1.25,
                marginBottom: '12px',
                letterSpacing: '-0.5px',
              }}
            >
              College <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #818cf8, #34d399)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Management
              </span>{' '}
              System
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7, marginBottom: '36px', maxWidth: '340px' }}
            >
              A unified platform to manage students, faculty, courses, and campus operations — all in one place.
            </motion.p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(99,102,241,0.18)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <f.icon style={{ color: '#818cf8', width: '18px', height: '18px' }} />
                  </div>
                  <span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 500 }}>{f.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom: footer note */}
          <p style={{ color: '#475569', fontSize: '12px' }}>
            © {new Date().getFullYear()} CollegeMS · Secure Admin Access
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-12"
        style={{ background: '#f8fafc', minHeight: '100vh' }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HiOutlineAcademicCap style={{ color: '#fff', width: '22px', height: '22px' }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#1e293b' }}>CollegeMS</span>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{
            width: '100%',
            maxWidth: '420px',
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 4px 40px rgba(15,23,42,0.10)',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* Heading */}
          <div style={{ marginBottom: '28px' }}>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.3px',
                marginBottom: '6px',
              }}
            >
              Welcome back
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Sign in to your admin account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <HiOutlineMail
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '18px',
                    height: '18px',
                    color: '#94a3b8',
                  }}
                />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@college.edu"
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                    paddingRight: '14px',
                    paddingTop: '11px',
                    paddingBottom: '11px',
                    borderRadius: '10px',
                    border: '1.5px solid #e2e8f0',
                    fontSize: '14px',
                    color: '#0f172a',
                    background: '#f8fafc',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)';
                    e.target.style.background = '#fff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f8fafc';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <HiOutlineLockClosed
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '18px',
                    height: '18px',
                    color: '#94a3b8',
                  }}
                />
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                    paddingRight: '14px',
                    paddingTop: '11px',
                    paddingBottom: '11px',
                    borderRadius: '10px',
                    border: '1.5px solid #e2e8f0',
                    fontSize: '14px',
                    color: '#0f172a',
                    background: '#f8fafc',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)';
                    e.target.style.background = '#fff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f8fafc';
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: loading
                  ? '#a5b4fc'
                  : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '15px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
                transition: 'box-shadow 0.2s, background 0.2s',
                marginTop: '4px',
              }}
            >
              {loading ? (
                <>
                  <svg
                    style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '24px 0 20px',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>secure admin access</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Back to home */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#6366f1',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#4f46e5')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6366f1')}
          >
            <HiArrowLeft style={{ width: '15px', height: '15px' }} />
            Back to Home
          </Link>
        </motion.div>

        {/* Footer */}
        <p style={{ marginTop: '28px', color: '#94a3b8', fontSize: '12px', textAlign: 'center' }}>
          © {new Date().getFullYear()} College Management System · All rights reserved
        </p>
      </div>

      {/* Spin keyframe for the loading spinner */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
