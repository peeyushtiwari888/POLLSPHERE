import React from 'react';
import { Loader2, Radio } from 'lucide-react';
import PublicQuestionCard from './PublicQuestionCard';

/**
 * Public Question List (Live Presenter Mode)
 * 
 * In Live Mode, this component ONLY renders the currently active question.
 * If no question is active, it renders a "waiting for presenter" screen.
 */
const PublicQuestionList = ({ questions = [], answers = {}, setAnswers, activeQuestionId }) => {
  
  if (!questions || questions.length === 0) {
    return null;
  }

  // Handler to safely update the answers dictionary in the parent page
  const handleAnswerChange = (questionId, value) => {
    if (setAnswers) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value
      }));
    }
  };

  // If no question is active, show the waiting screen
  if (!activeQuestionId) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl text-center shadow-sm animate-in fade-in duration-500">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping"></div>
          <div className="relative w-16 h-16 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center shadow-sm border border-orange-100 dark:border-orange-500/30">
            <Radio className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Waiting for presenter...</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          The presenter hasn't published the next question yet. This screen will automatically update when they do.
        </p>
      </div>
    );
  }

  // Filter to find the active question
  const activeQuestionIndex = questions.findIndex(q => q._id === activeQuestionId);
  const activeQuestion = questions[activeQuestionIndex];

  if (!activeQuestion) {
    return null; // Fallback if activeQuestionId somehow doesn't match
  }

  return (
    <div className="w-full flex flex-col space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Navigation / Progress Row */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
        {questions.map((q, idx) => {
          const isCurrent = q._id === activeQuestionId;
          const isAnswered = answers[q._id] !== undefined && answers[q._id] !== '' && (!Array.isArray(answers[q._id]) || answers[q._id].length > 0);
          
          return (
            <div 
              key={q._id}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all border-2 ${
                isCurrent 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md scale-110' 
                  : isAnswered
                    ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/20 dark:border-orange-500/30'
                    : 'bg-white text-gray-400 border-gray-200 dark:bg-zinc-800 dark:border-zinc-700'
              }`}
            >
              {idx + 1}
            </div>
          );
        })}
      </div>

      {/* Active Question Card */}
      <PublicQuestionCard
        key={activeQuestion._id}
        index={activeQuestionIndex + 1}
        question={activeQuestion}
        currentAnswer={answers[activeQuestion._id]}
        onAnswerChange={(value) => handleAnswerChange(activeQuestion._id, value)}
      />
    </div>
  );
};

export default PublicQuestionList;
