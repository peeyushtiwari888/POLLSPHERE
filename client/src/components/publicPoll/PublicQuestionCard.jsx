import React from 'react';
import OptionRadio from './OptionRadio';
import DOMPurify from 'dompurify';
import { Star } from 'lucide-react';

/**
 * Public Question Card
 * 
 * Displays a single question, its required status, and a list of its options
 * or inputs depending on the questionType.
 */
const PublicQuestionCard = ({ index, question, currentAnswer, onAnswerChange }) => {
  if (!question) return null;

  // Handler for Multi-Select
  const handleMultiSelectToggle = (optionId) => {
    const currentList = Array.isArray(currentAnswer) ? currentAnswer : [];
    if (currentList.includes(optionId)) {
      onAnswerChange(currentList.filter(id => id !== optionId));
    } else {
      onAnswerChange([...currentList, optionId]);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-8 transition-all duration-300 hover:border-orange-200 dark:hover:border-orange-900/50">
      
      {/* ----------------------------------------------------------------------
          Question Header 
      ---------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 mb-8">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner border border-gray-100 dark:border-zinc-700">
          {index}
        </div>
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
          Input Types Rendering 
      ---------------------------------------------------------------------- */}
      <div className="space-y-3 sm:space-y-4">
        
        {/* SINGLE CHOICE */}
        {question.questionType === 'SINGLE_CHOICE' && question.options?.map((option, optIndex) => (
          <OptionRadio
            key={option._id || optIndex}
            option={option}
            isSelected={currentAnswer === option._id}
            onSelect={() => onAnswerChange(option._id)}
          />
        ))}

        {/* MULTI SELECT */}
        {question.questionType === 'MULTI_SELECT' && question.options?.map((option, optIndex) => {
          const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option._id);
          return (
            <label 
              key={option._id || optIndex}
              className={`
                group flex items-center gap-4 w-full p-4 sm:p-5 
                rounded-2xl border-2 transition-all cursor-pointer select-none
                ${isSelected 
                  ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-500/10 shadow-sm' 
                  : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-200 dark:hover:border-orange-900/50 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }
              `}
            >
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => handleMultiSelectToggle(option._id)}
                />
                <div className={`
                  w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 shadow-sm
                  ${isSelected ? 'bg-orange-500 border-orange-500' : 'bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 group-hover:border-orange-300'}
                `}>
                  {isSelected && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className={`text-base sm:text-lg font-medium transition-colors ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                {option.text}
              </span>
            </label>
          );
        })}

        {/* OPEN TEXT */}
        {question.questionType === 'OPEN_TEXT' && (
          <textarea
            rows={4}
            value={currentAnswer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-0 resize-y transition-colors"
          />
        )}

        {/* WORD CLOUD */}
        {question.questionType === 'WORD_CLOUD' && (
          <input
            type="text"
            value={currentAnswer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            maxLength={30}
            placeholder="Enter one or two words..."
            className="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-0 transition-colors"
          />
        )}

        {/* RATING */}
        {question.questionType === 'RATING' && (
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onAnswerChange(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    currentAnswer >= star 
                      ? 'fill-orange-400 text-orange-400 drop-shadow-md' 
                      : 'text-gray-300 dark:text-zinc-700 hover:text-orange-200 dark:hover:text-orange-900'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PublicQuestionCard;
