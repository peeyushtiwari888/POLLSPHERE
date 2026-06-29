import React from 'react';
import { 
  List, Sun, Moon, Bell, CaretRight 
} from '@phosphor-icons/react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

/**
 * Premium SaaS Top Navigation Component
 * 
 * @param {function} onMenuClick - Handler to open the mobile sidebar drawer
 */
const TopNavbar = ({ onMenuClick }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors shadow-sm">
      
      {/* Left Section: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-4 flex-1">
        
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 transition-colors lg:hidden focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="Open sidebar"
        >
          <List weight="bold" className="w-5 h-5" />
        </button>

        {/* Breadcrumb Placeholder (Hidden on tiny screens) */}
        <div className="hidden sm:flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
          <span className="text-gray-900 dark:text-white font-semibold">Dashboard</span>
          <CaretRight weight="bold" className="w-4 h-4 mx-1 flex-shrink-0" />
          <span className="text-orange-500">Overview</span>
        </div>
        
        {/* Fallback Title for tiny screens */}
        <div className="sm:hidden font-semibold text-gray-900 dark:text-white text-lg">
          Overview
        </div>
      </div>

      {/* Middle/Right Section: Theme, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-5 flex-1 justify-end">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun weight="fill" className="w-5 h-5" /> : <Moon weight="fill" className="w-5 h-5" />}
        </button>

        {/* Notification Icon */}
        <button
          className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="Notifications"
        >
          <Bell weight="fill" className="w-5 h-5" />
          {/* Notification Indicator Dot */}
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500 border-2 border-white dark:border-zinc-950"></span>
          </span>
        </button>

        {/* Profile Dropdown Trigger */}
        <button
          onClick={() => navigate('/settings')}
          className="ml-1 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full transition-transform active:scale-95"
          aria-label="Open Profile Menu"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-md hover:shadow-lg border-2 border-transparent hover:border-orange-200 dark:hover:border-orange-900 transition-all">
            P
          </div>
        </button>
        
      </div>
    </header>
  );
};

export default TopNavbar;
