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
          Text Input & Controls Container
      -------------------------------------------------------- */}
      <div className="relative flex-1 flex items-center group/input">
        <input
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          aria-label={`Option ${index + 1}`}
          className={`w-full h-10 pl-4 pr-16 bg-white dark:bg-zinc-900 border rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all duration-300 shadow-sm ${
            option.isCorrect 
              ? 'border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-500/5' 
              : 'border-gray-200 dark:border-zinc-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
          }`}
        />
        
        <div className="absolute right-1 flex items-center gap-1">
          {/* --------------------------------------------------------
              Mark Correct Button
          -------------------------------------------------------- */}
          <button
            type="button"
            onClick={() => onUpdate({ isCorrect: !option.isCorrect })}
            title={option.isCorrect ? "Marked as correct" : "Mark as correct answer"}
            aria-label="Toggle correct answer"
            className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all ${
              option.isCorrect
                ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 opacity-100'
                : 'text-gray-300 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 opacity-0 group-hover/input:opacity-100 focus:opacity-100'
            }`}
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={option.isCorrect ? "3" : "2"}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>

          {/* --------------------------------------------------------
              Delete Button
          -------------------------------------------------------- */}
          <button
            type="button"
            onClick={onDelete}
            disabled={!canDelete}
            title="Delete option"
            aria-label={`Delete Option ${index + 1}`}
            className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all ${
              canDelete 
                ? 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer opacity-0 group-hover/input:opacity-100 focus:opacity-100' 
                : 'text-gray-200 dark:text-zinc-800 cursor-not-allowed opacity-0'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default OptionInput;
