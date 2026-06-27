import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 1. Initialize state smartly:
  //    Check localStorage first for a user's persistent preference.
  //    If none exists, default to their Operating System preference.
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const storedTheme = localStorage.getItem('pollsphere-theme');
      if (storedTheme) {
        return storedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      console.error('Failed to initialize theme:', error);
      return false; // Safe fallback
    }
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // 2. Sync side-effects automatically whenever the theme changes:
  //    - Add/remove the '.dark' class on the HTML root
  //    - Save the preference in localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('pollsphere-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('pollsphere-theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
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
