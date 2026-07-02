import React, { createContext, useState, useEffect } from 'react';

export const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  // Check local storage for previous preference, default to false (not muted)
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('pollsphere_is_muted');
    return saved === 'true';
  });

  // Save to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('pollsphere_is_muted', isMuted);
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, setIsMuted }}>
      {children}
    </SoundContext.Provider>
  );
};
