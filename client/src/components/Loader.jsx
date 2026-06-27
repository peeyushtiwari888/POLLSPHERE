import React from 'react';

/**
 * Loader Component
 * 
 * A reusable, accessible modern spinner.
 * 
 * @param {string} size - The size of the spinner ('sm', 'md', 'lg'). Default is 'md'.
 * @param {boolean} fullScreen - If true, centers the loader across the entire viewport.
 */
const Loader = ({ size = 'md', fullScreen = false }) => {
  // Map sizes to Tailwind dimension and border classes
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-2',
    lg: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div
      // We use our primary color variables. The left/right borders are transparent to create a modern rotating crescent effect.
      className={`animate-spin rounded-full border-t-[rgb(var(--primary))] border-b-[rgb(var(--primary))] border-l-transparent border-r-transparent ${sizeClasses[size]}`}
      role="status"
      aria-label="Loading"
    >
      {/* 
        This text is hidden visually but readable by Screen Readers.
        It makes the loader accessible to visually impaired users.
      */}
      <span className="sr-only">Loading...</span>
    </div>
  );

  // Return a full-screen centered loader (Great for initial page loads)
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[rgb(var(--bg-background))] transition-colors duration-300">
        {spinner}
      </div>
    );
  }

  // Return an inline or block-level loader (Great for loading inside cards or buttons)
  return (
    <div className="flex items-center justify-center w-full p-4">
      {spinner}
    </div>
  );
};

export default Loader;
