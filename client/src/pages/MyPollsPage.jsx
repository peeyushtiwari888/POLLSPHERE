import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, PlusCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { getMyPolls } from '../api/poll.api';

// Shared UI Components
import EmptyState from '../components/dashboard/EmptyState';

// Poll-specific Child components
import PollGrid from '../components/poll/PollGrid';
import PollSearch from '../components/poll/PollSearch';
import PollFilters from '../components/poll/PollFilters';
import PollSort from '../components/poll/PollSort';

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
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Initial/Filter load
  const [isFetchingMore, setIsFetchingMore] = useState(false); // Pagination load
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, hasMore: false });
  
  const activeFilter = searchParams.get('filter') || 'All';
  const sortBy = searchParams.get('sort') || 'Latest';
  const initialSearch = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  const observerTarget = useRef(null);

  // ---------------------------------------------------------------------------
  // DEBOUNCE & URL SYNC
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      const newParams = new URLSearchParams(searchParams);
      if (searchQuery) newParams.set('q', searchQuery);
      else newParams.delete('q');
      setSearchParams(newParams, { replace: true });
    }, 400); 
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFilterChange = (filter) => {
    const newParams = new URLSearchParams(searchParams);
    if (filter === 'All') newParams.delete('filter');
    else newParams.set('filter', filter);
    setSearchParams(newParams);
  };

  const handleSortChange = (sort) => {
    const newParams = new URLSearchParams(searchParams);
    if (sort === 'Latest') newParams.delete('sort');
    else newParams.set('sort', sort);
    setSearchParams(newParams);
  };

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------
  const fetchPolls = useCallback(async (page = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) setIsFetchingMore(true);
      else setIsLoading(true);
      setError(null);

      const params = {
        page,
        limit: 9, // Number of items per page
        q: debouncedSearch,
        filter: activeFilter,
        sort: sortBy
      };

      const response = await getMyPolls(params);
      const newPolls = response?.data || [];
      const pagInfo = response?.pagination || { totalPages: 1, page: 1 };

      setPolls(prev => isLoadMore ? [...prev, ...newPolls] : newPolls);
      setPagination({
        page: pagInfo.page,
        totalPages: pagInfo.totalPages,
        hasMore: pagInfo.page < pagInfo.totalPages
      });
    } catch (err) {
      setError(err.message || 'Failed to load your polls. Please try again.');
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [debouncedSearch, activeFilter, sortBy]);

  // Initial load & when filters change
  useEffect(() => {
    fetchPolls(1, false);
  }, [fetchPolls]);

  // ---------------------------------------------------------------------------
  // INFINITE SCROLL OBSERVER
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasMore && !isLoading && !isFetchingMore) {
          fetchPolls(pagination.page + 1, true);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget.current, pagination.hasMore, isLoading, isFetchingMore, fetchPolls, pagination.page]);

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
          
          {/* Controls Bar (Search + Filters + Sort) */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="w-full xl:w-96">
              <Suspense fallback={<div className="h-10 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />}>
                <PollSearch value={searchQuery} onChange={setSearchQuery} />
              </Suspense>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
              <div className="w-full sm:w-auto overflow-hidden">
                <Suspense fallback={<div className="h-10 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />}>
                  <PollFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />
                </Suspense>
              </div>
              <div className="w-full sm:w-48 flex-shrink-0">
                <Suspense fallback={<div className="h-10 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />}>
                  <PollSort activeSort={sortBy} onSortChange={handleSortChange} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Render Responsive Grid */}
          <Suspense fallback={<div className="h-64 bg-gray-50 dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
            <PollGrid polls={polls} refreshData={() => fetchPolls(1, false)} />
          </Suspense>

          {/* Infinite Scroll Footer */}
          <div ref={observerTarget} className="py-8 flex flex-col items-center justify-center text-center">
            {isFetchingMore && (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading more polls...</p>
              </div>
            )}
            {!isFetchingMore && !pagination.hasMore && polls.length > 0 && (
              <p className="text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-zinc-900/50 px-4 py-2 rounded-full">
                You've reached the end of the list.
              </p>
            )}
            {error && !isLoading && polls.length > 0 && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm font-medium text-red-500">{error}</p>
                <button 
                  onClick={() => fetchPolls(pagination.page + 1, true)}
                  className="px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default MyPollsPage;
