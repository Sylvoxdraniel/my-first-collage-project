import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineDeviceMobile, HiOutlineKey, HiOutlineArrowLeft, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const [requestForm, setRequestForm] = useState({
    login_id: '',
    method: 'email' // 'email' or 'sms'
  });

  const [verifyForm, setVerifyForm] = useState({
    otp: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRequestChange = (e) => {
    setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
  };

  const handleVerifyChange = (e) => {
    setVerifyForm({ ...verifyForm, [e.target.name]: e.target.value });
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!requestForm.login_id) {
      toast.error('Please enter your email address or mobile number');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/public/forgot-password/request', requestForm);
      toast.success(response.data.message || 'OTP sent successfully!');
      setOtpSent(true);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send OTP. Please check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReset = async (e) => {
    e.preventDefault();
    if (!verifyForm.otp || !verifyForm.password || !verifyForm.confirm_password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (verifyForm.password !== verifyForm.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    if (verifyForm.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/public/forgot-password/verify', {
        login_id: requestForm.login_id,
        otp: verifyForm.otp,
        password: verifyForm.password
      });
      toast.success(response.data.message || 'Password reset successfully!');
      navigate('/login');
    } catch (error) {
      const msg = error.response?.data?.message || 'Verification failed. Please check the OTP.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-950">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -70, 0], y: [0, 100, 0], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl"
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0MCBNIDAgMzAgTCA0MCAzMCBNIDMwIDAgTCAzMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

      {/* Reset Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-xl font-bold text-white">C</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {otpSent ? 'Reset Your Password' : 'Forgot Password?'}
            </h1>
            <p className="text-dark-400 text-sm">
              {otpSent 
                ? 'Enter the 6-digit OTP and choose a new password' 
                : 'Enter your registered email or phone to receive a reset OTP'
              }
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-dark-300">Email or Mobile Number</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="text"
                    name="login_id"
                    value={requestForm.login_id}
                    onChange={handleRequestChange}
                    placeholder="email@example.com or 9876543210"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-800/50 border border-dark-600/50 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-dark-300">Select OTP Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                    requestForm.method === 'email'
                      ? 'bg-primary-500/10 border-primary-500 text-primary-400'
                      : 'bg-dark-800/30 border-dark-600/50 text-dark-400 hover:bg-dark-800/50'
                  }`}>
                    <input
                      type="radio"
                      name="method"
                      value="email"
                      checked={requestForm.method === 'email'}
                      onChange={handleRequestChange}
                      className="hidden"
                    />
                    <HiOutlineMail size={18} />
                    <span>Email OTP</span>
                  </label>

                  <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                    requestForm.method === 'sms'
                      ? 'bg-primary-500/10 border-primary-500 text-primary-400'
                      : 'bg-dark-800/30 border-dark-600/50 text-dark-400 hover:bg-dark-800/50'
                  }`}>
                    <input
                      type="radio"
                      name="method"
                      value="sms"
                      checked={requestForm.method === 'sms'}
                      onChange={handleRequestChange}
                      className="hidden"
                    />
                    <HiOutlineDeviceMobile size={18} />
                    <span>SMS OTP</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Sending OTP...' : 'Send Verification OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyReset} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-dark-300">Enter 6-Digit OTP</label>
                <div className="relative">
                  <HiOutlineKey className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="text"
                    name="otp"
                    value={verifyForm.otp}
                    onChange={handleVerifyChange}
                    maxLength="6"
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-800/50 border border-dark-600/50 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm tracking-widest text-center font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-dark-300">New Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={verifyForm.password}
                    onChange={handleVerifyChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-dark-800/50 border border-dark-600/50 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff className="w-5 h-5" />
                    ) : (
                      <HiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-dark-300">Confirm New Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={verifyForm.confirm_password}
                    onChange={handleVerifyChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-dark-800/50 border border-dark-600/50 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <HiOutlineEyeOff className="w-5 h-5" />
                    ) : (
                      <HiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full py-2.5 rounded-xl border border-dark-700 text-dark-300 hover:text-white font-semibold text-sm hover:bg-dark-800 transition-all"
              >
                Change Email / Mobile
              </button>
            </form>
          )}

          <div className="mt-6 flex justify-center">
            <Link to="/login" className="flex items-center gap-1.5 text-sm text-dark-400 hover:text-white transition-colors">
              <HiOutlineArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
