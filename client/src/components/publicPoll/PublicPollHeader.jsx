import React from 'react';
import { HelpCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import DOMPurify from 'dompurify';

/**
 * Public Poll Header
 * 
 * Displays the core context of the poll to the respondent.
 * Handles aesthetic presentation of title, description, and metadata.
 */
const PublicPollHeader = ({ poll }) => {
  if (!poll) return null;

  // ---------------------------------------------------------------------------
  // Expiry Calculation Logic
  // ---------------------------------------------------------------------------
  let expiryDisplay = null;
  let isExpiringSoon = false;
  
  if (poll.expiryDate) {
    const expiryDate = new Date(poll.expiryDate);
    const now = new Date();
    
    if (expiryDate > now) {
      // e.g., "in 3 days" or "in about 2 hours"
      expiryDisplay = `Ends ${formatDistanceToNow(expiryDate, { addSuffix: true })}`;
      
      // Visually warn the user if it expires in less than 24 hours
      const msDifference = expiryDate.getTime() - now.getTime();
      isExpiringSoon = msDifference < 24 * 60 * 60 * 1000;
    } else {
      expiryDisplay = 'Expired';
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full bg-white dark:bg-zinc-900 p-6 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden">
      
      {/* Ambient background glow effect */}
      <div 
        className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />
      
      <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
        
        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            {poll.title}
          </h1>
          {poll.description && (
            <div 
              className="text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl prose dark:prose-invert prose-orange"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(poll.description) }}
            />
          )}
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-3">
          

        </div>
      </div>
    </div>
  );
};

export default PublicPollHeader;
