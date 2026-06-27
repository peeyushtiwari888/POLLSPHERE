import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Loader2, AlertCircle, BarChart3, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getEventAnalyticsDashboard } from '../api/event.api';

import EventOverviewCards from '../components/eventAnalytics/EventOverviewCards';
import EventRegistrationChart from '../components/eventAnalytics/EventRegistrationChart';
import EventCategoryChart from '../components/eventAnalytics/EventCategoryChart';

const EventAnalyticsPage = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getEventAnalyticsDashboard();
      // the backend returns the data array with a single object because of $facet
      if (response.data && response.data.length > 0) {
        setAnalytics(response.data[0]);
      } else {
        setAnalytics({});
      }
    } catch (err) {
      setError(err.message || 'Failed to load event analytics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse tracking-wide">
          Crunching event data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Failed to load analytics
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
          {error}
        </p>
        <button 
          onClick={() => navigate('/events')}
          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm active:scale-95"
        >
          Back to Events
        </button>
      </div>
    );
  }

  // Extract raw counts from arrays (from $facet output)
  const extractCount = (arr) => (arr && arr.length > 0 ? arr[0].count : 0);

  const stats = {
    totalRegistrations: extractCount(analytics?.totalRegistrations),
    upcomingEvents: extractCount(analytics?.upcomingEvents),
    completedEvents: extractCount(analytics?.completedEvents),
    cancelledEvents: extractCount(analytics?.cancelledEvents),
    attendanceRate: analytics?.attendanceRate?.[0]?.averageAttendance || 0
  };

  return (
    <div className="w-full flex flex-col space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Event Analytics
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg">
            High-level overview of your event performance, registrations, and capacity utilization.
          </p>
        </div>

        <button 
          className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold rounded-xl transition-all shadow-sm hover:shadow active:scale-95 opacity-50 cursor-not-allowed"
          title="Coming soon"
        >
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* High-level KPIs */}
      <Suspense fallback={<div className="h-40 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
        <EventOverviewCards stats={stats} />
      </Suspense>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left Column (Registration Trend - 2/3 width) */}
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-96 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
            <EventRegistrationChart data={analytics?.monthlyRegistrations || []} />
          </Suspense>
        </div>

        {/* Right Column (Category Distribution - 1/3 width) */}
        <div className="lg:col-span-1">
          <Suspense fallback={<div className="h-96 bg-white dark:bg-zinc-900 rounded-3xl animate-pulse" />}>
            <EventCategoryChart data={analytics?.categoryDistribution || []} />
          </Suspense>
        </div>
        
      </div>
    </div>
  );
};

export default EventAnalyticsPage;
