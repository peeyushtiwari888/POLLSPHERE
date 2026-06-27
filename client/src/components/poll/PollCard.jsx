import React from 'react';
import { Calendar, Users, Clock, ArrowRight } from 'lucide-react';
import { format, isPast, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

// External action menu component (to be created next)
import PollActions from './PollActions';

/**
 * Premium Poll Card
 * 
 * Visually represents a single poll in the grid.
 * Displays metrics, status, and integrates the PollActions menu.
 */
const PollCard = ({ poll, onRefresh }) => {
  // Graceful fallback for missing data
  if (!poll) return null;

  const {
    _id,
    title = 'Untitled Poll',
    description,
    createdAt,
    expiryDate,
    responsesCount = 0, // Assuming backend populates this, fallback to 0
  } = poll;

  // Determine Status
  const isExpired = expiryDate ? isPast(new Date(expiryDate)) : false;
  const statusColor = isExpired 
    ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-500 border-red-100 dark:border-red-900/30' 
    : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';

  // Format Dates safely
  const formattedCreated = createdAt ? format(new Date(createdAt), 'MMM d, yyyy') : 'Unknown';
  
  let formattedExpiry = 'Never expires';
  let relativeExpiry = '';
  if (expiryDate) {
    const expiryObj = new Date(expiryDate);
    formattedExpiry = format(expiryObj, 'MMM d, yyyy');
    relativeExpiry = isExpired 
      ? `Expired ${formatDistanceToNow(expiryObj)} ago` 
      : `Ends in ${formatDistanceToNow(expiryObj)}`;
  }

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all duration-300"
    >
      
      {/* ------------------------------------------------------------------
          Header: Badges & Context Menu
      ------------------------------------------------------------------ */}
      <div className="p-5 pb-3 flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badge */}
          <div className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${statusColor}`}>
            {isExpired ? 'Expired' : 'Active'}
          </div>
          
          {/* Date Badge */}
          <div className="px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-950 rounded-lg border border-gray-100 dark:border-zinc-800">
            {formattedCreated}
          </div>
        </div>

        {/* 3-Dot Actions Menu (Pass the poll down so it can handle routing/deletion) */}
        <React.Suspense fallback={<div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />}>
          <PollActions poll={poll} onRefresh={onRefresh} />
        </React.Suspense>
      </div>

      {/* ------------------------------------------------------------------
          Body: Title & Description
      ------------------------------------------------------------------ */}
      <div className="px-5 py-2 flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500 italic">
            No description provided.
          </p>
        )}
      </div>

      {/* ------------------------------------------------------------------
          Metrics Row
      ------------------------------------------------------------------ */}
      <div className="px-5 py-4 mt-2 grid grid-cols-2 gap-4">
        
        {/* Responses Metric */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-md text-blue-500">
            <Users className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Responses</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{responsesCount}</span>
          </div>
        </div>

        {/* Expiry Metric */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <div className={`p-1.5 rounded-md ${isExpired ? 'bg-red-50 text-red-500 dark:bg-red-500/10' : 'bg-orange-50 text-orange-500 dark:bg-orange-500/10'}`}>
            {isExpired ? <Calendar className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">
              {isExpired ? 'Ended' : 'Ends'}
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white truncate" title={relativeExpiry || formattedExpiry}>
              {formattedExpiry}
            </span>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------------
          Footer: Quick View Button
      ------------------------------------------------------------------ */}
      <div className="border-t border-gray-100 dark:border-zinc-800 p-2">
        <a 
          href={`/polls/${_id}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all"
        >
          View Public Page
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

    </motion.div>
  );
};

export default PollCard;
