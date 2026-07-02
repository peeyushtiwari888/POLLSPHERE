import { useContext, useEffect, useRef, useCallback } from 'react';
import { SoundContext } from '../context/SoundContext';

/**
 * Custom hook to play audio files with mute support.
 * @param {string} url - Path to the audio file (e.g., '/sounds/lobby.wav')
 * @param {object} options - Configuration options { loop, volume }
 * @returns {object} { play, stop, pause }
 */
export const useAudio = (url, options = {}) => {
  const { isMuted } = useContext(SoundContext);
  const audioRef = useRef(null);
  
  const { loop = false, volume = 1.0 } = options;

  useEffect(() => {
    // Initialize audio object
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
    }
    
    const audio = audioRef.current;
    audio.loop = loop;
    audio.volume = volume;

    // Apply mute state
    audio.muted = isMuted;
    
    // Cleanup on unmount
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [url, loop, volume, isMuted]);

  // Expose play function
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      // If the sound is already playing and we call play again (like rapid correct answers),
      // we reset the time so it restarts immediately instead of doing nothing.
      if (!loop) {
        audio.currentTime = 0;
      }
      // Play returns a promise that can reject if the user hasn't interacted with the page yet
      audio.play().catch(e => console.warn('Audio play failed:', e.message));
    }
  }, [loop]);

  // Expose stop function
  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  // Expose pause function
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
  }, []);

  return { play, stop, pause };
};
