import React from 'react';
import { Outlet, Link } from 'react-router-dom';

/**
 * AuthLayout
 * 
 * A specialized layout wrapper for authentication pages like Login and Signup.
 * It centers the content horizontally and vertically, providing a distraction-free environment.
 */
const AuthLayout = () => {
  return (
    // bg-surface provides a slight contrast against the white/dark auth cards
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-[rgb(var(--bg-surface))] transition-colors duration-300">
      
      {/* Subtle Brand Logo / Header to allow users to click back to Home */}
      <div className="mb-8 text-center">
        <Link to="/" className="text-3xl font-bold gradient-text hover:opacity-80 transition-opacity">
          PollSphere
        </Link>
      </div>

      {/* 
        Main Auth Area 
        The w-full and max-w-md ensures the auth cards don't stretch too wide on large screens,
        maintaining a beautiful and readable proportion.
      */}
      <div className="w-full max-w-md">
        <Outlet />
      </div>

    </div>
  );
};

export default AuthLayout;
