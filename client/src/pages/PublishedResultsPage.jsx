import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, BarChart3, Users, Lock, Trophy, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';

// Import the public results API
import { getPublishedPollResults } from '../api/publicPoll.api';

/**
 * Published Results Page
 * 
 * A completely public-facing page that displays the aggregated results of a poll.
 * Only accessible if the poll creator has explicitly published the results.
 */
const PublishedResultsPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();

  const [resultsData, setResultsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the published results on mount
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getPublishedPollResults(pollId);
        setResultsData(data);
      } catch (err) {
        // Backend should reject requests if isResultsPublished is false
        // We capture the friendly error message
        setError(err.message || 'Failed to load poll results.');
      } finally {
        setIsLoading(false);
      }
    };

    if (pollId) {
      fetchResults();
    }
  }, [pollId]);

  // ---------------------------------------------------------------------------
  // RENDER: LOADING STATE
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse tracking-wide">
          Loading poll results...
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: ERROR / PRIVATE STATE
  // ---------------------------------------------------------------------------
  if (error || !resultsData) {
    
    // Check if the error is specifically because results are private/unpublished
    const isPrivate = error && error.toLowerCase().includes('publish');
    
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-zinc-700">
          {isPrivate ? (
            <Lock className="w-10 h-10 text-gray-400" />
          ) : (
            <AlertCircle className="w-10 h-10 text-red-500" />
          )}
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          {isPrivate ? 'Results are Private' : 'Failed to load results'}
        </h2>
        
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed text-lg">
          {isPrivate 
            ? 'The creator of this poll has not published the results yet. Check back later to see how everyone voted.'
            : (error || 'We could not fetch the results for this poll.')}
        </p>
        
        <button 
          onClick={() => navigate(`/poll/${pollId}`)}
          className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-md active:scale-95"
        >
          View Poll
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: MAIN PUBLIC RESULTS PAGE
  // ---------------------------------------------------------------------------
  const { poll, questions } = resultsData;

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-12 flex flex-col space-y-12 animate-in fade-in duration-500">
      
      {/* --------------------------------------------------------
          Header Section
      -------------------------------------------------------- */}
      <div className="flex flex-col items-center text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-sm font-bold tracking-wide uppercase border border-purple-100 dark:border-purple-500/20 shadow-sm">
          <BarChart3 className="w-4 h-4" />
          Live Results
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            {poll?.title || 'Poll Results'}
          </h1>
          {poll?.description && (
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {poll.description}
            </p>
          )}
        </div>

        {/* Global Stats */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2.5 px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Responses</span>
              <span className="text-lg font-extrabold text-gray-900 dark:text-white leading-none">
                {poll?.totalResponses?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* --------------------------------------------------------
          Questions Breakdown
      -------------------------------------------------------- */}
      <div className="space-y-8">
        {(questions || []).map((question, qIndex) => {
          // Identify max votes to mark the winner visually
          const maxVotes = (question.options || []).reduce((max, opt) => Math.max(max, opt.votes || 0), 0);
          const totalQuestionVotes = (question.options || []).reduce((sum, opt) => sum + (opt.votes || 0), 0);

          return (
            <div 
              key={question._id || qIndex} 
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col space-y-6"
            >
              {/* Question Title */}
              <div className="flex flex-col gap-2 border-b border-gray-100 dark:border-zinc-800 pb-4">
                <span className="text-sm font-bold text-orange-500 tracking-wider uppercase">
                  Question {qIndex + 1}
                </span>
                <div className="flex justify-between items-start gap-4">
                  <div 
                    className="text-xl font-bold text-gray-900 dark:text-white leading-snug [&>p]:m-0 inline-block"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.text) }}
                  />
                  <div className="shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800 px-3 py-1 rounded-full">
                    {totalQuestionVotes} Votes
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {(question.options || []).map((option, oIndex) => {
                  const votes = option.votes || 0;
                  const percentage = option.percentage || 0;
                  const isWinner = votes === maxVotes && maxVotes > 0;

                  return (
                    <div key={option._id || oIndex} className="relative group">
                      
                      {/* Interactive Background Fill */}
                      <div className="absolute inset-0 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800/80">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.1 * oIndex }}
                          className={`h-full ${
                            isWinner 
                              ? 'bg-orange-100 dark:bg-orange-500/20 border-r-2 border-orange-500' 
                              : 'bg-gray-100 dark:bg-zinc-700/50 border-r-2 border-gray-300 dark:border-zinc-600'
                          }`}
                        />
                      </div>

                      {/* Content Overlay */}
                      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                        
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {isWinner ? (
                            <div className="shrink-0 p-1 bg-white dark:bg-zinc-800 text-orange-500 rounded-full shadow-sm">
                              <Trophy className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="shrink-0 p-1 text-gray-400">
                              <CheckCircle2 className="w-4 h-4 opacity-50" />
                            </div>
                          )}
                          <span className={`text-base font-medium truncate ${isWinner ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                            {option.text}
                          </span>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 ml-7 sm:ml-0">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {votes} {votes === 1 ? 'vote' : 'votes'}
                          </span>
                          <span className={`text-lg font-bold w-16 text-right ${isWinner ? 'text-orange-500' : 'text-gray-900 dark:text-white'}`}>
                            {percentage.toFixed(1)}%
                          </span>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default PublishedResultsPage;
