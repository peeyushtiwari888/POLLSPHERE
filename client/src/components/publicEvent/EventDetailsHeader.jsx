import React from 'react';
import { Calendar, User, Tag } from 'lucide-react';
import { format } from 'date-fns';

const EventDetailsHeader = ({ event }) => {
  const { title, banner, category, organizer, startDate } = event;

  const formattedDate = startDate ? format(new Date(startDate), 'MMMM d, yyyy') : 'Date TBD';

  return (
    <div className="w-full relative rounded-3xl overflow-hidden bg-gray-900 shadow-xl mb-8 group animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Banner Background */}
      <div className="absolute inset-0 w-full h-full">
        {banner ? (
          <>
            <img src={banner} alt="Event Banner" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col justify-end min-h-[400px]">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {category && (
            <span className="px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md text-indigo-100 text-sm font-bold uppercase tracking-widest rounded-full">
              {category}
            </span>
          )}
          <span className="flex items-center gap-2 px-4 py-1.5 bg-black/40 backdrop-blur-md text-gray-300 text-sm font-medium rounded-full">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6 max-w-4xl drop-shadow-lg">
          {title}
        </h1>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-inner">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-300 uppercase tracking-wider font-semibold">Organized by</span>
            <span className="text-lg text-white font-bold">{organizer?.username || 'PollSphere User'}</span>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default EventDetailsHeader;
