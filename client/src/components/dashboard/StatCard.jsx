import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Premium Reusable Statistics Card Component
 * 
 * @param {string} title - The title of the stat (e.g., "Total Polls")
 * @param {string|number} value - The main numerical value to display
 * @param {React.ElementType} icon - A Lucide React icon component
 * @param {string} trend - The percentage or value string for the trend (e.g., "12%")
 * @param {string} trendType - 'positive', 'negative', or 'neutral'
 * @param {string} color - The primary accent color ('orange', 'blue', 'green', 'purple', 'rose')
 */
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendType = 'neutral', 
  color = 'orange' 
}) => {
  // Map trend types to their respective semantic colors
  const trendColors = {
    positive: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
    negative: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10',
    neutral: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-500/10'
  };

  // Select the appropriate icon based on the trend type
  const TrendIcon = trendType === 'positive' 
    ? TrendingUp 
    : trendType === 'negative' 
      ? TrendingDown 
      : Minus;

  // Map primary accent colors for the main icon container and hover flares
  const accentColors = {
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-500',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-500',
    green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-500',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-500',
    rose: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-500',
  };

  const iconColorClass = accentColors[color] || accentColors.orange;

  // Extract the background color specifically for the blur effect flare
  const flareColorClass = iconColorClass.split(' ')[0];

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
    >
      {/* Decorative gradient blur that appears on hover for a premium SaaS feel */}
      <div 
        className={`absolute -right-6 -top-6 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-full ${flareColorClass}`} 
      />

      {/* Main Content Area */}
      <div className="flex items-start justify-between relative z-10">
        
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {value}
            </span>
          </div>
        </div>
        
        {/* Main Icon Container */}
        <div className={`p-3.5 rounded-2xl ${iconColorClass} transition-colors`}>
          <Icon className="w-6 h-6" strokeWidth={2.5} />
        </div>
      </div>

      {/* Trend Indicator */}
      {trend && (
        <div className="mt-5 flex items-center gap-2 relative z-10">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${trendColors[trendType]}`}>
            <TrendIcon className="w-3.5 h-3.5" strokeWidth={3} />
            {trend}
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            vs last month
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
