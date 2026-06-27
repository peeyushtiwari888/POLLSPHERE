import React from 'react';
import { User, Mail, CalendarDays, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

/**
 * Premium Profile Card
 * 
 * A visually stunning sidebar component that displays the user's high-level 
 * information including their avatar, name, email, and join date.
 * 
 * @param {Object} profile - The user profile data object
 */
const ProfileCard = ({ profile }) => {
  // Graceful fallback while loading
  if (!profile) return null;

  const { 
    name = 'Unknown User', 
    email = 'No email provided', 
    avatar, 
    createdAt 
  } = profile;

  // Derive initials for the fallback avatar (e.g. "John Doe" -> "JD")
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Safely format the date
  const joinedDate = createdAt ? format(new Date(createdAt), 'MMMM yyyy') : 'Unknown Date';

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden group">
      
      {/* ----------------------------------------------------------------------
          Background Accents
      ---------------------------------------------------------------------- */}
      {/* Subtle top gradient glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
      {/* Hover glow effect behind avatar */}
      <div className="absolute top-12 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* ----------------------------------------------------------------------
          Avatar Section
      ---------------------------------------------------------------------- */}
      <div className="relative z-10 mb-6">
        <div className="w-28 h-28 rounded-full border-4 border-white dark:border-zinc-900 shadow-xl overflow-hidden bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
          {avatar ? (
            <img 
              src={avatar} 
              alt={name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initials if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Initials Fallback (Shown if no avatar string, or if img fails) */}
          <div 
            className="w-full h-full flex items-center justify-center text-3xl font-extrabold text-orange-600 dark:text-orange-400 tracking-wider"
            style={{ display: avatar ? 'none' : 'flex' }}
          >
            {initials || <User className="w-10 h-10" />}
          </div>
        </div>
        
        {/* Verification / Pro Badge */}
        <div className="absolute bottom-1 right-1 bg-white dark:bg-zinc-900 rounded-full p-1 shadow-sm">
          <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          User Identity
      ---------------------------------------------------------------------- */}
      <div className="relative z-10 w-full flex flex-col items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1 truncate w-full">
          {name}
        </h2>
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
          <Mail className="w-4 h-4 shrink-0" />
          <span className="truncate">{email}</span>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          Metadata Row
      ---------------------------------------------------------------------- */}
      <div className="relative z-10 w-full pt-6 border-t border-gray-100 dark:border-zinc-800">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <CalendarDays className="w-4 h-4 text-orange-500" />
          <span>Member since <strong className="text-gray-900 dark:text-white">{joinedDate}</strong></span>
        </div>
      </div>

    </div>
  );
};

export default ProfileCard;
