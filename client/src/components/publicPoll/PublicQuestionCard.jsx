import React from 'react';
import OptionRadio from './OptionRadio';
import DOMPurify from 'dompurify';

/**
 * Public Question Card
 * 
 * Displays a single question, its required status, and a list of its options.
 * Highly visual and responsive to interactions.
 */
const PublicQuestionCard = ({ index, question, currentAnswer, onAnswerChange }) => {
  
  if (!question) return null;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-8 transition-all duration-300 hover:border-orange-200 dark:hover:border-orange-900/50">
      
      {/* ----------------------------------------------------------------------
          Question Header 
      ---------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 mb-8">
        
        {/* Index Number */}
        <div className="flex-shrink-0 w-12 h-12 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner border border-gray-100 dark:border-zinc-700">
          {index}
        </div>
        
        {/* Question Text & Badges */}
        <div className="flex-1 mt-1 sm:mt-1.5">
          <div className="flex items-start flex-wrap gap-3">
            
            <div 
              className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight [&>p]:m-0 inline-block"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.text) }}
            />
            
            {question.isRequired && (
              <span className="mt-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30">
                Required
              </span>
            )}
            
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          Options List 
      ---------------------------------------------------------------------- */}
      <div className="space-y-3 sm:space-y-4">
        {question.options?.map((option, optIndex) => (
          <OptionRadio
            key={option._id || optIndex}
            option={option}
            // A strictly controlled component - it's selected if its ID matches the currentAnswer state
            isSelected={currentAnswer === option._id}
            onSelect={() => onAnswerChange(option._id)}
          />
        ))}
      </div>

    </div>
  );
};

export default PublicQuestionCard;
