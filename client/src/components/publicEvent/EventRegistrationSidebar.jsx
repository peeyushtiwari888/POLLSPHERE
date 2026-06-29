import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Clock, MapPin, CheckCircle, Video, Users, Loader2 } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import { registerForEvent, cancelRegistration } from '../../api/event.api';
import toast from 'react-hot-toast';

const EventRegistrationSidebar = ({ event }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  // Derive status
  const now = new Date();
  const deadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
  const isExpired = deadline ? now > deadline : false;
  const isFull = event.maxParticipants && event.participantsCount >= event.maxParticipants;

  useEffect(() => {
    // Check local storage for quick UI sync (actual check happens on backend)
    if (localStorage.getItem(`event_reg_${event._id}`)) {
      setHasRegistered(true);
    }

    if (!deadline) {
      setTimeLeft('Always Open');
      return;
    }

    const timer = setInterval(() => {
      const diff = differenceInSeconds(deadline, new Date());
      
      if (diff <= 0) {
        setTimeLeft('Registration Closed');
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (3600 * 24));
      const hours = Math.floor((diff % (3600 * 24)) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      if (days > 0) setTimeLeft(`${days}d ${hours}h ${minutes}m left`);
      else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`);
      else setTimeLeft(`${minutes}m ${seconds}s left`);
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, event._id]);

  const [showForm, setShowForm] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleRegister = async (e) => {
    e?.preventDefault();
    
    if (!participantName || !mobileNumber) {
      toast.error('Please provide your name and mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerForEvent(event._id, { participantName, mobileNumber });
      setHasRegistered(true);
      setShowForm(false);
      localStorage.setItem(`event_reg_${event._id}`, 'true');
      toast.success('Successfully registered for the event!');
    } catch (err) {
      if (err.message === 'You are already registered for this event') {
        setHasRegistered(true);
        setShowForm(false);
        localStorage.setItem(`event_reg_${event._id}`, 'true');
        toast.success('You are already registered.');
      } else {
        toast.error(err.message || 'Failed to register. Please try again.');
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
      setParticipantName('');
      setMobileNumber('');
      localStorage.removeItem(`event_reg_${event._id}`);
      toast.success('Registration cancelled successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to cancel registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.shortDescription,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
      
      {/* Registration Section */}
      <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Registration</h3>
        
        {/* Registration CTA */}
        {hasRegistered ? (
          <div className="mb-6">
            <div className="w-full p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl flex items-center gap-3 text-green-700 dark:text-green-400 mb-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold">You're going!</p>
                <p className="text-sm opacity-90">Registration confirmed.</p>
              </div>
            </div>
            
            <button
              onClick={handleCancelRegistration}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Cancel Registration
            </button>
          </div>
        ) : showForm ? (
          <form onSubmit={handleRegister} className="mb-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="John Doe" 
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+1 234 567 8900" 
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !participantName || !mobileNumber}
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            disabled={isExpired || isFull}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 mb-6
              ${isExpired || isFull
                ? 'bg-gray-100 dark:bg-zinc-900 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 hover:-translate-y-0.5 active:scale-95'
              }
            `}
          >
            {isExpired ? 'Registration Closed' : isFull ? 'Event Full' : 'Register Now'}
          </button>
        )}

        {/* Countdown */}
        {!isExpired && !hasRegistered && event.registrationRequired && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 py-2 px-4 rounded-full">
            <Clock className="w-4 h-4" />
            <span>{timeLeft}</span>
          </div>
        )}
        
        {/* Capacity Indicator */}
        {event.maxParticipants && (
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-gray-500 dark:text-gray-400">Capacity</span>
              <span className="text-gray-900 dark:text-white">
                {event.participantsCount || 0} / {event.maxParticipants}
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-indigo-500'}`}
                style={{ width: `${Math.min(100, ((event.participantsCount || 0) / event.maxParticipants) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Details Snapshot */}
      <div className="p-6 bg-gray-50 dark:bg-zinc-900/50 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white dark:bg-zinc-800 text-indigo-500 rounded-lg shadow-sm">
            {event.type === 'ONLINE' ? <Video className="w-5 h-5" /> : event.type === 'HYBRID' ? <Users className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Location</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {event.type === 'ONLINE' ? 'Virtual Event' : event.venue}
            </p>
          </div>
        </div>
      </div>

      {/* QR Code & Share */}
      <div className="p-6 flex flex-col items-center border-t border-gray-100 dark:border-zinc-800">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
          <QRCodeSVG value={window.location.href} size={120} level="H" />
        </div>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6 max-w-[200px]">
          Scan this QR code to quickly access this page on your mobile device.
        </p>

        <button 
          onClick={shareEvent}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
        >
          <Share2 className="w-4 h-4" /> Share Event
        </button>
      </div>
      
    </div>
  );
};

export default EventRegistrationSidebar;
