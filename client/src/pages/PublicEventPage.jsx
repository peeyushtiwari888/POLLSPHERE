import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CalendarDays, Clock, MapPin, User, CheckCircle, Video, ArrowLeft, Share2, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getEvent, registerForEvent, cancelRegistration } from '../api/event.api';
import DOMPurify from 'dompurify';
import { format, differenceInSeconds } from 'date-fns';
import toast from 'react-hot-toast';

import EventDetailsHeader from '../components/publicEvent/EventDetailsHeader';

const PublicEventPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registration states
  const [participantName, setParticipantName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        const response = await getEvent(slug);
        const eventData = response?.data || response;
        setEvent(eventData);

        if (localStorage.getItem(`event_reg_${eventData._id}`)) {
          setHasRegistered(true);
        }
      } catch (err) {
        setError(err.message || 'Event not found or unavailable.');
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchEventData();
  }, [slug]);

  useEffect(() => {
    if (!event) return;
    const deadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
    
    if (!deadline) {
      setTimeLeft('Open');
      return;
    }

    const timer = setInterval(() => {
      const diff = differenceInSeconds(deadline, new Date());
      if (diff <= 0) {
        setTimeLeft('Closed');
        clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / (3600 * 24));
      const hours = Math.floor((diff % (3600 * 24)) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      if (days > 0) setTimeLeft(`${days}d ${hours}h left`);
      else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m left`);
      else setTimeLeft(`${minutes}m left`);
    }, 1000);

    return () => clearInterval(timer);
  }, [event]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!participantName || !mobileNumber) {
      toast.error('Name and mobile number are required');
      return;
    }
    setIsSubmitting(true);
    try {
      await registerForEvent(event._id, { participantName, mobileNumber });
      setHasRegistered(true);
      localStorage.setItem(`event_reg_${event._id}`, 'true');
      toast.success('Registration successful!');
    } catch (err) {
      if (err.message === 'You are already registered for this event') {
        setHasRegistered(true);
        localStorage.setItem(`event_reg_${event._id}`, 'true');
        toast.success('You are already registered.');
      } else {
        toast.error(err.message || 'Failed to register.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRegistration = async () => {
    setIsSubmitting(true);
    try {
      await cancelRegistration(event._id);
      setHasRegistered(false);
      localStorage.removeItem(`event_reg_${event._id}`);
      setParticipantName('');
      setMobileNumber('');
      toast.success('Registration cancelled.');
    } catch (err) {
      toast.error(err.message || 'Failed to cancel registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Event Unavailable</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
          Return Home
        </button>
      </div>
    );
  }

  const isClosed = timeLeft === 'Closed';
  const isFull = event.maxParticipants && event.participantsCount >= event.maxParticipants;
  const canRegister = !isClosed && !isFull && event.status === 'PUBLISHED';

  return (
    <div className="w-full min-h-screen bg-gray-50/50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 selection:bg-indigo-500/30 pb-20">
      
      {/* Simple Header */}
      <header className="w-full bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-zinc-800/80 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="font-extrabold text-lg tracking-tight cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-gray-900 dark:text-white">Poll</span>
            <span className="text-indigo-500">Sphere</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 pb-16">
        
        {/* Original Top Header Component */}
        <EventDetailsHeader event={event} />

        {/* Main Event Content (Description & Hosted By) */}
        <div className="max-w-4xl mx-auto w-full mt-12 mb-16 space-y-10">
          {/* Event Media / Thumbnail if no banner */}
          {!event.banner && event.thumbnail && (
            <div className="w-full aspect-video rounded-3xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-sm bg-gray-100 dark:bg-zinc-900">
              <img src={event.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Hosted By */}
          {event.organizer && (
            <div className="flex items-center gap-5 py-8 border-y border-gray-100 dark:border-zinc-800/80">
              {event.organizer.profilePicture ? (
                <img src={event.organizer.profilePicture} alt={event.organizer.name} className="w-14 h-14 rounded-full object-cover bg-gray-100 dark:bg-zinc-800 ring-2 ring-indigo-500/20" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold ring-2 ring-indigo-500/20">
                  {event.organizer.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Hosted by</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{event.organizer.name}</p>
              </div>
            </div>
          )}

          {/* Full Description */}
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">About this event</h3>
            <div 
              className="prose prose-lg prose-gray dark:prose-invert max-w-none prose-a:text-indigo-500 prose-img:rounded-2xl leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }}
            />
          </div>
        </div>

        {/* 3-Column Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-8">
          
          {/* Card 1: Event Details */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />
            
            <h3 className="font-extrabold text-gray-900 dark:text-white mb-6 text-xl tracking-tight">Event Details</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-2xl shrink-0">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Date and Time</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Location</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium break-words">
                    {event.type === 'ONLINE' ? 'Online Virtual Event' : event.venue}
                  </p>
                  {event.meetingLink && hasRegistered && (
                    <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors rounded-lg mt-3">
                      Join Meeting <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Reserve Spot */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative overflow-hidden h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-xl tracking-tight">Reserve Spot</h3>
              {event.registrationRequired && (
                <span className="text-xs font-bold px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-sm">
                  {timeLeft}
                </span>
              )}
            </div>

            {!event.registrationRequired ? (
              <div className="text-center p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 border-dashed h-full flex items-center justify-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This event does not require registration. Just join at the scheduled time!</p>
              </div>
            ) : hasRegistered ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl text-green-700 dark:text-green-400 text-center">
                  <CheckCircle className="w-10 h-10 mb-3" />
                  <p className="font-bold text-lg">You're registered!</p>
                  <p className="text-xs mt-1 opacity-80">See you at the event.</p>
                </div>
                <button onClick={handleCancelRegistration} disabled={isSubmitting} className="w-full py-3 text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors rounded-xl border border-transparent hover:border-red-100 dark:hover:border-red-900/30">
                  {isSubmitting ? 'Processing...' : 'Cancel Reservation'}
                </button>
              </div>
            ) : event.status === 'DRAFT' ? (
              <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-500/10 rounded-2xl border border-yellow-200 dark:border-yellow-900/30 h-full flex items-center justify-center">
                <p className="text-sm font-bold text-yellow-700 dark:text-yellow-500">Event is currently in draft.</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Full Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    required
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Mobile Number <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    placeholder="+1 234 567 890"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 dark:text-white font-medium"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !canRegister}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] shadow-lg hover:shadow-xl
                    ${!canRegister
                      ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                    }
                  `}
                >
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isClosed ? 'Registration Closed' : isFull ? 'Event Full' : 'Secure Your Spot'}
                </button>
              </form>
            )}
          </div>

          {/* Card 3: Share action & QR Code */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex flex-col items-center justify-between text-center h-full">
            <div className="w-full">
              <h3 className="font-extrabold text-gray-900 dark:text-white mb-2 text-xl tracking-tight">Scan to Share</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">Scan this QR code to quickly open the event page on any device.</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-white rounded-2xl shadow-inner border border-gray-100 inline-block mb-6">
              <QRCodeSVG 
                value={window.location.href} 
                size={140} 
                level="H"
                includeMargin={false}
                className="rounded-lg"
              />
            </div>

            <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 rounded-xl">
              <Share2 className="w-4 h-4" /> Copy Event Link
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PublicEventPage;
