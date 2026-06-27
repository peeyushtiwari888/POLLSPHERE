import React from 'react';
import { PlusCircle, BarChart3, LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * QuickActions Component
 * 
 * Provides fast access to the most common tasks a user performs on the dashboard.
 * Styled with premium SaaS hover effects.
 */
const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 shadow-sm h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Quick Actions
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Jump right into what matters
        </p>
      </div>

      {/* Button Stack */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        
        {/* Primary Action Button */}
        <button 
          onClick={() => navigate('/polls/create')}
          className="group flex items-center justify-between p-4 rounded-xl bg-orange-500 text-white shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-orange-600 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">Create New Poll</span>
          </div>
          <span className="text-white/60 group-hover:translate-x-1 group-hover:text-white transition-all text-xl leading-none">
            &rarr;
          </span>
        </button>

        {/* Secondary Action Button 1 */}
        <button 
          onClick={() => navigate('/polls')}
          className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 active:scale-95"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800 group-hover:text-blue-500 transition-colors">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="font-medium text-sm">View My Polls</span>
          </div>
        </button>

        {/* Secondary Action Button 2 */}
        <button className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600 active:scale-95">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800 group-hover:text-purple-500 transition-colors">
              <LineChart className="w-5 h-5" />
            </div>
            <span className="font-medium text-sm">Analytics</span>
          </div>
        </button>

      </div>
    </div>
  );
};

export default QuickActions;
