import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ReactionOverlay listens for live reactions and animates them floating upwards.
 * Must be rendered at the root of the presenter screen.
 */
const ReactionOverlay = ({ socket }) => {
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveReaction = (emoji) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      
      // Random starting X position across the bottom of the screen (5% to 95%)
      const startX = Math.floor(Math.random() * 90) + 5;
      // Random scale to add variety
      const scale = 1 + (Math.random() * 1.5);
      // Random duration for upward float (3s to 5s)
      const duration = 3 + (Math.random() * 2);
      // Random sway range (-30px to 30px)
      const sway = (Math.random() - 0.5) * 60;

      const newReaction = { id, emoji, startX, scale, duration, sway };
      
      setReactions((prev) => [...prev, newReaction]);

      // Auto-remove reaction from state after it finishes animating
      setTimeout(() => {
        setReactions((prev) => prev.filter(r => r.id !== id));
      }, duration * 1000);
    };

    socket.on('receive-reaction', handleReceiveReaction);

    return () => {
      socket.off('receive-reaction', handleReceiveReaction);
    };
  }, [socket]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence>
        {reactions.map((r) => (
          <motion.div
            key={r.id}
            initial={{ 
              opacity: 0, 
              y: '100vh', 
              x: `${r.startX}vw`, 
              scale: 0.5 
            }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              y: '-20vh', 
              x: `calc(${r.startX}vw + ${r.sway}px)`,
              scale: r.scale,
              rotate: (Math.random() - 0.5) * 45 // Slight random rotation
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: r.duration, 
              ease: "easeOut" 
            }}
            className="absolute bottom-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] dark:drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            style={{ fontSize: '3rem' }}
          >
            {r.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ReactionOverlay;
