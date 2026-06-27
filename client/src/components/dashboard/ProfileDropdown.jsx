import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut } from 'lucide-react';

/**
 * Premium Profile Dropdown Component
 * 
 * Renders the user avatar trigger and a highly polished, animated dropdown menu.
 */
const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Trigger Button (Avatar Placeholder) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-center rounded-full transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950
          active:scale-95
          ${isOpen ? 'ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-zinc-950' : ''}
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Open Profile Menu"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-sm hover:shadow-md border-2 border-transparent transition-all">
          P
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-50 origin-top-right"
          >
            {/* Header / User Info Placeholder */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                Peeyush Tiwari
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                peeyush@example.com
              </p>
            </div>

            {/* Main Menu Items */}
            <div className="py-1.5">
              <button 
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4" />
                <span className="font-medium">My Profile</span>
              </button>
              
              <button 
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Settings</span>
              </button>
            </div>

            {/* Footer / Logout */}
            <div className="py-1.5 border-t border-gray-100 dark:border-zinc-800">
              <button 
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
