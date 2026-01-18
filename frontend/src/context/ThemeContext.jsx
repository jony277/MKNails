import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [auto, setAuto] = useState(true);

  // Initialize theme on mount
  useEffect(() => {
    // Get saved theme preference and auto setting
    const saved = localStorage.getItem('theme-preference');
    const savedAuto = localStorage.getItem('theme-auto');
    
    // If auto mode is enabled (or not set yet)
    if (savedAuto !== 'false') {
      setAuto(true);
      // Use system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
        setTheme('dark');
      } else {
        applyTheme('light');
        setTheme('light');
      }
      localStorage.setItem('theme-auto', 'true');
    } else {
      // Use saved preference
      setAuto(false);
      const initial = saved || 'light';
      setTheme(initial);
      applyTheme(initial);
    }
    
    setMounted(true);
  }, []);

  // Listen for system theme changes when auto mode is on
  useEffect(() => {
    if (!auto || !mounted) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme);
      setTheme(newTheme);
    };
    
    // Modern way
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [auto, mounted]);

  // Apply theme to DOM
  const applyTheme = (newTheme) => {
    const html = document.documentElement;
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('theme-preference', newTheme);
  };

  // Toggle between light and dark
  const toggleTheme = (newTheme) => {
    setAuto(false);
    localStorage.setItem('theme-auto', 'false');
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Enable auto mode
  const enableAuto = () => {
    setAuto(true);
    localStorage.setItem('theme-auto', 'true');
    
    // Apply system preference immediately
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
      setTheme('dark');
    } else {
      applyTheme('light');
      setTheme('light');
    }
  };

  // Prevent flash by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, auto, enableAuto }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
