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

  // Form State (tracks user answers)
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check local storage to see if this device already voted
        const submittedStatus = localStorage.getItem(`poll_submitted_${pollId}`);
        if (submittedStatus === 'true') {
          setHasSubmitted(true);
        }

        const data = await getPublicPoll(pollId);
        setPoll(data);
      } catch (err) {
        setError(err.message || 'Failed to load this poll. It may have been deleted or the link is invalid.');
      } finally {
        setIsLoading(false);
      }
    };

    if (pollId) {
      fetchPollData();
    }
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
