import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-zinc-950 overflow-hidden transition-colors duration-300">
      
      {/* Modern Background Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-500/20 dark:bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-[30%] left-[10%] w-64 h-64 bg-purple-500/15 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <div className="relative z-10 mb-8 text-center">
        <Link 
          to="/" 
          className="text-3xl font-extrabold tracking-tight hover:opacity-80 transition-opacity"
        >
          <span className="text-gray-900 dark:text-white">Poll</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">Sphere</span>
        </Link>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">Join us today and create amazing polls!</p>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <SignupForm />
      </div>

    </main>
  );
};

export default SignupPage;
