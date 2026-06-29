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

    <div className="relative">
      <div className="flex items-center gap-2 pl-4 pr-3 py-0 bg-white hover:bg-gray-50 dark:bg-[#1a1a1a] dark:hover:bg-[#222] border border-gray-200 dark:border-transparent rounded-full transition-all duration-300 h-11 relative min-w-[160px] cursor-pointer shadow-sm dark:shadow-none">
        
        {/* Status Indicator Dot */}
        <div className={`w-2 h-2 rounded-full ${activeFilter === 'All' ? 'bg-gray-400 dark:bg-white' : activeFilter === 'Draft' ? 'bg-orange-500' : activeFilter === 'Published' ? 'bg-emerald-500' : activeFilter === 'Scheduled' ? 'bg-indigo-500' : 'bg-red-500'}`}></div>
        
        {/* Native Select overlaid for functionality, completely hidden visually but clickable */}
        <select
          value={activeFilter}
          onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-sm"
        >
          {filterConfig.map(({ name }) => (
            <option key={name} value={name}>
              {name === 'All' ? 'All Statuses' : name}
            </option>
          ))}
        </select>

        {/* Visible Text */}
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 pointer-events-none flex-1 truncate transition-colors">
          {activeFilter === 'All' ? 'All Statuses' : activeFilter}
        </span>

        {/* Chevron */}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500 pointer-events-none transition-colors">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
};

export default PollFilters;
