"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { GlowText, GradientText } from "@/components/ui/GlowText";
import { GlowButton } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useRef, useEffect, useState } from "react";

// Floating orbs component
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large primary orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, rgba(255,107,53,0) 70%)',
          top: '20%',
          left: '60%',
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Secondary blue orb */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, rgba(0,212,255,0) 70%)',
          top: '50%',
          left: '10%',
        }}
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Golden accent orb */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0) 70%)',
          top: '70%',
          left: '70%',
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// Animated grid background
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,107,53,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,53,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        }}
      />
      {/* Animated scan line */}
      <motion.div
        className="absolute inset-x-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)',
        }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// Typing effect for tagline
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
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
      }, 50);
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

// Stats counter
function AnimatedCounter({ value, label, delay }: { value: number; label: string; delay: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white">
        {count.toLocaleString()}+
      </div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef}
      id="hero" 
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
    >
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a1a] to-[#0a0a0f]" />
      
      {/* Grid background */}
      <GridBackground />
      
      {/* Floating orbs */}
      <FloatingOrbs />
      
      {/* Sacred geometry pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Outer ring */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-[#ff6b35]/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />
        {/* Middle ring */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#00d4ff]/15 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner ring */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-[#ffd700]/10 rounded-full"
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        {/* Center glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Content with parallax */}
      <motion.div
        className="relative z-10 text-center max-w-5xl mx-auto"
        style={{ y, opacity }}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Pre-headline with glitch effect */}
        <motion.div
          variants={fadeInUp}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/5 backdrop-blur-sm">
            <span className="w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse" />
            <span className="text-[var(--neon-blue)] font-mono text-sm tracking-wider uppercase">
              SYSTEM v2.0 INITIALIZED
            </span>
          </span>
        </motion.div>

        {/* Main headline with enhanced styling */}
        <motion.h1
          variants={fadeInUp}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-[0.9] tracking-tight"
        >
          <span className="relative inline-block">
            <GradientText>Project</GradientText>
            <motion.span
              className="absolute -top-2 -right-4 text-2xl"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✦
            </motion.span>
          </span>
          <span className="text-white">X</span>
          <br />
          <span className="text-4xl md:text-6xl lg:text-7xl font-light tracking-widest text-white/80">
            OPERATING SYSTEM
          </span>
        </motion.h1>

        {/* Animated tagline */}
        <motion.div
          variants={fadeInUp}
          className="text-xl md:text-2xl lg:text-3xl mb-4 h-10"
        >
          <span className="text-[var(--molten-orange)]">
            <TypewriterText text="The Human Upgrade_" delay={1000} />
          </span>
        </motion.div>

        {/* Manifesto teaser with gradient border */}
        <motion.div
          variants={fadeInUp}
          className="relative inline-block mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35] via-[#00d4ff] to-[#ffd700] rounded-lg opacity-20 blur-xl" />
          <p className="relative text-lg md:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto px-6 py-4">
            In the Age of Machines, <span className="text-white font-semibold">We Build Humans.</span>
          </p>
        </motion.div>

        {/* CTA Buttons - enhanced */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <Link href="/os">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <GlowButton>
                <span className="flex items-center gap-3">
                  <span className="text-lg">⚡</span>
                  Enter the Experience
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </GlowButton>
            </motion.div>
          </Link>
          
          <motion.a
            href="#manifesto"
            className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors font-medium"
            whileHover={{ x: 5 }}
          >
            <span className="w-8 h-[1px] bg-white/30 group-hover:w-12 group-hover:bg-[#00d4ff] transition-all" />
            Read the Manifesto
          </motion.a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          <AnimatedCounter value={50000} label="Learners" delay={1500} />
          <AnimatedCounter value={120} label="Schools" delay={1700} />
          <AnimatedCounter value={500} label="Missions" delay={1900} />
        </motion.div>
      </motion.div>

      {/* Enhanced scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.3em] text-white/30">Scroll</span>
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
            whileHover={{ borderColor: 'rgba(255,107,53,0.5)' }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-[var(--molten-orange)] rounded-full"
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
