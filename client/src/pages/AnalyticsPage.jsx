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
    socket.emit('joinPollRoom', pollId);

    // 2. Event Handlers
    const handleAnalyticsUpdated = (updatedData) => {
      // Direct payload replacement (fastest, backend does the aggregation)
      if (updatedData) setAnalytics(updatedData);
    };

    const handleResponseSubmitted = () => {
      // A new response arrived! Fetch fresh data in the background silently
      fetchAnalytics(false);
    };

    // 3. Attach Listeners
    socket.on('analyticsUpdated', handleAnalyticsUpdated);
    socket.on('responseSubmitted', handleResponseSubmitted);

    // 4. Cleanup on unmount
    return () => {
      socket.emit('leavePollRoom', pollId);
      socket.off('analyticsUpdated', handleAnalyticsUpdated);
      socket.off('responseSubmitted', handleResponseSubmitted);
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
          Bento-Box Grid Layout
      -------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left Column (Primary Data & Charts - Takes up 2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          
          {/* High-level KPIs */}
          <Suspense fallback={<div className="h-40 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
            <OverviewCards stats={analytics.overview} />
          </Suspense>
          
          {/* Time-Series Activity Chart */}
          <Suspense fallback={<div className="h-96 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
            <ResponseChart chartData={analytics.timeSeriesData} />
          </Suspense>

          {/* Granular Question-by-Question breakdown */}
          <Suspense fallback={<div className="h-96 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
            <QuestionAnalytics questions={analytics.questionsData} />
          </Suspense>

        </div>

        {/* Right Column (Secondary Widgets - Takes up 1/3 width on desktop) */}
        <div className="space-y-6 sm:space-y-8">
          
          {/* Participation / Demographics Widget */}
          <Suspense fallback={<div className="h-64 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
            <ParticipationCard stats={analytics.participation} />
          </Suspense>
          
          {/* Settings & Publish Controls */}
          <Suspense fallback={<div className="h-48 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
            <PublishResultsCard 
              pollId={pollId} 
              isPublished={analytics.poll?.isResultsPublished} 
            />
          </Suspense>

        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
