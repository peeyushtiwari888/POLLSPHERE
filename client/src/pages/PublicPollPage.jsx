import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getPublicPoll, submitPollResponse } from '../api/publicPoll.api';

// Child Components (To be implemented next)
import PublicPollHeader from '../components/publicPoll/PublicPollHeader';
import PublicQuestionList from '../components/publicPoll/PublicQuestionList';
import SubmitPollButton from '../components/publicPoll/SubmitPollButton';
import PollExpired from '../components/publicPoll/PollExpired';
import PollAlreadySubmitted from '../components/publicPoll/PollAlreadySubmitted';

/**
 * Public Poll Page
 * 
 * The main container for respondents to view and interact with a poll.
 * Handles fetching, status checks (expired/submitted), and responsive layout.
 */
const PublicPollPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [poll, setPoll] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [needsCode, setNeedsCode] = useState(false);
  const [codeInput, setCodeInput] = useState('');

  // Form State (tracks user answers)
  const [answers, setAnswers] = useState({});

  const fetchPollData = async (code = '') => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check local storage to see if this device already voted
      const submittedStatus = localStorage.getItem(`poll_submitted_${pollId}`);
      if (submittedStatus === 'true') {
        setHasSubmitted(true);
      }

      const data = await getPublicPoll(pollId, code);
      setPoll(data);
      setNeedsCode(false); // Reset if successful
    } catch (err) {
      if (err.message === 'PARTICIPATION_CODE_REQUIRED' || err.message === 'INVALID_PARTICIPATION_CODE') {
        setNeedsCode(true);
        if (err.message === 'INVALID_PARTICIPATION_CODE') {
          toast.error('Invalid participation code');
        }
      } else {
        setError(err.message || 'Failed to load this poll. It may have been deleted or the link is invalid.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pollId && !needsCode) {
      fetchPollData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollId]);

  // ---------------------------------------------------------------------------
  // SUBMISSION LOGIC
  // ---------------------------------------------------------------------------
  const handleSubmit = async () => {
    // 1. Validate required questions
    const missingRequired = poll.questions?.find(
      (q) => q.isRequired && !answers[q._id]
    );

    if (missingRequired) {
      toast.error('Please answer all required questions.');
      return;
    }

    // 2. Prevent blank submissions (if no questions were strictly required)
    if (Object.keys(answers).length === 0) {
      toast.error('Please answer at least one question before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 3. Format payload for the backend
      const payload = {
        responses: Object.entries(answers).map(([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId
        }))
      };

      await submitPollResponse(pollId, payload);
      
      // 4. Update local storage (client-side enforcement)
      localStorage.setItem(`poll_submitted_${pollId}`, 'true');
      
      // 5. Success UI & Redirect
      toast.success('Your response has been submitted!');
      navigate(`/poll/${pollId}/success`);
      
    } catch (err) {
      toast.error(err.message || 'Failed to submit response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER: Loading State
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse tracking-wide">
          Loading poll securely...
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: Needs Participation Code State
  // ---------------------------------------------------------------------------
  if (needsCode) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="w-full max-w-md bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 dark:border-orange-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Private Poll</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">This poll is protected. Please enter the participation code to join.</p>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); fetchPollData(codeInput); }}
            className="w-full space-y-4"
          >
            <input 
              type="text"
              placeholder="Enter Code"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-xl text-center text-xl font-bold tracking-widest text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all uppercase"
            />
            <button 
              type="submit"
              disabled={!codeInput.trim()}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              Join Poll
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: Error State (404, Network error, etc)
  // ---------------------------------------------------------------------------
  if (error || !poll) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Poll Unavailable
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed mb-8">
          {error || "We couldn't find the poll you're looking for."}
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: Expired State
  // ---------------------------------------------------------------------------
  const isExpired = poll.expiryDate ? new Date(poll.expiryDate) < new Date() : false;
  if (isExpired) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
        <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin" />}>
          <PollExpired poll={poll} />
        </Suspense>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: Already Submitted State
  // ---------------------------------------------------------------------------
  if (hasSubmitted) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
        <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin" />}>
          <PollAlreadySubmitted poll={poll} />
        </Suspense>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: Active Public Poll Form
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-black py-10 px-4 sm:px-6 lg:px-8 selection:bg-orange-500/30">
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in zoom-in-[0.98] duration-500">
        
        {/* Header: Title and Description */}
        <Suspense fallback={<div className="h-32 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
          <PublicPollHeader poll={poll} />
        </Suspense>

        {/* Questions List */}
        <Suspense fallback={<div className="h-96 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
          <PublicQuestionList 
            questions={poll.questions} 
            answers={answers} 
            setAnswers={setAnswers} 
          />
        </Suspense>

        {/* Submit Action */}
        <Suspense fallback={<div className="h-16 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
          <SubmitPollButton 
            poll={poll} 
            answers={answers}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit} 
          />
        </Suspense>

      </div>
    </div>
  );
};

export default PublicPollPage;
