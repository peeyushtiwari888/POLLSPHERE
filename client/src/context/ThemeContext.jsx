import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 1. Initialize state smartly:
  //    Check localStorage first for a user's persistent preference.
  //    If none exists, default to 'system'
  const [theme, setTheme] = useState(() => {
    try {
      const storedTheme = localStorage.getItem('pollsphere-theme');
      if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
        return storedTheme;
      }
      return 'system';
    } catch (error) {
      console.error('Failed to initialize theme:', error);
      return 'system'; // Safe fallback
    }
  });

  // Calculate the actual derived state (whether dark mode is currently active)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 2. Sync side-effects automatically whenever the theme changes:
  useEffect(() => {
    const root = document.documentElement;
    
    // Save preference
    localStorage.setItem('pollsphere-theme', theme);
    
    const applyTheme = () => {
      if (theme === 'dark') {
        root.classList.add('dark');
        setIsDarkMode(true);
      } else if (theme === 'light') {
        root.classList.remove('dark');
        setIsDarkMode(false);
      } else if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
          root.classList.add('dark');
          setIsDarkMode(true);
        } else {
          root.classList.remove('dark');
          setIsDarkMode(false);
        }
      }
    };

    applyTheme();

    // Listen for OS-level theme changes if set to 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Backwards compatibility for components just using toggleTheme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
