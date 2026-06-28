import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, PlusCircle, AlertCircle, Calendar, Search } from 'lucide-react';
import { getEvents } from '../api/event.api';
import EventTable from '../components/event/EventTable';

// We'll reuse the PollSearch and some generic styles, or create simple inline filters.
// Since we have PollSearch, we can use it, but let's build simple ones here for Event-specific fields to be safe.

const ManageEventsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, hasMore: false });

  // Filters from URL
  const activeStatus = searchParams.get('status') || '';
  const activeCategory = searchParams.get('category') || '';
  const activeType = searchParams.get('type') || '';
  const sortBy = searchParams.get('sort') || 'startDate';
  const sortOrder = searchParams.get('order') || 'desc';
  const initialSearch = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  const observerTarget = useRef(null);

  // Debounce search
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

  // Handlers for filters
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  // Fetch Data
  const fetchEvents = useCallback(async (page = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) setIsFetchingMore(true);
      else setIsLoading(true);
      setError(null);

      const params = {
        page,
        limit: 10,
        search: debouncedSearch,
        status: activeStatus,
        category: activeCategory,
        type: activeType,
        sortBy,
        sortOrder
      };

      // Clean empty params
      Object.keys(params).forEach(key => !params[key] && delete params[key]);

      const response = await getEvents(params);
      const newEvents = response?.data || [];
      const pagInfo = response?.pagination || { totalPages: 1, page: 1 };

      setEvents(prev => isLoadMore ? [...prev, ...newEvents] : newEvents);
      setPagination({
        page: pagInfo.page,
        totalPages: pagInfo.pages,
        hasMore: pagInfo.page < pagInfo.pages
      });
    } catch (err) {
      setError(err.message || 'Failed to load events. Please try again.');
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [debouncedSearch, activeStatus, activeCategory, activeType, sortBy, sortOrder]);

  // Initial load
  useEffect(() => {
    fetchEvents(1, false);
  }, [fetchEvents]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasMore && !isLoading && !isFetchingMore) {
          fetchEvents(pagination.page + 1, true);
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
  }, [observerTarget.current, pagination.hasMore, isLoading, isFetchingMore, fetchEvents, pagination.page]);

  return (
    <div className="w-full flex flex-col space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Manage Events
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg">
            Create, manage, and track registrations for all your upcoming and past events.
          </p>
        </div>

        <button 
          onClick={() => navigate('/events/create')}
          className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Event
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="w-full flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-500/10 rounded-2xl">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-red-600 dark:text-red-400 font-medium text-center">{error}</p>
          <button onClick={() => fetchEvents(1, false)} className="mt-4 px-4 py-2 bg-white dark:bg-zinc-800 text-red-500 rounded-lg hover:shadow-sm transition-shadow">
            Retry
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        {/* Search */}
        <div className="relative w-full xl:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text"
            placeholder="Search events by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-10 bg-gray-50/80 dark:bg-zinc-800/50 border border-transparent rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-200 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 transition-all duration-300"
          />
        </div>
        {/* Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={activeStatus} 
            onChange={(e) => updateFilter('status', e.target.value)}
            className="px-3 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select 
            value={activeType} 
            onChange={(e) => updateFilter('type', e.target.value)}
            className="px-3 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Types</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="HYBRID">Hybrid</option>
          </select>

          <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-1 py-1">
            <select 
              value={sortBy} 
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-transparent pl-2 pr-1 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="startDate">Start Date</option>
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
            </select>
            <span className="text-gray-300 dark:text-zinc-700">|</span>
            <select 
              value={sortOrder} 
              onChange={(e) => updateFilter('order', e.target.value)}
              className="bg-transparent pl-1 pr-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <Suspense fallback={<div className="h-64 bg-gray-50 dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
        <EventTable events={events} isLoading={isLoading} refreshData={() => fetchEvents(1, false)} />
      </Suspense>

      {/* Infinite Scroll Footer */}
      <div ref={observerTarget} className="py-8 flex flex-col items-center justify-center text-center">
        {isFetchingMore && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading more events...</p>
          </div>
        )}
        {!isFetchingMore && !pagination.hasMore && events.length > 0 && (
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-zinc-900/50 px-4 py-2 rounded-full">
            You've reached the end of the list.
          </p>
        )}
      </div>

    </div>
  );
};

export default ManageEventsPage;
