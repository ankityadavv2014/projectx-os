'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ExperimentPortal() {
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Locked Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--neon-blue)]/30 to-[var(--neon-blue)]/10 flex items-center justify-center">
              <span className="text-6xl">🔒</span>
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[var(--neon-blue)]/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl font-black mb-4"
        >
          Project{' '}
          <span className="bg-gradient-to-r from-[var(--neon-blue)] to-cyan-400 bg-clip-text text-transparent">
            eXperiment
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl text-white/70 mb-8"
        >
          &ldquo;Work like tomorrow starts today.&rdquo;
        </motion.p>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[var(--neon-blue)] animate-pulse" />
            <span className="text-sm font-mono text-[var(--neon-blue)]">LOCKED</span>
          </div>
          
          <p className="text-white/70 mb-6">
            This portal unlocks once you graduate from <strong className="text-[var(--molten-orange)]">Project eXperience</strong>.
          </p>

          <div className="space-y-3 text-left max-w-sm mx-auto">
            <h3 className="font-semibold text-white text-center mb-4">Graduation Requirements</h3>
            {[
              { label: 'Complete 10 missions', progress: 0 },
              { label: 'Earn 5,000 XP', progress: 0 },
              { label: 'Build your portfolio', progress: 0 },
              { label: 'Receive mentor approval', progress: 0 },
            ].map((req) => (
              <div key={req.label} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-white/30" />
                <span className="text-white/60 text-sm">{req.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What's Inside */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">What awaits you:</h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-white/60">
            <div className="bg-white/5 rounded-lg p-3">Real-world projects</div>
            <div className="bg-white/5 rounded-lg p-3">Team collaboration</div>
            <div className="bg-white/5 rounded-lg p-3">Industry mentors</div>
            <div className="bg-white/5 rounded-lg p-3">Portfolio building</div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/student"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] text-[var(--deep-space)] font-semibold hover:scale-105 transition-transform"
          >
            Continue in eXperience
          </Link>
          <Link
            href="/os"
            className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            Return to OS
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
