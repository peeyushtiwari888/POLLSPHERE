import React from 'react';
import { Users, Activity, BarChart2, Globe2 } from 'lucide-react';

/**
 * Overview Cards Component
 * 
 * Displays high-level KPI metrics for a poll in a premium, responsive grid.
 * Pure presentational component.
 * 
 * @param {Object} stats - The overview statistics object.
 */
const OverviewCards = ({ stats }) => {
  // Graceful fallback for missing stats
  const safeStats = stats || {};
  
  const {
    totalResponses = 0,
    completionRate = 0,
    isActive = false,
    isPublished = false
  } = safeStats;

  // Configuration for the 4 metric cards
  const cards = [
    {
      title: 'Total Responses',
      value: totalResponses.toLocaleString(),
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      borderColor: 'border-blue-100 dark:border-blue-900/30'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: Activity,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      borderColor: 'border-emerald-100 dark:border-emerald-900/30'
    },
    {
      title: 'Poll Status',
      value: isActive ? 'Active' : 'Expired',
      icon: Globe2,
      color: isActive ? 'text-orange-500' : 'text-red-500',
      bgColor: isActive ? 'bg-orange-50 dark:bg-orange-500/10' : 'bg-red-50 dark:bg-red-500/10',
      borderColor: isActive ? 'border-orange-100 dark:border-orange-900/30' : 'border-red-100 dark:border-red-900/30'
    },
    {
      title: 'Public Results',
      value: isPublished ? 'Published' : 'Private',
      icon: BarChart2,
      color: isPublished ? 'text-purple-500' : 'text-gray-500',
      bgColor: isPublished ? 'bg-purple-50 dark:bg-purple-500/10' : 'bg-gray-50 dark:bg-zinc-800',
      borderColor: isPublished ? 'border-purple-100 dark:border-purple-900/30' : 'border-gray-100 dark:border-zinc-700'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, index) => (
        <div 
          key={index}
          className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          {/* Subtle background glow effect on hover */}
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -mr-8 -mt-8 ${card.bgColor}`} />
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            {/* Header: Icon & Title */}
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${card.bgColor} ${card.color} ${card.borderColor}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {card.title}
              </h4>
            </div>

            {/* Value */}
            <div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {card.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
