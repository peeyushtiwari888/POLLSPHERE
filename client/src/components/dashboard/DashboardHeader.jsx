import React from 'react';

/**
 * Premium Dashboard Header Component
 * Displays a personalized greeting and high-level context.
 */
const DashboardHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Welcome back, Creator! 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here is what's happening with your polls today.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors">
          View Documentation
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
