import React from 'react';
import { SearchX } from 'lucide-react';
import PollCard from './PollCard';

/**
 * Poll Grid
 * 
 * Reusable layout component that renders a responsive grid of PollCards.
 * Displays a graceful empty state when the `polls` array is empty (e.g., when a search yields 0 results).
 * Completely stateless and contains no API logic.
 */
const PollGrid = ({ polls = [], refreshData }) => {
  
  // ---------------------------------------------------------------------------
  // Empty State (Triggered when search/filters return 0 results)
  // ---------------------------------------------------------------------------
  if (!polls || polls.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm text-center">
        <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-950 rounded-full flex items-center justify-center shadow-inner mb-4 border border-gray-100 dark:border-zinc-800">
          <SearchX className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          No polls found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
          We couldn't find any polls matching your current search or filter criteria. Try adjusting your filters.
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main Grid View
  // ---------------------------------------------------------------------------
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
      {polls.map((poll) => (
        <PollCard 
          key={poll._id} 
          poll={poll} 
          onRefresh={refreshData} 
        />
      ))}
    </div>
  );
};

export default PollGrid;
