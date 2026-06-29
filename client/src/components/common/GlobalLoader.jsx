import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Global Loader Component
 * A sleek, minimalist loading spinner that looks great in both light and dark modes.
 */
const GlobalLoader = ({ text = "Loading securely..." }) => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-5">
      
      {/* Sleek Spinning Ring */}
      <div className="relative flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-[3px] border-gray-200 dark:border-zinc-800 border-t-orange-500 dark:border-t-orange-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        {/* Optional subtle inner glow for premium feel */}
        <div className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-md" />
      </div>

      {/* Elegant Loading Text */}
      <motion.p 
        className="text-gray-500 dark:text-gray-400 font-medium tracking-wide text-sm"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {text}
      </motion.p>

    </div>
  );
};

export default GlobalLoader;
