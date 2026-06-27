import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, LayoutDashboard, BarChart3, PlusCircle, 
  LineChart, User, LogOut, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Premium SaaS Sidebar Component
 * 
 * Supports both collapsible desktop mode and mobile drawer mode.
 * 
 * @param {boolean} isOpen - Controls mobile drawer visibility
 * @param {function} onClose - Closes the mobile drawer
 * @param {boolean} isCollapsed - Controls desktop collapse state
 * @param {function} toggleCollapse - Toggles desktop collapse state
 */
const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Polls', icon: BarChart3, path: '/polls' },
    { name: 'Create Poll', icon: PlusCircle, path: '/polls/create' },
    { name: 'Analytics', icon: LineChart, path: '/analytics/general' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? '5rem' : '16rem',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed top-0 left-0 z-50 h-full flex flex-col
          bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 
          shadow-2xl lg:shadow-none transition-colors
          transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
        `}
        aria-label="Sidebar Navigation"
      >
        {/* Brand / Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white font-bold text-xl leading-none">P</span>
            </div>
            
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-xl tracking-tight text-gray-900 dark:text-white"
                >
                  PollSphere
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 1024) onClose(); // Auto-close on mobile after selection
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative
                  ${isActive 
                    ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 font-medium shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-white font-medium'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon 
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isActive 
                      ? 'text-orange-500' 
                      : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`} 
                />
                
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-14 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Area - Logout & Desktop Toggle */}
        <div className="p-3 border-t border-gray-200 dark:border-zinc-800 flex flex-col gap-2">
          
          {/* Logout Button */}
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium transition-all group relative"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:-translate-x-1" />
            {!isCollapsed && <span className="truncate">Logout</span>}
            
            {/* Tooltip for Logout in collapsed state */}
            {isCollapsed && (
              <div className="absolute left-14 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>

          {/* Desktop Sidebar Toggle */}
          <button 
            onClick={toggleCollapse}
            className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
