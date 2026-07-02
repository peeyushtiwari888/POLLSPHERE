/**
 * Avatar Utilities
 * 
 * Functions to generate consistent, aesthetically pleasing colors 
 * and initials for user avatars.
 */

const AVATAR_GRADIENTS = [
  'from-orange-400 to-orange-600',
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-indigo-400 to-indigo-600',
  'from-teal-400 to-teal-600',
  'from-rose-400 to-rose-600',
  'from-cyan-400 to-cyan-600',
  'from-fuchsia-400 to-fuchsia-600',
];

/**
 * Returns a consistent tailwind gradient string based on the user's name.
 * @param {string} name - The user's name or username
 * @returns {string} Tailwind gradient classes
 */
export const getAvatarGradient = (name) => {
  if (!name) return AVATAR_GRADIENTS[0];
  
  // Calculate a consistent index based on string characters
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Ensure positive index within array bounds
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

/**
 * Derives 1-2 letter initials from a name
 * @param {string} name 
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(n => n.length > 0)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};
