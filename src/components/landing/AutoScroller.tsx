'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Section {
  id: string;
  name: string;
  pauseDuration: number; // seconds to pause for reading
  isEngagement: boolean; // true = pause for human interaction
}

const sections: Section[] = [
  { id: 'hero', name: 'Welcome', pauseDuration: 5, isEngagement: false },
  { id: 'why-now', name: 'The Truth', pauseDuration: 12, isEngagement: true },
  { id: 'manifesto', name: 'Manifesto', pauseDuration: 15, isEngagement: true },
  { id: 'phases', name: 'The Journey', pauseDuration: 10, isEngagement: true },
  { id: 'trailer', name: 'Experience', pauseDuration: 0, isEngagement: true },
  { id: 'personas', name: 'Your Path', pauseDuration: 8, isEngagement: true },
  { id: 'cta', name: 'Begin', pauseDuration: 0, isEngagement: true },
];

export function AutoScroller() {
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const autoStartTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSection = sections[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / sections.length) * 100;

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, []);

  // Start auto-scroll journey
  const startJourney = useCallback(() => {
    setHasStarted(true);
    setIsAutoScrolling(true);
    setCurrentSectionIndex(0);
    setShowCancelPrompt(true);
    scrollToSection(sections[0].id);
  }, [scrollToSection]);

  // Cancel the tour
  const cancelTour = useCallback(() => {
    setIsAutoScrolling(false);
    setIsCancelled(true);
    setShowCancelPrompt(false);
    if (autoStartTimerRef.current) {
      clearTimeout(autoStartTimerRef.current);
    }
  }, []);

  // Skip to next section
  const skipToNext = useCallback(() => {
    if (currentSectionIndex < sections.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIndex);
      scrollToSection(sections[nextIndex].id);
      setCountdown(sections[nextIndex].pauseDuration);
    } else {
      setIsAutoScrolling(false);
      setShowCancelPrompt(false);
    }
  }, [currentSectionIndex, scrollToSection]);

  // AUTO-START after 3 seconds
  useEffect(() => {
    if (isCancelled) return;
    
    autoStartTimerRef.current = setTimeout(() => {
      startJourney();
    }, 3000);

    return () => {
      if (autoStartTimerRef.current) {
        clearTimeout(autoStartTimerRef.current);
      }
    };
  }, [startJourney, isCancelled]);

  // Handle countdown and auto-advance
  useEffect(() => {
    if (!isAutoScrolling || !hasStarted) return;

    const section = sections[currentSectionIndex];
    
    if (section.pauseDuration === 0) {
      return;
    }

    setCountdown(section.pauseDuration);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          if (currentSectionIndex < sections.length - 1) {
            const nextIndex = currentSectionIndex + 1;
            setCurrentSectionIndex(nextIndex);
            scrollToSection(sections[nextIndex].id);
          } else {
            setIsAutoScrolling(false);
            setShowCancelPrompt(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [currentSectionIndex, isAutoScrolling, hasStarted, scrollToSection]);

  // If cancelled, show nothing
  if (isCancelled) return null;

  // Before auto-start, show subtle loading indicator
  if (!hasStarted) {
    return (
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/10">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[var(--molten-orange)]"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <span className="text-white/60 text-sm">Guided tour starting...</span>
          <button
            onClick={cancelTour}
            className="text-white/40 hover:text-white text-sm underline underline-offset-2"
          >
            Skip
          </button>
        </div>
      </motion.div>
    );
  }

  // Active tour controls - FIXED: Now positioned at top-right to avoid content overlap
  return (
    <AnimatePresence>
      {showCancelPrompt && (
        <motion.div
          className="fixed top-20 right-4 md:right-8 z-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 px-4 md:px-6 py-3 md:py-4 rounded-2xl bg-black/90 backdrop-blur-xl border border-[var(--molten-orange)]/30 shadow-2xl shadow-[var(--molten-orange)]/20">
            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-[var(--molten-orange)]/50"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Progress ring - smaller on mobile */}
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <svg className="w-10 h-10 md:w-12 md:h-12 -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="16"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="16"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={100.5}
                  strokeDashoffset={100.5 * (1 - progress / 100)}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--molten-orange)" />
                    <stop offset="100%" stopColor="var(--sacred-gold)" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] md:text-xs font-bold">
                {currentSectionIndex + 1}/{sections.length}
              </span>
            </div>

            {/* Section info - compact on mobile */}
            <div className="text-center md:text-left min-w-[80px] md:min-w-[120px]">
              <p className="text-white font-semibold text-sm md:text-lg">{currentSection.name}</p>
              {countdown > 0 && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <motion.div
                    className="w-12 md:w-16 h-1 bg-white/10 rounded-full overflow-hidden"
                  >
                    <motion.div
                      className="h-full bg-[var(--neon-blue)]"
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: countdown, ease: 'linear' }}
                    />
                  </motion.div>
                  <span className="text-white/40 text-[10px] md:text-xs font-mono">{countdown}s</span>
                </div>
              )}
            </div>

            {/* Controls - stacked on mobile */}
            <div className="flex items-center gap-2">
              {currentSectionIndex < sections.length - 1 && (
                <motion.button
                  onClick={skipToNext}
                  className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              )}

              <motion.button
                onClick={cancelTour}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-white/20 hover:border-red-500/50 hover:bg-red-500/10 text-white/60 hover:text-white text-xs md:text-sm transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Exit
              </motion.button>
            </div>

            {/* Keyboard hint - hidden on mobile and tablet */}
            <div className="hidden lg:flex items-center gap-1 text-white/30 text-xs">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10">Esc</kbd>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
