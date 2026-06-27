import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Clock, CalendarDays, ExternalLink, ArrowLeft } from 'lucide-react';
import { getEvent } from '../api/event.api';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';

import EventDetailsHeader from '../components/publicEvent/EventDetailsHeader';
import EventRegistrationSidebar from '../components/publicEvent/EventRegistrationSidebar';

const PublicEventPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getEvent(slug);
        
        // If event is private, ideally backend would block unless authorized, 
        // but if it reaches here we just show it if they have the direct link (slug/id).
        setEvent(data);
      } catch (err) {
        setError(err.message || 'Event not found or you do not have permission to view it.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchEventData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse tracking-wide">
          Loading event details...
        </p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Event Unavailable
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed mb-8">
          {error}
        </p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-black pb-20 selection:bg-indigo-500/30">
      
      {/* Top Nav bar (Minimal) */}
      <nav className="w-full h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-50 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="font-extrabold text-xl tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-gray-900 dark:text-white">Poll</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">Sphere</span>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Hero */}
        <EventDetailsHeader event={event} />

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Description & Details */}
          <div className="lg:col-span-8 w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
            
            {/* Quick Info Bar */}
            <div className="flex flex-wrap items-center gap-6 p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Date & Time</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {format(new Date(event.startDate), 'MMM d, yyyy • h:mm a')}
                  </p>
                </div>
              </div>
              <div className="w-px h-10 bg-gray-100 dark:bg-zinc-800 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Duration</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Ends {format(new Date(event.endDate), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            </div>

            {/* Thumbnail Image (If different from banner, or just to show it) */}
            {event.thumbnail && !event.banner && (
               <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800">
                 <img src={event.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
               </div>
            )}

            {/* About Section */}
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About this event</h2>
              
              <div 
                className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-indigo-500 hover:prose-a:text-indigo-400"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }}
              />

              {event.meetingLink && (
                <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-1">Meeting Link</h4>
                    <p className="text-sm text-indigo-700 dark:text-indigo-400">Join the virtual event using this link.</p>
                  </div>
                  <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm">
                    Join Now <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-4 w-full">
            <div className="sticky top-24">
              <EventRegistrationSidebar event={event} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PublicEventPage;
