"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// =============================================================================
// MINIMAL ANIMATIONS
// =============================================================================

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// =============================================================================
// TYPEWRITER - Clean, professional
// =============================================================================

function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, 60);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  
  return (
    <span className="font-mono">
      {displayText}
      {showCursor && <span className="animate-pulse text-[var(--molten-orange)]">_</span>}
    </span>
  );
}

// =============================================================================
// HERO COMPONENT - Clean, Professional, Sleek
// =============================================================================

export function Hero() {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Subtle gradient background - no busy patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d0a14] to-[#0a0a0f]" />
      
      {/* Single subtle accent glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {/* Brand Mark */}
        <motion.h1
          variants={fadeIn}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-4 leading-[0.9] tracking-tight"
        >
          <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff8c5a] to-[#00d4ff] bg-clip-text text-transparent">
            Project
          </span>
          <span className="text-white">X</span>
        </motion.h1>

        {/* Subtitle - Clean typography */}
        <motion.p
          variants={fadeIn}
          className="text-2xl sm:text-3xl md:text-4xl font-extralight tracking-[0.2em] text-white/60 mb-8 uppercase"
        >
          Operating System
        </motion.p>

        {/* Tagline with typewriter */}
        <motion.div
          variants={fadeIn}
          className="text-lg sm:text-xl md:text-2xl text-[var(--molten-orange)] mb-6 h-8"
        >
          <Typewriter text="The Human Upgrade" delay={800} />
        </motion.div>

        {/* Value proposition - Single line */}
        <motion.p
          variants={fadeIn}
          className="text-base sm:text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto"
        >
          In the Age of Machines, <span className="text-white font-medium">We Build Humans.</span>
        </motion.p>

        {/* CTA - Single, prominent action */}
        <motion.div
          variants={fadeIn}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(255,107,53,0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white font-semibold text-lg shadow-lg shadow-[#ff6b35]/20 transition-all flex items-center gap-3"
            >
              <span>Enter the Experience</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </Link>
          
          <motion.a
            href="#manifesto"
            className="px-6 py-3 text-white/50 hover:text-white transition-colors font-medium flex items-center gap-2"
            whileHover={{ x: 3 }}
          >
            <span className="w-6 h-[1px] bg-white/30" />
            Read the Manifesto
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Minimal scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
            <motion.div
              className="w-1 h-1 bg-white/40 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
