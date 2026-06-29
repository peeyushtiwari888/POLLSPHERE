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
    <div className="relative w-full md:w-80 group">
      
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-gray-900 dark:group-focus-within:text-white transition-colors">
        <Search className="w-4 h-4" />
      </div>
      
      {/* Input Field */}
      <input
        type="text"
        placeholder="Search Quizzes"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full h-11 pl-11 pr-10 bg-white hover:bg-gray-50 dark:bg-[#1a1a1a] dark:hover:bg-[#222] border border-gray-200 dark:border-transparent rounded-full text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-300 dark:focus:border-zinc-700 focus:bg-gray-50 dark:focus:bg-[#222] transition-all duration-300 shadow-sm dark:shadow-none"
        aria-label="Search Quizzes"
      />

      {/* Clear Button (Only shows when there is text) */}
      {value && (
        <button
          type="button"
          onClick={() => onChange && onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-white focus:outline-none transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}

    </div>
  );
};

export default PollSearch;
