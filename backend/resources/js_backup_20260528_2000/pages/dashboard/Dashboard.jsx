import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import StatCard from '../../components/ui/StatCard';
import dashboardApi from '../../api/dashboardApi';
import toast from 'react-hot-toast';

const defaultStats = {
  total_students: 0,
  total_faculty: 0,
  total_courses: 0,
  total_departments: 0,
};

const defaultEnrollmentData = [
  { name: 'Computer Science', students: 120 },
  { name: 'Electronics', students: 85 },
  { name: 'Mechanical', students: 95 },
  { name: 'Civil', students: 70 },
  { name: 'Electrical', students: 60 },
  { name: 'Information Tech', students: 110 },
];

const defaultAttendanceData = [
  { name: 'Present', value: 75, color: '#10b981' },
  { name: 'Absent', value: 15, color: '#ef4444' },
  { name: 'Late', value: 10, color: '#f59e0b' },
];

const defaultRecentStudents = [
  { id: 1, name: 'Aarav Sharma', enrollment_no: 'CS2024001', department: 'Computer Science', semester: 3 },
  { id: 2, name: 'Priya Patel', enrollment_no: 'EC2024012', department: 'Electronics', semester: 5 },
  { id: 3, name: 'Rohan Kumar', enrollment_no: 'ME2024008', department: 'Mechanical', semester: 1 },
  { id: 4, name: 'Ananya Singh', enrollment_no: 'CS2024015', department: 'Computer Science', semester: 3 },
  { id: 5, name: 'Vikram Reddy', enrollment_no: 'IT2024003', department: 'Information Tech', semester: 7 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl px-4 py-3 shadow-xl">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-sm text-primary-400">
          {payload[0].name}: <span className="font-semibold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

/** Returns two initials from a full name */
function getInitials(name) {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/** Gradient palette for avatars, cycling by index */
const avatarGradients = [
  'linear-gradient(135deg, #6366f1, #818cf8)',
  'linear-gradient(135deg, #10b981, #34d399)',
  'linear-gradient(135deg, #f59e0b, #fbbf24)',
  'linear-gradient(135deg, #ef4444, #f87171)',
  'linear-gradient(135deg, #8b5cf6, #a78bfa)',
];

export default function Dashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [enrollmentData, setEnrollmentData] = useState(defaultEnrollmentData);
  const [attendanceData, setAttendanceData] = useState(defaultAttendanceData);
  const [recentStudents, setRecentStudents] = useState(defaultRecentStudents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardApi.getDashboardStats();
      const data = response.data;

      if (data.stats) {
        setStats({
          total_students: data.stats.students || 0,
          total_faculty: data.stats.faculty || 0,
          total_courses: data.stats.courses || 0,
          total_departments: data.stats.departments || 0,
        });
      }

      if (data.enrollmentByDepartment) {
        setEnrollmentData(data.enrollmentByDepartment.map(item => ({
          name: item.name,
          students: item.value,
        })));
      }

      if (data.attendanceOverview) {
        const colors = {
          'Present': '#10b981',
          'Absent': '#ef4444',
          'Late': '#f59e0b',
        };
        setAttendanceData(data.attendanceOverview.map(item => ({
          name: item.name,
          value: item.value,
          color: colors[item.name] || '#6366f1',
        })));
      }

      if (data.recentStudents) {
        setRecentStudents(data.recentStudents.map(student => ({
          id: student.id,
          name: student.user?.name || 'N/A',
          enrollment_no: student.enrollment_no,
          department: student.department?.name || 'N/A',
          semester: student.semester,
        })));
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      // Fallback silently to defaults
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Students', value: stats.total_students, icon: HiOutlineUserGroup, color: 'primary', trend: 'up', trendValue: '+12%' },
    { label: 'Total Faculty', value: stats.total_faculty, icon: HiOutlineAcademicCap, color: 'accent', trend: 'up', trendValue: '+3%' },
    { label: 'Total Courses', value: stats.total_courses, icon: HiOutlineBookOpen, color: 'blue', trend: 'up', trendValue: '+5%' },
    { label: 'Departments', value: stats.total_departments, icon: HiOutlineOfficeBuilding, color: 'amber', trend: 'up', trendValue: '+2' },
  ];

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">

      {/* ── Welcome / Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          paddingBottom: '4px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span style={{ color: '#475569', fontSize: '12px', fontWeight: 500 }}>CollegeMS</span>
          <span style={{ color: '#334155', fontSize: '12px' }}>›</span>
          <span
            style={{
              color: '#818cf8',
              fontSize: '12px',
              fontWeight: 600,
              background: 'rgba(99,102,241,0.12)',
              padding: '2px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(99,102,241,0.25)',
            }}
          >
            Dashboard
          </span>
        </nav>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#f1f5f9',
                letterSpacing: '-0.3px',
                marginBottom: '3px',
              }}
            >
              {greeting}, Admin 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: '13px' }}>
              Welcome to the Admin Dashboard · Here's your institution at a glance
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '7px 14px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981',
              }}
            />
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, index) => (
          <StatCard key={card.label} {...card} delay={index * 0.1} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass rounded-2xl overflow-hidden"
        >
          {/* Card header with left-border accent */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '18px 24px 14px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '22px',
                borderRadius: '4px',
                background: 'linear-gradient(180deg, #6366f1, #818cf8)',
                flexShrink: 0,
              }}
            />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                Enrollment by Department
              </h3>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
                Student distribution across departments
              </p>
            </div>
          </div>
          <div style={{ padding: '16px 24px 24px' }}>
            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="animate-pulse text-dark-500">Loading chart…</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={enrollmentData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#475569"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorStudents)"
                    name="Students"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Card header with left-border accent */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '18px 24px 14px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '22px',
                borderRadius: '4px',
                background: 'linear-gradient(180deg, #10b981, #34d399)',
                flexShrink: 0,
              }}
            />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                Attendance Overview
              </h3>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
                Today's session summary
              </p>
            </div>
          </div>
          <div style={{ padding: '16px 8px 24px' }}>
            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="animate-pulse text-dark-500">Loading chart…</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-dark-300 text-sm">{value}</span>}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-strong rounded-xl px-4 py-3 shadow-xl">
                            <p className="text-sm text-white">
                              {payload[0].name}: <span className="font-semibold">{payload[0].value}%</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Recent Students ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl overflow-hidden"
      >
        {/* Table header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '4px',
                height: '22px',
                borderRadius: '4px',
                background: 'linear-gradient(180deg, #f59e0b, #fbbf24)',
                flexShrink: 0,
              }}
            />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                Recent Students
              </h3>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
                Latest enrolled students across departments
              </p>
            </div>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#818cf8',
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '20px',
              padding: '3px 12px',
            }}
          >
            {recentStudents.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {['Student', 'Enrollment No', 'Department', 'Semester'].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: '10px 24px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      color: '#64748b',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ divide: 'rgba(255,255,255,0.04)' }}>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="h-9 w-9 bg-dark-700 rounded-xl" />
                        <div className="h-4 bg-dark-700 rounded w-32" />
                      </div>
                    </td>
                    <td style={{ padding: '14px 24px' }}><div className="h-4 bg-dark-700 rounded w-24" /></td>
                    <td style={{ padding: '14px 24px' }}><div className="h-4 bg-dark-700 rounded w-28" /></td>
                    <td style={{ padding: '14px 24px' }}><div className="h-4 bg-dark-700 rounded w-12" /></td>
                  </tr>
                ))
              ) : (
                recentStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Name + avatar */}
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: avatarGradients[index % avatarGradients.length],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: 800,
                            color: '#fff',
                            flexShrink: 0,
                            letterSpacing: '0.5px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                          }}
                        >
                          {getInitials(student.name)}
                        </div>
                        <span style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '14px' }}>
                          {student.name}
                        </span>
                      </div>
                    </td>

                    {/* Enrollment No — monospace badge */}
                    <td style={{ padding: '14px 24px' }}>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#94a3b8',
                          background: 'rgba(148,163,184,0.08)',
                          border: '1px solid rgba(148,163,184,0.15)',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {student.enrollment_no}
                      </span>
                    </td>

                    {/* Department */}
                    <td style={{ padding: '14px 24px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: 'rgba(99,102,241,0.1)',
                          border: '1px solid rgba(99,102,241,0.2)',
                          color: '#a5b4fc',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {student.department}
                      </span>
                    </td>

                    {/* Semester */}
                    <td style={{ padding: '14px 24px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'rgba(245,158,11,0.1)',
                          border: '1px solid rgba(245,158,11,0.2)',
                          color: '#fbbf24',
                          fontSize: '13px',
                          fontWeight: 700,
                        }}
                        title={`Semester ${student.semester}`}
                      >
                        {student.semester}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
