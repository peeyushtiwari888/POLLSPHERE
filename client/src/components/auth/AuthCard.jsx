import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Reusable Authentication Card Wrapper
 * 
 * This component provides a consistent, premium layout for all auth-related forms 
 * (Login, Signup, Forgot Password). It handles the centered layout, background 
 * gradients, glassmorphism, and entry animations automatically.
 * 
 * @param {ReactNode} children - The form content to render inside the card
 */
const AuthCard = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden">
      
      {/* Decorative Background Elements (Adds depth to the SaaS design) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-orange-500/10 dark:bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md mx-auto relative z-10"
      >
        <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-8 sm:p-10">
          
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2.5 group outline-none">
              <img src="/logo.png" alt="PollSphere Icon" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300 rounded-xl shadow-sm" />
              <span className="font-extrabold text-3xl tracking-tighter">
                <span className="text-gray-900 dark:text-white">Poll</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">Sphere</span>
              </span>
            </Link>
          </div>

          {/* Form Content (Login / Signup Forms will be injected here) */}
          <div className="w-full">
            {children}
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default AuthCard;
