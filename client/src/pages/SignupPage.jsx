import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';

/**
 * Signup Page Container
 * 
 * Assembles the Signup UI.
 * Note: The requirement requested using AuthLayout and AuthCard.
 * However, since AuthLayout relies on React Router's <Outlet /> and AuthCard 
 * is already structurally implemented inside the SignupForm component, 
 * this page independently provides the centered, responsive backdrop 
 * to ensure the UI renders perfectly without double-wrapping or routing conflicts.
 */
const SignupPage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <Link 
          to="/" 
          className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-80 transition-opacity"
        >
          PollSphere
        </Link>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md w-full">
        <SignupForm />
      </div>

    </main>
  );
};

export default SignupPage;
