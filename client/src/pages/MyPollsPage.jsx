import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, PlusCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { getMyPolls } from '../api/poll.api';

// Shared UI Components
import EmptyState from '../components/dashboard/EmptyState';

// Poll-specific Child components
import PollGrid from '../components/poll/PollGrid';
import PollSearch from '../components/poll/PollSearch';
import PollFilters from '../components/poll/PollFilters';

/**
 * My Polls Page
 * 
 * Central hub for the user to manage their created polls.
 * Handles data fetching, global filtering state, and layout orchestration.
 * Assumes DashboardLayout is handled higher up in the routing layer.
 */
const MyPollsPage = () => {
  const navigate = useNavigate();
  
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Draft', 'Published', 'Expired'

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------
  const fetchPolls = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMyPolls();
      setPolls(response?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load your polls. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // ---------------------------------------------------------------------------
  // LOCAL FILTERING LOGIC
  // ---------------------------------------------------------------------------
  const filteredPolls = polls.filter((poll) => {
    // 1. Search Match
    const matchesSearch = poll.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Status Match
    const isExpired = poll.expiryDate ? new Date(poll.expiryDate) < new Date() : false;
    const isPublished = poll.isResultsPublished === true; 
    
    let matchesFilter = true;
    if (activeFilter === 'Expired') matchesFilter = isExpired;
    if (activeFilter === 'Published') matchesFilter = isPublished && !isExpired;
    if (activeFilter === 'Draft') matchesFilter = !isPublished && !isExpired;

    return matchesSearch && matchesFilter;
  });

  // ---------------------------------------------------------------------------
  // RENDER: LOADING STATE
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          Loading your polls...
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: ERROR STATE
  // ---------------------------------------------------------------------------
  if (error) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          Failed to load polls
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
          {error}
        </p>
        <button 
          onClick={fetchPolls}
          className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: MAIN PAGE UI
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full flex flex-col space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              My Polls
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg">
            Manage, analyze, and share your polls. Keep track of what your audience is saying.
          </p>
        </div>

        <button 
          onClick={() => navigate('/polls/create')}
          className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Poll
        </button>
      </div>

      {/* Main Content Area */}
      {polls.length === 0 ? (
        
        // Zero State
        <div className="py-12">
          <EmptyState 
            title="No polls created yet"
            description="You haven't created any polls yet. Start engaging with your audience by creating your very first poll!"
            actionText="Create Your First Poll"
            onAction={() => navigate('/polls/create')}
          />
        </div>

      ) : (
        
        // Active Grid View
        <div className="space-y-6">
          
          {/* Controls Bar (Search + Filters) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full md:w-96">
              <Suspense fallback={<div className="h-10 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />}>
                <PollSearch value={searchQuery} onChange={setSearchQuery} />
              </Suspense>
            </div>
            <div className="w-full md:w-auto">
              <Suspense fallback={<div className="h-10 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />}>
                <PollFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              </Suspense>
            </div>
          </div>

          {/* Render Responsive Grid */}
          <Suspense fallback={<div className="h-64 bg-gray-50 dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
            <PollGrid polls={filteredPolls} refreshData={fetchPolls} />
          </Suspense>
          
        </div>
      )}
    </div>
  );
};

export default MyPollsPage;
