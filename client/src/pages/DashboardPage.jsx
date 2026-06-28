import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsCards from '../components/dashboard/StatsCards';
import QuickActions from '../components/dashboard/QuickActions'; // removed
import RecentPolls from '../components/dashboard/RecentPolls';
import EmptyState from '../components/dashboard/EmptyState';
import { getDashboardStats, getRecentPolls } from '../api/dashboard.api';
import useSocket from '../hooks/useSocket';
import GlobalLoader from '../components/common/GlobalLoader';

/**
 * Premium Dashboard Overview Page
 * 
 * Orchestrates the dashboard components and handles all business logic,
 * data fetching, loading states, and error handling for this route.
 */
const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const socket = useSocket();

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------
  const fetchDashboardData = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      setError(null);
      
      // Fetch both endpoints concurrently for optimal performance
      const [statsResponse, pollsResponse] = await Promise.all([
        getDashboardStats(),
        getRecentPolls(5)
      ]);
      
      setStats(statsResponse?.data || null);
      setPolls(pollsResponse?.data || []);
      
    } catch (err) {
      if (showLoader) {
        setError(err.message || 'Failed to load dashboard data. Please try again.');
      }
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // ---------------------------------------------------------------------------
  // REAL-TIME SOCKET INTEGRATION
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!socket) return;

    const handleDashboardUpdate = () => {
      // Data changed remotely (new poll, response, etc.) -> Silently refetch
      fetchDashboardData(false);
    };

    // Attach listeners for all relevant dashboard events
    socket.on('pollCreated', handleDashboardUpdate);
    socket.on('pollUpdated', handleDashboardUpdate);
    socket.on('responseSubmitted', handleDashboardUpdate);

    // Cleanup listeners on unmount
    return () => {
      socket.off('pollCreated', handleDashboardUpdate);
      socket.off('pollUpdated', handleDashboardUpdate);
      socket.off('responseSubmitted', handleDashboardUpdate);
    };
  }, [socket, fetchDashboardData]);

  // ---------------------------------------------------------------------------
  // RENDER: Loading State
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return <GlobalLoader text="Loading your workspace..." />;
  }

  // ---------------------------------------------------------------------------
  // RENDER: Error State
  // ---------------------------------------------------------------------------
  if (error) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          Something went wrong
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: Success State
  // ---------------------------------------------------------------------------
  const hasPolls = polls.length > 0;

  return (
    <div className="w-full flex flex-col space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* 1. Page Header */}
      <DashboardHeader />

      {/* 2. Key Metrics Row */}
      <section aria-label="Dashboard Statistics">
        <StatsCards stats={stats} />
      </section>

      {/* 3. Main Content */}
      <section 
        className="w-full flex flex-col items-start"
        aria-label="Dashboard Content"
      >
        <div className="w-full h-full flex flex-col">
          {hasPolls ? (
            <RecentPolls polls={polls} onRefresh={() => fetchDashboardData(false)} />
          ) : (
            <EmptyState 
              title="No polls created yet"
              description="Get started by creating your first poll. It only takes a few seconds to start gathering valuable insights from your audience."
              actionText="Create Your First Poll"
              onAction={() => navigate('/polls/create')}
            />
          )}
        </div>
      </section>

    </div>
  );
};

export default DashboardPage;
