import React from 'react';
import { HelpCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import DOMPurify from 'dompurify';
import { Volume2, VolumeX } from 'lucide-react';
import { useContext } from 'react';
import { SoundContext } from '../../context/SoundContext';

/**
 * Public Poll Header
 * 
 * Displays the core context of the poll to the respondent.
 * Handles aesthetic presentation of title, description, and metadata.
 */
const PublicPollHeader = ({ poll }) => {
  const { isMuted, toggleMute } = useContext(SoundContext);

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
        
        {/* Top Actions */}
        <div className="flex justify-end w-full">
          <button
            onClick={toggleMute}
            className="flex items-center justify-center p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors shadow-sm"
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

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
