import React, { useState, useEffect } from 'react';
import { Radio, Users, Clock, Vote, Activity } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter.jsx';
import { expirePoll } from '../../api/poll.api.js';
import toast from 'react-hot-toast';

const LiveTopBar = ({ stats, isOrganizer, pollId, activeUsers = 0 }) => {
  const { title = 'Live Event', status, totalResponses = 0, totalParticipants = 0, timeRemaining = 0 } = stats || {};
  
  const [timeLeft, setTimeLeft] = useState(timeRemaining);
  const [hasExpired, setHasExpired] = useState(status === 'EXPIRED');

  useEffect(() => {
    setTimeLeft(timeRemaining);
    if (timeRemaining <= 0 || status === 'EXPIRED') {
      setHasExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          clearInterval(timer);
          handleExpire();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, status]);

  const handleExpire = async () => {
    if (hasExpired) return;
    setHasExpired(true);
    
    // Only the organizer triggers the backend expiration
    if (isOrganizer && pollId) {
      try {
        await expirePoll(pollId);
        toast('The poll timer has ended', { icon: '🛑' });
      } catch (err) {
        console.error('Failed to expire poll', err);
      }
    }
  };

  const formatTime = (ms) => {
    if (hasExpired || ms <= 0) return 'This poll has ended.';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isLive = (status === 'PUBLISHED' || status === 'ACTIVE') && !hasExpired;

  return (
    <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold tracking-wide ${isLive ? 'bg-red-50 dark:bg-red-500/10 text-red-500 border border-red-200 dark:border-red-900/30' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'}`}>
          <Radio className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
          {isLive ? 'LIVE' : 'CLOSED'}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate max-w-xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 relative">
            <Activity className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full animate-ping"></span>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              <AnimatedCounter value={activeUsers} />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              <AnimatedCounter value={totalParticipants} />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Responses</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              <AnimatedCounter value={totalResponses} />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Left</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight tabular-nums">{formatTime(timeLeft)}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LiveTopBar;
