import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import useAuth from './hooks/useAuth';

// CMS Pages
import BrandTheme from './pages/dashboard/cms/BrandTheme';
import SliderManager from './pages/dashboard/cms/SliderManager';
import AnnouncementsManager from './pages/dashboard/cms/AnnouncementsManager';

// Layouts
import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
// Register page removed — admin creates all accounts
import Home from './pages/Home';

// Public Pages
import About from './pages/About';
import Academics from './pages/Academics';
import Admission from './pages/Admission';
import Courses from './pages/Courses';
import Departments from './pages/Departments';
import Infrastructure from './pages/Infrastructure';
import Gallery from './pages/Gallery';
import Notices from './pages/Notices';
import Research from './pages/Research';
import StudentActivities from './pages/StudentActivities';
import Contact from './pages/Contact';

// Portal Main Pages
import Dashboard from './pages/dashboard/Dashboard';
import StudentList from './pages/students/StudentList';
import FacultyList from './pages/faculty/FacultyList';
import CourseList from './pages/courses/CourseList';
import DepartmentList from './pages/departments/DepartmentList';
import Attendance from './pages/attendance/Attendance';
import ExamList from './pages/exams/ExamList';
import Results from './pages/exams/Results';

// Admin Content Managers
import AdmissionsManager from './pages/dashboard/AdmissionsManager';
import NoticesManager from './pages/dashboard/NoticesManager';
import GalleryManager from './pages/dashboard/GalleryManager';
import EventsManager from './pages/dashboard/EventsManager';
import SyllabusManager from './pages/dashboard/SyllabusManager';
import ContactMessagesManager from './pages/dashboard/ContactMessagesManager';
import UserManagement from './pages/dashboard/UserManagement';
import PageContentManager from './pages/dashboard/PageContentManager';
import OtpSettings from './pages/dashboard/OtpSettings';
import PaymentSettings from './pages/dashboard/PaymentSettings';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SiteSettingsProvider>
          <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
            <Routes>
            {/* Public Landing Pages Group */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/admission" element={<Admission />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/infrastructure" element={<Infrastructure />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/research" element={<Research />} />
              <Route path="/student-activities" element={<StudentActivities />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Navigate to="/login" replace />} />

            {/* Protected Management Portal Group */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              
              <Route path="/students" element={
                <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                  <StudentList />
                </ProtectedRoute>
              } />
              
              <Route path="/faculty" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <FacultyList />
                </ProtectedRoute>
              } />
              
              <Route path="/courses-manager" element={
                <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                  <CourseList />
                </ProtectedRoute>
              } />
              
              <Route path="/departments" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DepartmentList />
                </ProtectedRoute>
              } />
              
              <Route path="/attendance" element={
                <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                  <Attendance />
                </ProtectedRoute>
              } />
              
              <Route path="/exams" element={
                <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                  <ExamList />
                </ProtectedRoute>
              } />
              
              <Route path="/results" element={<Results />} />

              {/* Admin Public Website Editors */}
              <Route path="/admissions-manager" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdmissionsManager />
                </ProtectedRoute>
              } />
              
              <Route path="/notices-manager" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <NoticesManager />
                </ProtectedRoute>
              } />
              
              <Route path="/gallery-manager" element={
                <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                  <GalleryManager />
                </ProtectedRoute>
              } />
              
              <Route path="/events-manager" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <EventsManager />
                </ProtectedRoute>
              } />
              
              <Route path="/syllabus-manager" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SyllabusManager />
                </ProtectedRoute>
              } />
              
              <Route path="/messages-manager" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ContactMessagesManager />
                </ProtectedRoute>
              } />

              <Route path="/brand-theme" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BrandTheme />
                </ProtectedRoute>
              } />

              <Route path="/slider-manager" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SliderManager />
                </ProtectedRoute>
              } />

              <Route path="/announcements-manager" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AnnouncementsManager />
                </ProtectedRoute>
              } />

              <Route path="/user-management" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } />

              <Route path="/page-content-manager" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PageContentManager />
                </ProtectedRoute>
              } />

              <Route path="/otp-settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <OtpSettings />
                </ProtectedRoute>
              } />

              <Route path="/payment-settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PaymentSettings />
                </ProtectedRoute>
              } />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #334155',
              },
            }}
          />
        </div>
        </SiteSettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
