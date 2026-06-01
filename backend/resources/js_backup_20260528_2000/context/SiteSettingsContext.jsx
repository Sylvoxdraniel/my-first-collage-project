import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    college_name: 'Gautam Budha Mahila College, Gaya',
    college_name_hindi: 'गौतम बुद्ध महिला महाविद्यालय, गयाजी',
    college_subtitle: 'S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001',
    logo_path: null,
    primary_color: '#0b1b3d',
    secondary_color: '#cc0000',
    accent_color: '#eab308',
    navbar_bg: '#0b1b3d',
    hero_bg: '#990000',
    font_family: 'Inter',
    button_style: 'rounded',
    address: 'S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001',
    phone: '0631-2220642',
    email: 'info@gbmcollegegaya.org',
    vc_name: 'Prof. (Dr.) Dilip Kumar Kesari',
    vc_designation: 'Vice Chancellor, Magadh University',
    vc_message: 'Welcome to Gautam Budha Mahila College. Education is not just about loading minds with facts, it is about sparking a flame of scientific inquiry. We strive to provide our students with the resource support they need to become responsible global citizens and leaders in their chosen professions.',
    vc_image_path: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
    principal_name: 'Prof. (Dr.) Seema Patel',
    principal_designation: 'Principal, Gautam Budha Mahila College',
    principal_message: 'At Gautam Budha Mahila College, we have established a culture of academic rigor and student achievements. With a focus on research, modern laboratories, and expert guidance, our campus continues to be the top choice for students looking to excel in science and computer applications.',
    principal_image_path: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    patron_name: 'Dr. Sunita Sharma',
    patron_designation: 'Patron, Gautam Budha Mahila College',
    patron_message: 'It is an honor to lead this institution. We have structured a syllabus support framework, dynamic co-curricular activities, and sports events to ensure that education is holistic, enjoyable, and creates highly employable graduates.',
    patron_image_path: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop',
    stats_years: '20',
    stats_programs: '18',
    stats_students: '3500',
    stats_faculty: '80',
  });
  const [sliders, setSliders] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const response = await api.get('/public/site-settings', { params: { t: new Date().getTime() } });
      if (response.data) {
        if (response.data.settings) {
          // Merge loaded settings over defaults
          setSettings(prev => ({
            ...prev,
            ...response.data.settings
          }));
        }
        if (response.data.sliders) {
          setSliders(response.data.sliders);
        }
        if (response.data.announcements) {
          setAnnouncements(response.data.announcements);
        }
      }
    } catch (error) {
      console.error('Failed to load website settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Apply colors & fonts to CSS custom properties dynamically
  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', settings.primary_color || '#0b1b3d');
      root.style.setProperty('--secondary-color', settings.secondary_color || '#cc0000');
      root.style.setProperty('--accent-color', settings.accent_color || '#eab308');
      root.style.setProperty('--navbar-bg', settings.navbar_bg || '#0b1b3d');
      root.style.setProperty('--hero-bg', settings.hero_bg || '#990000');
      
      if (settings.font_family) {
        root.style.setProperty('--font-family', settings.font_family);
        document.body.style.fontFamily = `"${settings.font_family}", Inter, system-ui, sans-serif`;
      }
    }
  }, [settings]);

  const value = {
    settings,
    sliders,
    announcements,
    loading,
    refreshSettings,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}

export default SiteSettingsContext;
