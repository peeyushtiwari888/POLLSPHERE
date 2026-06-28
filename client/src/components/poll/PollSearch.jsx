import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Poll Search Input
 * 
 * A reusable, premium search bar with a magnifying glass icon.
 * Purely presentational; delegates state changes to the parent.
 */
const PollSearch = ({ value = '', onChange }) => {
  return (
    <div className="relative w-full group">
      
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
        <Search className="w-5 h-5" />
      </div>
      
      {/* Input Field */}
      <input
        type="text"
        placeholder="Search polls by title..."
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full h-10 pl-10 pr-10 bg-gray-50/80 dark:bg-zinc-800/50 border border-transparent rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-200 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300"
        aria-label="Search polls"
      />

      {/* Clear Button (Only shows when there is text) */}
      {value && (
        <button
          type="button"
          onClick={() => onChange && onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}

    </div>
  );
};

export default PollSearch;
