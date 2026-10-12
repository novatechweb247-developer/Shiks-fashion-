import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
  brandName?: string;
  tagline?: string;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  brandName = 'SHIKS FASHION',
  tagline = 'WHERE STYLE MEETS CRAFT'
}) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 3-second duration (3000ms) with smooth updates
    const duration = 3000;
    const intervalTime = 30;
    const totalSteps = duration / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const currentProgress = Math.min(Math.round((step / totalSteps) * 100), 100);
      setProgress(currentProgress);

      if (step >= totalSteps) {
        clearInterval(timer);
        setIsExiting(true);
        setTimeout(() => {
          onComplete();
        }, 600); // Allow exit animation to finish smoothly
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] bg-[#5A1833] text-[#F8F4EE] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Subtle background luxury pattern/glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#751f42]/40 via-transparent to-black/30 pointer-events-none" />

          <div className="relative z-10 max-w-md w-full text-center space-y-8">
            
            {/* Top Emblem / Label */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-[#C9A45C]/30 text-[#C9A45C] text-[10px] sm:text-xs font-semibold tracking-widest uppercase mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>ATELIER & INNOVATIONS ACADEMY · JOS</span>
            </motion.div>

            {/* Main Brand Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F8F4EE] leading-none">
                {brandName}
              </h1>
              <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#C9A45C] font-semibold">
                & INNOVATIONS ACADEMY
              </p>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-editorial italic text-base sm:text-lg text-[#F8F4EE]/80"
            >
              "{tagline}"
            </motion.p>

            {/* Progress Bar & Counter */}
            <div className="space-y-3 pt-4">
              <div className="w-48 sm:w-64 h-[2px] bg-white/20 mx-auto overflow-hidden relative">
                <motion.div
                  className="h-full bg-[#C9A45C]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>

              <div className="flex items-center justify-between w-48 sm:w-64 mx-auto text-[11px] text-[#C9A45C] font-mono tracking-widest">
                <span>CURATING EXPERIENCE</span>
                <span>{progress}%</span>
              </div>
            </div>

          </div>

          {/* Bottom Location Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-8 text-[10px] tracking-widest uppercase text-[#F8F4EE]/60"
          >
            Plateau State · Nigeria
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
