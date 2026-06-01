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
  });
  const [sliders, setSliders] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const response = await api.get('/public/site-settings');
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
