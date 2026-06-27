import React from 'react';
import { Calendar, MapPin, Users, Video, Clock } from 'lucide-react';
import { format } from 'date-fns';

const EventPreviewCard = ({ event }) => {
  const {
    title,
    shortDescription,
    category,
    type,
    venue,
    startDate,
    endDate,
    thumbnail,
    status,
    visibility
  } = event;

  const getTypeIcon = (eventType) => {
    switch (eventType) {
      case 'ONLINE': return <Video className="w-4 h-4" />;
      case 'OFFLINE': return <MapPin className="w-4 h-4" />;
      case 'HYBRID': return <Users className="w-4 h-4" />;
      default: return <Video className="w-4 h-4" />;
    }
  };

  const formattedDate = startDate ? format(new Date(startDate), 'MMM d, yyyy') : 'Date TBD';
  const formattedTime = startDate ? format(new Date(startDate), 'h:mm a') : 'Time TBD';

  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden sticky top-6">
      {/* Thumbnail Area */}
      <div className="relative aspect-video w-full bg-gray-100 dark:bg-zinc-900 overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt="Event Thumbnail" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Calendar className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-medium">Image Preview</span>
          </div>
        )}
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {category && (
            <span className="px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
              {category}
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-sm ${
            status === 'PUBLISHED' ? 'bg-green-500/90 text-white' : 'bg-yellow-500/90 text-white'
          }`}>
            {status || 'DRAFT'}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
          {title || 'Untitled Event'}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
          {shortDescription || 'Add a short description to tell people what this event is about.'}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{formattedDate}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg text-orange-600 dark:text-orange-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Time</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{formattedTime}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 col-span-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
              {getTypeIcon(type)}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Location</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {type === 'ONLINE' ? 'Virtual Event' : (venue || 'Location TBD')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {visibility === 'PRIVATE' ? '🔒 Private Event' : '🌍 Public Event'}
          </span>
          <button 
            type="button" 
            disabled 
            className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl opacity-50 cursor-not-allowed"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPreviewCard;
