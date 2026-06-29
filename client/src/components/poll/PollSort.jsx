import React from 'react';
import { ArrowDownUp } from 'lucide-react';

const PollSort = ({ activeSort = 'Latest', onSortChange }) => {
  const options = ['Latest', 'Oldest', 'Most Responses', 'Expiring Soon'];

  return (
    <div className="relative group flex items-center">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 transition-colors">
        <ArrowDownUp className="w-4 h-4" />
      </div>
      <select
        value={activeSort}
        onChange={(e) => onSortChange && onSortChange(e.target.value)}
        className="w-full h-11 pl-10 pr-10 bg-white hover:bg-gray-50 dark:bg-[#1a1a1a] dark:hover:bg-[#222] border border-gray-200 dark:border-transparent rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors shadow-sm dark:shadow-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
  );
};

export default PollSort;
