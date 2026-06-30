import React from 'react';
import { motion } from 'framer-motion';

const REACTIONS = ['💖', '👏', '🎉', '😂', '🤔'];

const FloatingReactionBar = ({ pollId, socket }) => {

  const handleReactionClick = (emoji) => {
    if (socket && pollId) {
      socket.emit('send-reaction', { pollId, reaction: emoji });
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.5 }}
        className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-zinc-800/50 rounded-full shadow-2xl"
      >
        {REACTIONS.map((emoji, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.2, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleReactionClick(emoji)}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-3xl bg-gray-50 hover:bg-orange-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            {emoji}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default FloatingReactionBar;
