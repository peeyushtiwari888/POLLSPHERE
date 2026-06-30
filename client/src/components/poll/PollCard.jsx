import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { format, isPast, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// External action menu component
import PollActions from './PollActions';

/**
 * Modern & Minimal Poll Card
 */
const PollCard = ({ poll, onRefresh }) => {
  if (!poll) return null;

  const {
    _id,
    title = 'Untitled Poll',
    description,
    createdAt,
    expiryDate,
    responsesCount = 0,
  } = poll;

  const isExpired = expiryDate ? isPast(new Date(expiryDate)) : false;
  const currentStatus = isExpired ? 'EXPIRED' : (poll.status || 'DRAFT');

  let statusColor = '';
  let statusLabel = '';

  switch (currentStatus) {
    case 'EXPIRED':
      statusColor = 'bg-blue-500/10 text-blue-500 dark:text-blue-400';
      statusLabel = 'Completed';
      break;
    case 'PUBLISHED':
      statusColor = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400';
      statusLabel = 'Active';
      break;
    case 'SCHEDULED':
      statusColor = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400';
      statusLabel = 'Scheduled';
      break;
    default:
      statusColor = 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400';
      statusLabel = 'Draft';
      break;
  }

  const formattedCreated = createdAt ? format(new Date(createdAt), 'MMM d, yyyy') : 'Unknown';
  let formattedExpiry = 'Never expires';
  if (expiryDate) {
    const expiryObj = new Date(expiryDate);
    formattedExpiry = format(expiryObj, 'MMM d, yyyy');
  }

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden hover:border-gray-200 dark:hover:border-zinc-700 transition-all duration-300"
    >
      
      {/* Top Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md ${statusColor}`}>
            {statusLabel}
          </div>
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
            {formattedCreated}
          </span>
        </div>
        
        <div className="relative z-20">
          <React.Suspense fallback={<div className="w-8 h-8 bg-gray-50 dark:bg-zinc-800 rounded-lg animate-pulse" />}>
            <PollActions poll={poll} onRefresh={onRefresh} />
          </React.Suspense>
        </div>
      </div>

      {/* Main Content (Clickable) */}
      <Link to={`/analytics/${_id}`} className="px-5 py-2 flex-1 relative z-10 block focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg mx-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[40px]">
          {description || <span className="italic opacity-60">No description provided</span>}
        </p>
      </Link>

      {/* Metrics Footer */}
      <div className="px-5 py-4 mt-2 bg-gray-50/50 dark:bg-zinc-950/30 border-t border-gray-100 dark:border-zinc-800/80 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2.5">
          <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{responsesCount}</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Responses</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isExpired ? (
            <Calendar className="w-4 h-4 text-red-400" />
          ) : (
            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {formattedExpiry}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
              {isExpired ? 'Ended' : 'Ends'}
            </span>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default PollCard;
