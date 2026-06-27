import React from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Option Input Component
 * 
 * Renders a single option field with an alphabetical index indicator
 * and a deletion control.
 */
const OptionInput = ({ option, index, canDelete, onUpdate, onDelete }) => {
  // Convert index to alphabetical letter (0 -> A, 1 -> B, etc.)
  const optionLetter = String.fromCharCode(65 + index);

  return (
    <div className="flex items-center gap-3 w-full group">
      
      {/* --------------------------------------------------------
          Alphabetical Indicator Placeholder
      -------------------------------------------------------- */}
      <div 
        className="w-8 h-8 flex-shrink-0 rounded-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors group-hover-within:border-orange-500"
        aria-hidden="true"
      >
        {optionLetter}
      </div>

      {/* --------------------------------------------------------
          Text Input
      -------------------------------------------------------- */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option.text}
          onChange={(e) => onUpdate(e.target.value)}
          aria-label={`Option ${index + 1}`}
          className="w-full h-10 pl-4 pr-10 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 shadow-sm"
        />
        
        {/* --------------------------------------------------------
            Delete Button (Absolute positioned inside input)
        -------------------------------------------------------- */}
        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          aria-label={`Delete Option ${index + 1}`}
          className={`absolute inset-y-0 right-1 my-auto h-8 w-8 flex items-center justify-center rounded-lg transition-all ${
            canDelete 
              ? 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100' 
              : 'text-gray-300 dark:text-zinc-700 cursor-not-allowed opacity-100'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default OptionInput;
