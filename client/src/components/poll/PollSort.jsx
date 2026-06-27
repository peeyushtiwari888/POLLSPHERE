import React from 'react';
import { ArrowDownUp } from 'lucide-react';

const PollSort = ({ activeSort = 'Latest', onSortChange }) => {
  const options = ['Latest', 'Oldest', 'Most Responses', 'Expiring Soon'];

  return (
    <div className="relative group flex items-center">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <ArrowDownUp className="w-4 h-4" />
      </div>
      <select
        value={activeSort}
        onChange={(e) => onSortChange && onSortChange(e.target.value)}
        className="h-11 pl-10 pr-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-sm appearance-none cursor-pointer transition-colors"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {/* Custom select arrow since appearance-none hides the default one */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default PollSort;
