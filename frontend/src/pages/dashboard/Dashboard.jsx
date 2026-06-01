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

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, index) => (
          <StatCard key={card.label} {...card} delay={index * 0.1} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Enrollment by Department</h3>
          {loading ? (
            <div className="h-72 flex items-center justify-center">
              <div className="animate-pulse text-dark-500">Loading chart...</div>
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
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Attendance Overview</h3>
          {loading ? (
            <div className="h-72 flex items-center justify-center">
              <div className="animate-pulse text-dark-500">Loading chart...</div>
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
        </motion.div>
      </div>

      {/* Recent Students */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-dark-700/30">
          <h3 className="text-lg font-semibold text-white">Recent Students</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700/30">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-400">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-400">Enrollment No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-400">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-400">Semester</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/20">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-dark-700 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-dark-700 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-dark-700 rounded w-28" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-dark-700 rounded w-12" /></td>
                  </tr>
                ))
              ) : (
                recentStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    className="hover:bg-dark-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-primary-400 text-xs font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-medium text-white">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-300 font-mono text-xs">{student.enrollment_no}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-400 text-xs font-medium">
                        {student.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dark-300">Sem {student.semester}</td>
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
