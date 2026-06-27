import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, BarChart3, Loader2, Sparkles } from 'lucide-react';
import { getPublicPoll } from '../api/publicPoll.api';

/**
 * Poll Submitted Page
 * 
 * A beautiful, distraction-free "Thank You" confirmation screen.
 * Intelligently checks if the creator has enabled public results and
 * displays a CTA to view them if available.
 */
const PollSubmittedPage = () => {
  const { pollId } = useParams();
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if public results are available for this specific poll
  useEffect(() => {
    const checkPollStatus = async () => {
      try {
        const poll = await getPublicPoll(pollId);
        setIsPublished(poll?.isResultsPublished === true);
      } catch (error) {
        // Silently fail if unable to fetch (maybe poll deleted immediately after submit)
        console.error('Failed to verify poll results status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (pollId) {
      checkPollStatus();
    } else {
      setIsLoading(false);
    }
  }, [pollId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-orange-500/30">
      
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2rem] p-8 sm:p-12 shadow-2xl border border-gray-100 dark:border-zinc-800 text-center relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* ------------------------------------------------------------------
            Ambient Background FX
        ------------------------------------------------------------------ */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-24 w-56 h-56 bg-green-500/20 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          
          {/* Success Illustration (Animated Icon) */}
          <div className="w-24 h-24 bg-green-50 dark:bg-green-500/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm border border-green-100 dark:border-green-900/30 animate-in slide-in-from-bottom-4 duration-700">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          {/* Typography */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Thank You!
          </h1>
          
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-sm mb-10 leading-relaxed">
            Your response has been successfully recorded. We appreciate you taking the time to share your feedback.
          </p>

          {/* ------------------------------------------------------------------
              Dynamic Action Buttons
          ------------------------------------------------------------------ */}
          <div className="w-full flex flex-col gap-4">
            
            {/* Conditional 'View Results' Button */}
            {isLoading ? (
              <div className="h-14 w-full bg-gray-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center animate-pulse border border-gray-100 dark:border-zinc-800">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            ) : isPublished ? (
              <Link
                to={`/results/${pollId}`}
                className="group flex items-center justify-center gap-3 w-full h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm active:scale-[0.98]"
              >
                <BarChart3 className="w-5 h-5 text-gray-400 group-hover:text-white dark:text-gray-500 dark:group-hover:text-gray-900 transition-colors" />
                View Public Results
              </Link>
            ) : null}

            {/* Default CTA */}
            <Link
              to="/"
              className={`group flex items-center justify-center gap-2 w-full h-14 font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all ${
                !isPublished && !isLoading 
                  ? 'bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm active:scale-[0.98]' 
                  : 'bg-transparent border border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4 text-orange-500 group-hover:text-orange-600 transition-colors" />
              Create Your Own Poll
            </Link>
            
          </div>

        </div>
      </div>
    </div>
  );
};

export default PollSubmittedPage;
