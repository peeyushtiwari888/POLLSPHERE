import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Global Loader Component
 * Replaces generic spinners with a unique, branded loading animation.
 */
const GlobalLoader = ({ text = "Loading securely..." }) => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      {/* Animated Brand Logo / Shape */}
      <div className="relative flex items-center justify-center">
        {/* Outer expanding ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-orange-500/30 dark:border-orange-500/20"
          animate={{ scale: [1, 2, 2.5], opacity: [0.5, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        
        {/* Inner rotating shapes */}
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-xl shadow-orange-500/20 flex items-center justify-center relative overflow-hidden"
          animate={{ rotate: 360, borderRadius: ["16px", "24px", "16px"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Inner spark */}
          <motion.div 
            className="w-6 h-6 bg-white/30 rounded-full blur-[2px]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p 
        className="text-gray-500 dark:text-gray-400 font-medium tracking-wide text-sm uppercase"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default GlobalLoader;
