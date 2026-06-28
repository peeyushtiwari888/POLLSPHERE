import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring, motion } from 'framer-motion';

const AnimatedCounter = ({
  value,
  direction = 'up',
  className = '',
}) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 15,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    // Keep it synced if the external value updates after mount (Socket.io updates)
    if (isInView) {
      motionValue.set(value);
    }
  }, [value, motionValue, isInView]);

  useEffect(() => {
    springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('en-US').format(
          Math.floor(latest)
        );
      }
    });
  }, [springValue]);

  return <span ref={ref} className={className} />;
};

export default AnimatedCounter;
