import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, Sun, Moon, Bell, ChevronRight 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Premium SaaS Top Navigation Component
 * 
 * @param {function} onMenuClick - Handler to open the mobile sidebar drawer
 */
const TopNavbar = ({ onMenuClick }) => {
  const { isDarkMode, toggleTheme } = useTheme();

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
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Placeholder (Hidden on tiny screens) */}
        <div className="hidden sm:flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
          <span className="text-gray-900 dark:text-white font-semibold">Dashboard</span>
          <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0" />
          <span className="text-orange-500">Overview</span>
        </div>
        
        {/* Fallback Title for tiny screens */}
        <div className="sm:hidden font-semibold text-gray-900 dark:text-white text-lg">
          Overview
        </div>
      </div>

      {/* Middle/Right Section: Search, Theme, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-5 flex-1 justify-end">
        
        {/* Search Input (Hidden on mobile, expands on focus) */}
        <div className="hidden md:flex relative max-w-md w-full mr-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search polls, analytics..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-900 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-950 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
          />
          {/* Keyboard Shortcut Hint */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-xs text-gray-400 font-medium px-1.5 py-0.5 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
              ⌘K
            </span>
          </div>
        </div>

        {/* Mobile Search Icon (Shows on small screens instead of full input) */}
        <button 
          className="md:hidden p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-zinc-800 hidden sm:block"></div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification Icon */}
        <button
          className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Notification Indicator Dot */}
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500 border-2 border-white dark:border-zinc-950"></span>
          </span>
        </button>

        {/* Profile Dropdown Trigger */}
        <button
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
