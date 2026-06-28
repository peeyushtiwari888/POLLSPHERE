import React from 'react';
import { ArrowDownUp } from 'lucide-react';

const PollSort = ({ activeSort = 'Latest', onSortChange }) => {
  const options = ['Latest', 'Oldest', 'Most Responses', 'Expiring Soon'];

  return (
    <div className="relative group flex items-center">
      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
        <ArrowDownUp className="w-4 h-4" />
      </div>
      <select
        value={activeSort}
        onChange={(e) => onSortChange && onSortChange(e.target.value)}
        className="h-10 pl-8 pr-6 bg-transparent hover:bg-gray-50 dark:hover:bg-zinc-800/50 border-none rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default PollSort;
