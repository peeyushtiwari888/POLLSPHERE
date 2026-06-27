import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsCards from '../components/dashboard/StatsCards';
import QuickActions from '../components/dashboard/QuickActions';
import RecentPolls from '../components/dashboard/RecentPolls';
import EmptyState from '../components/dashboard/EmptyState';
import { getDashboardStats, getRecentPolls } from '../api/dashboard.api';

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

  // Fetch Dashboard Data on Mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch both endpoints concurrently for optimal performance
        const [statsResponse, pollsResponse] = await Promise.all([
          getDashboardStats(),
          getRecentPolls(5)
        ]);
        
        setStats(statsResponse?.data || null);
        setPolls(pollsResponse?.data || []);
        
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ---------------------------------------------------------------------------
  // RENDER: Loading State
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          Loading your workspace...
        </p>
      </div>
    );
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

      {/* 3. Main Content Split */}
      <section 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start"
        aria-label="Dashboard Content"
      >
        
        {/* Left/Main Column: Polls Table OR Empty State (Takes up 2/3 on desktop) */}
        <div className="lg:col-span-2 h-full flex flex-col">
          {hasPolls ? (
            <RecentPolls polls={polls} />
          ) : (
            <EmptyState 
              title="No polls created yet"
              description="Get started by creating your first poll. It only takes a few seconds to start gathering valuable insights from your audience."
              actionText="Create Your First Poll"
              onAction={() => navigate('/polls/create')}
            />
          )}
        </div>

        {/* Right Column: Quick Actions (Takes up 1/3 on desktop) */}
        <div className="lg:col-span-1 h-full">
          <QuickActions />
        </div>
        
      </section>

    </div>
  );
};

export default DashboardPage;
