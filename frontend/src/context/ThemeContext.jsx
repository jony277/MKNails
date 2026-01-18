import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage or default to 'auto'
    return localStorage.getItem('theme') || 'auto';
  });

  // Determine actual theme (light or dark)
  const getActualTheme = (selectedTheme) => {
    if (selectedTheme === 'auto') {
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return selectedTheme;
  };

  const actualTheme = getActualTheme(theme);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (actualTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-color-scheme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-color-scheme', 'light');
    }
    
    // Save preference
    localStorage.setItem('theme', theme);
  }, [theme, actualTheme]);

  // Listen to system preference changes when in auto mode
  useEffect(() => {
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Force re-render by triggering theme update
      const root = document.documentElement;
      const isDark = mediaQuery.matches;
      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-color-scheme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-color-scheme', 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, actualTheme }}>
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
