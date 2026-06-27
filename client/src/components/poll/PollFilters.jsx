import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

/**
 * Poll Filters
 * 
 * Renders a horizontally scrollable list of filter chips (pills).
 * Purely presentational; delegates state changes via onFilterChange.
 */
const PollFilters = ({ activeFilter = 'All', onFilterChange }) => {
  const filters = ['All', 'Draft', 'Published', 'Expired'];

  return (
    <div className="flex items-center gap-3">
      {/* Optional: Filter Icon for aesthetic grounding on desktop */}
      <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-gray-400">
        <Filter className="w-5 h-5" />
      </div>

      {/* Horizontally scrollable container for mobile responsiveness */}
      <div className="flex-1 overflow-x-auto custom-scrollbar pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 min-w-max">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            
            return (
              <button
                key={filter}
                onClick={() => onFilterChange && onFilterChange(filter)}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none overflow-hidden ${
                  isActive 
                    ? 'text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
              >
                {/* Framer Motion Background for active state (smooth slide effect) */}
                {isActive && (
                  <motion.div
                    layoutId="activeFilterBubble"
                    className="absolute inset-0 bg-gray-900 dark:bg-orange-500 z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <span className="relative z-10">{filter}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PollFilters;
