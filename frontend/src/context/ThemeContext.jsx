import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('mk-nails-theme');
    if (saved) return saved;
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'auto';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('mk-nails-theme', theme);
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (themeMode) => {
    const html = document.documentElement;
    
    if (themeMode === 'dark') {
      html.classList.add('dark');
    } else if (themeMode === 'light') {
      html.classList.remove('dark');
    } else {
      // auto mode
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  };

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
