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
    <div className="w-full flex flex-col items-center text-center py-4">
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center">
          {avatar ? (
            <img 
              src={avatar} 
              alt={name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500 dark:text-gray-400"
            style={{ display: avatar ? 'none' : 'flex' }}
          >
            {initials || <User className="w-8 h-8" />}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{name}</h2>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">{email}</div>
      <div className="text-xs text-gray-400">
        Member since {joinedDate}
      </div>
    </div>
  );
};

export default ProfileCard;
