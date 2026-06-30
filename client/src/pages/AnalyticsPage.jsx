import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';

// Socket hook
import useSocket from '../hooks/useSocket';
import GlobalLoader from '../components/common/GlobalLoader';

// API (To be implemented later)
import { getPollAnalytics } from '../api/analytics.api';

// Child Components (To be implemented next)
import AnalyticsHeader from '../components/analytics/AnalyticsHeader';
import OverviewCards from '../components/analytics/OverviewCards';
import ResponseChart from '../components/analytics/ResponseChart';
import QuestionAnalytics from '../components/analytics/QuestionAnalytics';
import ParticipationCard from '../components/analytics/ParticipationCard';
import PublishResultsCard from '../components/analytics/PublishResultsCard';

/**
 * Analytics Dashboard Page
 * 
 * The main container for viewing deep insights into a specific poll.
 * Fetches the massive analytics payload and distributes it to child widget components.
 */
const AnalyticsPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeUsers, setActiveUsers] = useState(0);

  const socket = useSocket();

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------
  const fetchAnalytics = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      setError(null);
      
      const data = await getPollAnalytics(pollId);
      setAnalytics(data);
    } catch (err) {
      // Only set error if it's the initial load, to avoid ruining the UI on background syncs
      if (showLoader) {
        setError(err.message || 'Failed to load analytics data. Please try again.');
      }
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, [pollId]);

  // Initial Fetch
  useEffect(() => {
    if (pollId) {
      fetchAnalytics(true);
    }
  }, [pollId, fetchAnalytics]);

  // ---------------------------------------------------------------------------
  // REAL-TIME SOCKET INTEGRATION
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!socket || !pollId) return;

    // 1. Join a dedicated room for this specific poll
    socket.emit('join-poll', pollId);

    // 2. Event Handlers
    const handleAnalyticsUpdated = (updatedData) => {
      // Direct payload replacement (fastest, backend does the aggregation)
      if (updatedData) setAnalytics(updatedData);
    };

    const handleResponseSubmitted = () => {
      // A new response arrived! Fetch fresh data in the background silently
      fetchAnalytics(false);
    };

    const handleActiveQuestionChanged = (data) => {
      const newActiveQuestionId = data?.questionId !== undefined ? data.questionId : data;
      const newActiveQuestionStartTime = data?.startTime || null;
      
      setAnalytics(prev => {
        if (!prev || !prev.poll) return prev;
        return {
          ...prev,
          poll: {
            ...prev.poll,
            activeQuestionId: newActiveQuestionId,
            activeQuestionStartTime: newActiveQuestionStartTime
          }
        };
      });
    };

    const handleActiveUsersUpdate = (count) => {
      setActiveUsers(count);
    };

    // 3. Attach Listeners
    socket.on('analyticsUpdated', handleAnalyticsUpdated);
    socket.on('responseSubmitted', handleResponseSubmitted);
    socket.on('active-question-changed', handleActiveQuestionChanged);
    socket.on('active-users-update', handleActiveUsersUpdate);

    // 4. Cleanup on unmount
    return () => {
      socket.emit('leave-poll', pollId);
      socket.off('analyticsUpdated', handleAnalyticsUpdated);
      socket.off('responseSubmitted', handleResponseSubmitted);
      socket.off('active-question-changed', handleActiveQuestionChanged);
      socket.off('active-users-update', handleActiveUsersUpdate);
    };
  }, [socket, pollId, fetchAnalytics]);

  // ---------------------------------------------------------------------------
  // RENDER: LOADING STATE
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return <GlobalLoader text="Crunching the numbers..." />;
  }

  // ---------------------------------------------------------------------------
  // RENDER: ERROR STATE
  // ---------------------------------------------------------------------------
  if (error || !analytics) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Failed to load analytics
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
          {error || 'No analytics data could be processed for this poll.'}
        </p>
        <button 
          onClick={() => navigate('/polls')}
          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm active:scale-95"
        >
          Back to My Polls
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: MAIN DASHBOARD
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full flex flex-col space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* --------------------------------------------------------
          Header Section
      -------------------------------------------------------- */}
      <Suspense fallback={<div className="h-32 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
        <AnalyticsHeader poll={analytics.poll} />
      </Suspense>

      {/* --------------------------------------------------------
          Live Presenter Mode (Question Control)
      -------------------------------------------------------- */}
      <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-2">Live Presenter Mode Active</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          Your audience will only see the question you choose to publish below. You have full control over the pace of the poll.
        </p>

        <Suspense fallback={<div className="h-96 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
          <QuestionAnalytics 
            questions={analytics.questionsData} 
            pollId={pollId}
            activeQuestionId={analytics.poll?.activeQuestionId}
            activeQuestionStartTime={analytics.poll?.activeQuestionStartTime}
            activeUsers={activeUsers}
          />
        </Suspense>
      </div>

    </div>
  );
};

export default AnalyticsPage;
