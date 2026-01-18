import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // Start with dark
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    // Get saved theme from localStorage
    const saved = localStorage.getItem('theme-preference');
    const initial = saved || 'dark';
    
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

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
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Prevent flash by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
