import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  amount?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  amount = 0.15
}) => {
  const getOffset = () => {
    switch (direction) {
      case 'up':
        return { y: 36, x: 0 };
      case 'down':
        return { y: -36, x: 0 };
      case 'left':
        return { x: 36, y: 0 };
      case 'right':
        return { x: -36, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.93,
        ...offset
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0
      }}
      viewport={{
        once: false, // Enables both pop-up on scroll in and pop-out on scroll out
        amount: amount
      }}
      transition={{
        duration: 0.65,
        delay: delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
