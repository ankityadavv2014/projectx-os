"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GlowText, GradientText } from "@/components/ui/GlowText";
import { GlowButton } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function Hero() {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Sacred geometry pattern (subtle) */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/20 rounded-full animate-rotate-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/20 rounded-full" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Pre-headline */}
        <motion.p
          variants={fadeInUp}
          className="text-[var(--neon-blue)] font-mono text-sm mb-6 tracking-wider uppercase"
        >
          [ SYSTEM INITIALIZED ]
        </motion.p>

        {/* Main headline */}
        <motion.h1
          variants={fadeInUp}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <GradientText>ProjectX</GradientText>
          <br />
          <span className="text-white">OS</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={fadeInUp}
          className="text-2xl md:text-3xl font-display mb-4"
        >
          <GlowText color="orange">The Human Upgrade</GlowText>
        </motion.p>

        {/* Manifesto teaser */}
        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-[var(--light-gray)]/80 mb-12 max-w-2xl mx-auto"
        >
          In the Age of Machines, We Build Humans.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/desktop">
            <GlowButton>
              Enter the Experience
              <span className="ml-2">→</span>
            </GlowButton>
          </Link>
          
          <a
            href="#manifesto"
            className="text-[var(--neon-blue)] hover:text-white transition-colors font-medium"
          >
            Read the Manifesto
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-[var(--light-gray)]/50">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
