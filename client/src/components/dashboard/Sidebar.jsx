import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, SquaresFour, ChartBar, PlusCircle, 
  TrendUp, UserCircle, SignOut, CaretLeft, CaretRight, CalendarBlank, ChartPieSlice
} from '@phosphor-icons/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

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
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: SquaresFour, path: '/dashboard' },
    { name: 'My Polls', icon: ChartBar, path: '/polls' },
    { name: 'Create Poll', icon: PlusCircle, path: '/polls/create' },
    { name: 'Poll Analytics', icon: TrendUp, path: '/analytics/general' },
    { name: 'Manage Events', icon: CalendarBlank, path: '/events' },
    { name: 'Event Analytics', icon: ChartPieSlice, path: '/events/analytics/dashboard' },
    { name: 'Profile', icon: UserCircle, path: '/profile' },
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
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img src="/logo.png" alt="PollSphere Icon" className="h-8 w-auto max-w-[40px] object-contain flex-shrink-0 rounded-lg shadow-sm" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-extrabold text-2xl tracking-tighter"
                >
                  <span className="text-gray-900 dark:text-white">Poll</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">Sphere</span>
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
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white font-medium'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon 
                  weight={isActive ? "fill" : "regular"}
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isActive 
                      ? 'text-orange-500' 
                      : 'text-gray-400 dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-white'
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
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium transition-all group relative"
            aria-label="Logout"
          >
            <SignOut weight="regular" className="w-5 h-5 flex-shrink-0 transition-transform group-hover:-translate-x-1" />
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
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
