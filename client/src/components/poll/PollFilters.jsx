import React from 'react';
import { motion } from 'framer-motion';

/**
 * Minimal Poll Filters with Colors
 */
const PollFilters = ({ activeFilter = 'All', onFilterChange }) => {
  const filterConfig = [
    { name: 'All', activeText: 'text-gray-900 dark:text-white', activeBg: 'bg-gray-900 dark:bg-white' },
    { name: 'Draft', activeText: 'text-orange-600 dark:text-orange-400', activeBg: 'bg-orange-500' },
    { name: 'Published', activeText: 'text-emerald-600 dark:text-emerald-400', activeBg: 'bg-emerald-500' },
    { name: 'Expired', activeText: 'text-red-600 dark:text-red-400', activeBg: 'bg-red-500' },
    { name: 'Archived', activeText: 'text-indigo-600 dark:text-indigo-400', activeBg: 'bg-indigo-500' },
  ];

  return (
    <div className="flex items-center w-full overflow-x-auto custom-scrollbar border-b border-gray-100 dark:border-zinc-800/50">
      <div className="flex items-center gap-6 min-w-max px-2">
        {filterConfig.map(({ name, activeText, activeBg }) => {
          const isActive = activeFilter === name;
          
          return (
            <button
              key={name}
              onClick={() => onFilterChange && onFilterChange(name)}
              className={`relative py-3 text-sm font-semibold transition-colors focus:outline-none ${
                isActive 
                  ? activeText 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <span className="relative z-10">{name}</span>
              
              {/* Minimal Underline Indicator */}
              {isActive && (
                <motion.div
                  layoutId="minimalTabIndicator"
                  className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full ${activeBg}`}
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PollFilters;
