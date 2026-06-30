import React, { useState } from 'react';
import { FileQuestion, Trophy, Users, CheckCircle2, Play, Square, Loader2, Clock, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';
import { toast } from 'react-hot-toast';
import { setActiveQuestion } from '../../api/poll.api';

/**
 * Question Analytics Component (Live Presenter Mode)
 * 
 * Renders a detailed breakdown of votes and percentages for every question.
 * Allows the presenter to select which question is currently visible to the audience.
 */
const QuestionAnalytics = ({ questions = [], pollId, activeQuestionId, activeQuestionStartTime, activeUsers = 0 }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  React.useEffect(() => {
    if (!activeQuestionId || !activeQuestionStartTime) return;
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeQuestionId, activeQuestionStartTime]);

  if (!questions || questions.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm text-center">
        <p className="text-gray-500 dark:text-gray-400">No question data available.</p>
      </div>
    );
  }

  const handleSetLive = async (questionId) => {
    if (isPublishing) return;
    try {
      setIsPublishing(true);
      // We no longer unpublish by clicking the same question. We only set it.
      const targetId = questionId;
      await setActiveQuestion(pollId, targetId);
      toast.success('Question published to audience!');
    } catch (error) {
      toast.error(error.message || 'Failed to update live question');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <FileQuestion className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Question Deck
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a question below to display it to your audience.
          </p>
        </div>
      </div>

      {/* Questions List (Sequential vertical order) */}
      <div className="flex flex-col gap-6">
        {questions.map((question, qIndex) => {
          
          const maxVotes = question.options ? question.options.reduce((max, opt) => Math.max(max, opt.votes || 0), 0) : 0;
          const questionId = question.questionId || question._id;
          const isCurrentlyLive = activeQuestionId === questionId;
          
          const durationMs = (question.duration || 30) * 1000;
          let timeLeft = 0;
          let hideCharts = false;
          if (isCurrentlyLive && activeQuestionStartTime) {
            const elapsed = currentTime - new Date(activeQuestionStartTime).getTime();
            timeLeft = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
            hideCharts = timeLeft > 0;
          }
          
          return (
            <div 
              key={questionId || qIndex} 
              className={`flex flex-col space-y-5 p-5 sm:p-6 rounded-2xl transition-all border-2 ${
                isCurrentlyLive
                  ? 'bg-orange-50/30 dark:bg-orange-500/5 border-orange-400 dark:border-orange-500 shadow-md ring-4 ring-orange-500/10'
                  : 'bg-gray-50/50 dark:bg-zinc-800/20 border-gray-100 dark:border-zinc-800/80 hover:border-orange-200 dark:hover:border-orange-500/30'
              }`}
            >
              
              {/* Presenter Controls Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-700/50 pb-4 mb-1">
                <div className="flex items-center gap-2">
                  {isCurrentlyLive ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 text-xs font-bold uppercase rounded-full animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Live Now
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-200 text-gray-600 dark:bg-zinc-800 dark:text-gray-400 text-xs font-bold uppercase rounded-full">
                      Draft / Hidden
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => handleSetLive(isCurrentlyLive ? null : questionId)}
                  disabled={isPublishing}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isCurrentlyLive
                      ? 'bg-red-500 text-white hover:bg-red-600 shadow-sm active:scale-95'
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm active:scale-95'
                  }`}
                >
                  {isPublishing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isCurrentlyLive ? (
                    <>
                      <Square className="w-4 h-4 fill-current" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      Publish Question
                    </>
                  )}
                </button>
              </div>

              {/* Question Title & Total Votes */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="text-base font-bold text-gray-900 dark:text-white leading-snug flex items-start">
                  <span className="text-gray-400 dark:text-gray-500 mr-2 font-medium shrink-0">Q{qIndex + 1}.</span>
                  <div className="[&>p]:m-0 inline-block" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.text) }} />
                </div>
                
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {isCurrentlyLive && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-sm transition-all ${
                      timeLeft > 0 
                        ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30' 
                        : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                    }`}>
                      <Clock className="w-4 h-4" />
                      {timeLeft > 0 ? `00:${timeLeft.toString().padStart(2, '0')}` : 'Time Up!'}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-lg border border-gray-100 dark:border-zinc-700">
                    <Users className="w-3.5 h-3.5" />
                    {isCurrentlyLive 
                      ? `${question.totalVotes || 0} / ${activeUsers} Responded`
                      : `${question.totalVotes || 0} Votes`
                    }
                  </div>
                </div>
              </div>

              {/* Options/Data Breakdown */}
              <div className="space-y-3 mt-4 relative">
                
                {isCurrentlyLive && hideCharts && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[2px] rounded-2xl border border-gray-200/50 dark:border-zinc-700/50">
                    <EyeOff className="w-8 h-8 text-orange-500 mb-2 animate-pulse" />
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Responses hidden during countdown</span>
                  </div>
                )}
                
                {/* CHOICE BASED QUESTIONS */}
                {['SINGLE_CHOICE', 'MULTI_SELECT'].includes(question.questionType) && question.options && (
                  <>
                    {question.options.map((option, oIndex) => {
                      const votes = option.votes || 0;
                      const percentage = option.percentage || 0;
                      const isWinner = votes === maxVotes && maxVotes > 0;

                      return (
                        <div 
                          key={option.optionId || oIndex}
                          className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                            isWinner 
                              ? 'bg-orange-50/50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/30' 
                              : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800'
                          }`}
                        >
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

                          <div className="flex items-center gap-4 shrink-0 z-10 w-full sm:w-1/2 justify-between sm:justify-end">
                            <div className="flex-1 max-w-[200px] h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${isWinner ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'bg-gray-300 dark:bg-zinc-600'}`}
                              />
                            </div>
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
                  </>
                )}

                {/* RATING BASED QUESTIONS */}
                {question.questionType === 'RATING' && (
                  <div className="w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Rating</span>
                    <span className="text-lg font-bold text-orange-500 flex items-center gap-1">
                      {question.averageRating || 0} <span className="text-gray-400 text-sm">/ 5</span>
                    </span>
                  </div>
                )}

                {/* TEXT BASED QUESTIONS */}
                {['OPEN_TEXT', 'WORD_CLOUD'].includes(question.questionType) && (
                  <div className="w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 block">Recent Responses:</span>
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {question.texts && question.texts.length > 0 ? (
                        question.texts.slice(-5).map((txt, i) => (
                          <div key={i} className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                            {txt}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">No responses yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default QuestionAnalytics;
