'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phase, PHASE_DISPLAY } from '@/lib/domain/types';

interface PhaseUnlockCeremonyProps {
  fromPhase: Phase;
  toPhase: Phase;
  onComplete: () => void;
  autoPlay?: boolean;
}

export function PhaseUnlockCeremony({
  fromPhase,
  toPhase,
  onComplete,
  autoPlay = true,
}: PhaseUnlockCeremonyProps) {
  const [stage, setStage] = useState<'intro' | 'transition' | 'reveal' | 'complete'>('intro');
  const fromInfo = PHASE_DISPLAY[fromPhase];
  const toInfo = PHASE_DISPLAY[toPhase];

  useEffect(() => {
    if (!autoPlay) return;

    const timers = [
      setTimeout(() => setStage('transition'), 2000),
      setTimeout(() => setStage('reveal'), 4000),
      setTimeout(() => setStage('complete'), 7000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [autoPlay]);

  const handleContinue = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="ceremony-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        style={{ background: 'var(--deep-space)' }}
      >
        {/* Animated background stars */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Radial gradient pulse */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, ${toInfo.color}20 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-2xl px-8">
          {/* Stage: Intro */}
          <AnimatePresence mode="wait">
            {stage === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="space-y-6"
              >
                <motion.div
                  className="text-6xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {fromInfo.icon}
                </motion.div>
                <h2 className="text-2xl font-light text-white/60">
                  You have completed
                </h2>
                <h1 
                  className="text-4xl font-bold"
                  style={{ color: fromInfo.color }}
                >
                  {fromInfo.name}
                </h1>
                <p className="text-xl text-white/40 italic">
                  &ldquo;{fromInfo.tagline}&rdquo;
                </p>
              </motion.div>
            )}

            {/* Stage: Transition */}
            {stage === 'transition' && (
              <motion.div
                key="transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Portal animation */}
                <motion.div
                  className="relative w-48 h-48 mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  {/* Outer ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4"
                    style={{ borderColor: fromInfo.color }}
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  {/* Middle ring */}
                  <motion.div
                    className="absolute inset-4 rounded-full border-4"
                    style={{ borderColor: toInfo.color }}
                    animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  {/* Inner glow */}
                  <motion.div
                    className="absolute inset-8 rounded-full"
                    style={{ 
                      background: `radial-gradient(circle, ${toInfo.color} 0%, transparent 70%)` 
                    }}
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  {/* Center icon */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center text-4xl"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    ⚡
                  </motion.div>
                </motion.div>

                <motion.h2
                  className="text-3xl font-bold text-white"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Graduating...
                </motion.h2>
              </motion.div>
            )}

            {/* Stage: Reveal */}
            {stage === 'reveal' && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Explosion particles */}
                <div className="relative">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
                      style={{ background: toInfo.color }}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{
                        x: Math.cos((i / 20) * Math.PI * 2) * 200,
                        y: Math.sin((i / 20) * Math.PI * 2) * 200,
                        opacity: 0,
                        scale: 0,
                      }}
                      transition={{ duration: 1, delay: 0.1 }}
                    />
                  ))}
                  
                  <motion.div
                    className="text-8xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 200,
                      damping: 10,
                    }}
                  >
                    {toInfo.icon}
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-xl font-light text-white/60 mb-2">
                    Welcome to
                  </h2>
                  <h1 
                    className="text-5xl font-bold mb-4"
                    style={{ color: toInfo.color }}
                  >
                    {toInfo.name}
                  </h1>
                  <p className="text-2xl text-white/60 italic mb-2">
                    &ldquo;{toInfo.tagline}&rdquo;
                  </p>
                  <p className="text-lg font-mono" style={{ color: toInfo.color }}>
                    Phase: {toInfo.verb}
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Stage: Complete */}
            {stage === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <motion.div
                  className="text-7xl"
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎓
                </motion.div>

                <h1 className="text-4xl font-bold text-white">
                  Graduation Complete!
                </h1>

                <div className="flex items-center justify-center gap-4 text-2xl">
                  <span style={{ color: fromInfo.color }}>{fromInfo.verb}</span>
                  <motion.span
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                  <span style={{ color: toInfo.color }}>{toInfo.verb}</span>
                </div>

                <motion.p
                  className="text-lg text-white/60 max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  New capabilities unlocked. New challenges await.
                  Continue your journey through the ProjectX civilization ladder.
                </motion.p>

                <motion.button
                  onClick={handleContinue}
                  className="px-12 py-4 rounded-xl font-bold text-lg text-white relative overflow-hidden group"
                  style={{ 
                    background: `linear-gradient(135deg, ${fromInfo.color}, ${toInfo.color})` 
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="relative z-10">Continue to {toInfo.name}</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Skip button (always visible) */}
        <motion.button
          onClick={handleContinue}
          className="absolute bottom-8 right-8 text-white/40 hover:text-white/80 text-sm font-mono transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Skip →
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
