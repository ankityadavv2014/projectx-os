'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { formatShortcut } from '@/lib/nav/shortcuts';

export default function ReturnToOSFab() {
  const pathname = usePathname();

  // Don't show on landing page or OS page
  if (pathname === '/' || pathname === '/os') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Link
          href="/os"
          className="
            group flex items-center gap-2 
            px-4 py-3 
            bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)]
            rounded-full
            shadow-lg shadow-[var(--molten-orange)]/30
            hover:shadow-[var(--molten-orange)]/50
            transition-all duration-300
            hover:scale-105
          "
        >
          {/* Orb Icon */}
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
            <div className="relative w-full h-full rounded-full bg-white/80 flex items-center justify-center">
              <span className="text-xs font-bold text-[var(--deep-space)]">X</span>
            </div>
          </div>

          {/* Label */}
          <span className="text-sm font-semibold text-[var(--deep-space)]">
            Return to OS
          </span>

          {/* Shortcut hint */}
          <kbd className="hidden sm:block px-1.5 py-0.5 rounded bg-black/20 text-[var(--deep-space)]/70 text-xs">
            {formatShortcut('Escape')}
          </kbd>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
