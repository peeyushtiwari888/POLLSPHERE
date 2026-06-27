import React from 'react';
import { Send, Loader2 } from 'lucide-react';

/**
 * Submit Poll Button
 * 
 * A premium, highly visible CTA button for submitting poll responses.
 * Handles loading and disabled states cleanly without containing any API logic.
 */
const SubmitPollButton = ({ onSubmit, isSubmitting, isDisabled }) => {
  return (
    <div className="w-full flex justify-center sm:justify-end mt-10 mb-20">
      <button
        type="button"
        onClick={onSubmit}
        disabled={isDisabled || isSubmitting}
        aria-busy={isSubmitting}
        aria-disabled={isDisabled || isSubmitting}
        className={`relative w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
          isDisabled || isSubmitting
            ? 'bg-gray-100 dark:bg-zinc-800/50 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-zinc-800 shadow-none'
            : 'text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-[0_8px_30px_rgb(249,115,22,0.3)] hover:shadow-[0_8px_30px_rgb(249,115,22,0.5)] active:scale-[0.98]'
        }`}
      >
        {isSubmitting ? (
          <>
            <span>Submitting...</span>
            <Loader2 className="w-5 h-5 animate-spin text-white/80" />
          </>
        ) : (
          <>
            <span>Submit Answers</span>
            <Send className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </div>
  );
};

export default SubmitPollButton;
