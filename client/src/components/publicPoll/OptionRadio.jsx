import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Option Radio
 * 
 * A highly accessible, custom-styled radio button component for poll options.
 * Uses a visually hidden native input to maintain accessibility standards while 
 * relying on Tailwind and Framer Motion for a premium SaaS visual experience.
 */
const OptionRadio = ({ option, isSelected, onSelect }) => {
  if (!option) return null;

  return (
    <label 
      className={`relative flex items-center p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 outline-none focus-within:ring-2 focus-within:ring-orange-500/50 focus-within:ring-offset-2 dark:focus-within:ring-offset-zinc-900 ${
        isSelected 
          ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-500 dark:border-orange-500 shadow-sm' 
          : 'bg-gray-50 dark:bg-zinc-800/40 border-transparent hover:bg-gray-100 dark:hover:bg-zinc-800'
      }`}
    >
      
      {/* 
        Native Input (Hidden)
        Keeps the form accessible for screen readers and keyboard navigation. 
      */}
      <input
        type="radio"
        value={option._id}
        checked={isSelected}
        onChange={onSelect}
        className="sr-only" // Screen-reader only
        aria-label={option.text}
      />

      <div className="flex-1 flex items-center justify-between gap-4">
        
        {/* Option Text */}
        <span className={`text-base sm:text-lg font-medium transition-colors ${
          isSelected 
            ? 'text-orange-900 dark:text-orange-50' 
            : 'text-gray-700 dark:text-gray-300'
        }`}>
          {option.text}
        </span>

        {/* 
          Custom Radio Circle Indicator 
          Provides visual feedback since the native radio is hidden
        */}
        <div 
          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
            isSelected 
              ? 'border-orange-500 bg-orange-500 shadow-sm' 
              : 'border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900'
          }`}
          aria-hidden="true" // Hidden from screen readers because the native input handles semantics
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </motion.div>
          )}
        </div>

      </div>
    </label>
  );
};

export default OptionRadio;
