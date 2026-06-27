import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, FileQuestion } from 'lucide-react';

/**
 * Premium Reusable Empty State Component
 * 
 * Used when a list, table, or section has no data to display.
 * 
 * @param {string} title - Main heading text
 * @param {string} description - Subtitle text explaining the empty state
 * @param {string} actionText - Text for the primary call-to-action button
 * @param {function} onAction - Handler for the button click
 * @param {React.ElementType} icon - Lucide icon component to display
 */
const EmptyState = ({
  title = "No polls created yet.",
  description = "Get started by creating your first poll and sharing it with your audience to collect valuable insights.",
  actionText = "Create Your First Poll",
  onAction,
  icon: Icon = FileQuestion,
}) => {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-sm">
      
      {/* Animated Premium Illustration Placeholder */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-6"
      >
        {/* Soft glowing background element */}
        <div className="absolute inset-0 bg-orange-100 dark:bg-orange-500/20 blur-2xl rounded-full scale-150 opacity-60"></div>
        
        {/* Main Icon Circle */}
        <div className="relative w-24 h-24 bg-orange-50 dark:bg-zinc-800 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-950 shadow-lg">
          <Icon className="w-10 h-10 text-orange-500 dark:text-orange-400" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Typography */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
        {title}
      </h3>
      <p className="max-w-md text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
        {description}
      </p>

      {/* Primary Action Button */}
      {actionText && (
        <button 
          onClick={onAction}
          className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-orange-600 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
          {actionText}
        </button>
      )}
      
    </div>
  );
};

export default EmptyState;
