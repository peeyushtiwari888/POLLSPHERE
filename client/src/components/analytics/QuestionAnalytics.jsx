import React from 'react';
import { FileQuestion, Trophy, Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Question Analytics Component
 * 
 * Renders a detailed breakdown of votes and percentages for every question in the poll.
 * Automatically identifies and highlights the winning option.
 * 
 * @param {Array} questions - Array of question analytics data
 */
const QuestionAnalytics = ({ questions = [] }) => {
  
  if (!questions || questions.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm text-center">
        <p className="text-gray-500 dark:text-gray-400">No question data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <FileQuestion className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Question Breakdown
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Detailed response statistics per question
          </p>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-8">
        {questions.map((question, qIndex) => {
          
          // Determine the maximum votes to find the winner(s)
          // (Handles edge cases where multiple options might tie for first place)
          const maxVotes = question.options.reduce((max, opt) => Math.max(max, opt.votes || 0), 0);
          
          return (
            <div key={question._id || qIndex} className="flex flex-col space-y-4">
              
              {/* Question Title & Total Votes */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                  <span className="text-gray-400 dark:text-gray-500 mr-2 font-medium">Q{qIndex + 1}.</span>
                  {question.text}
                </h4>
                <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-lg border border-gray-100 dark:border-zinc-700">
                  <Users className="w-3.5 h-3.5" />
                  {question.totalVotes || 0} Votes
                </div>
              </div>

              {/* Options Breakdown */}
              <div className="space-y-3">
                {question.options.map((option, oIndex) => {
                  const votes = option.votes || 0;
                  const percentage = option.percentage || 0;
                  
                  // An option is considered a "winner" if it has the max votes and there is at least 1 vote.
                  const isWinner = votes === maxVotes && maxVotes > 0;

                  return (
                    <div 
                      key={option._id || oIndex}
                      className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                        isWinner 
                          ? 'bg-orange-50/50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/30' 
                          : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800'
                      }`}
                    >
                      {/* Left Side: Option Text & Winner Badge */}
                      <div className="flex items-center gap-3 flex-1 min-w-0 z-10">
                        {isWinner ? (
                          <div className="shrink-0 p-1.5 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full shadow-sm">
                            <Trophy className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="shrink-0 p-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-400 rounded-full">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                        <span className={`text-sm truncate font-medium ${isWinner ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                          {option.text}
                        </span>
                      </div>

                      {/* Right Side: Metrics & Progress Bar */}
                      <div className="flex items-center gap-4 shrink-0 z-10 w-full sm:w-1/2 justify-between sm:justify-end">
                        
                        {/* Interactive Progress Bar */}
                        <div className="flex-1 max-w-[200px] h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${isWinner ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'bg-gray-300 dark:bg-zinc-600'}`}
                          />
                        </div>

                        {/* Numeric Stats */}
                        <div className="flex items-center gap-3 min-w-[90px] justify-end">
                          <span className={`text-sm font-bold ${isWinner ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {percentage.toFixed(1)}%
                          </span>
                          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 w-12 text-right">
                            {votes} {votes === 1 ? 'vote' : 'votes'}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
              
              {/* Divider between questions, hidden for the last one */}
              {qIndex !== questions.length - 1 && (
                <div className="w-full h-px bg-gray-100 dark:bg-zinc-800 my-2" />
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default QuestionAnalytics;
