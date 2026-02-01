"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// Radar/Scanner circles that pulse outward from center
function ScannerCircles() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#ff6b35]/20"
          style={{ width: 100, height: 100 }}
          animate={{ scale: [1, 15], opacity: [0.6, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`cyan-${i}`}
          className="absolute rounded-full border border-[#00d4ff]/15"
          style={{ width: 150, height: 150 }}
          animate={{ scale: [1, 12], opacity: [0.4, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 1.5 + 0.5, ease: "easeOut" }}
        />
      ))}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-[#ff6b35]"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 1, 0.8],
          boxShadow: ['0 0 20px rgba(255,107,53,0.5)', '0 0 60px rgba(255,107,53,0.8)', '0 0 20px rgba(255,107,53,0.5)'],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// Rotating radar sweep line
function RadarSweep() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.div
        className="absolute w-[800px] h-[800px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute top-1/2 left-1/2 w-1/2 h-1"
          style={{
            background: 'linear-gradient(90deg, rgba(255,107,53,0.8) 0%, transparent 100%)',
            transformOrigin: 'left center',
            boxShadow: '0 0 30px rgba(255,107,53,0.5)',
          }}
        />
      </motion.div>
    </div>
  );
}

// Enhanced particle field
function ParticleField() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number; color: string }[]>([]);
  
  useEffect(() => {
    const colors = ['rgba(255,107,53,0.6)', 'rgba(0,212,255,0.5)', 'rgba(255,255,255,0.4)'];
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 15 + 8,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: [0, -150, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// Grid with perspective
function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute bottom-0 left-0 right-0 h-[60%] opacity-30"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, rgba(255,107,53,0.03) 100%), repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,107,53,0.1) 50px), repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(255,107,53,0.05) 50px)`,
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />
      <motion.div
        className="absolute left-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#ff6b35]/30 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00d4ff]/30 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      />
    </div>
  );
}

// Floating orbs
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,53,0.25) 0%, rgba(255,107,53,0.05) 40%, transparent 70%)',
          left: '-10%',
          top: '10%',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.2) 0%, rgba(0,212,255,0.05) 40%, transparent 70%)',
          right: '-5%',
          bottom: '5%',
          filter: 'blur(30px)',
        }}
        animate={{ x: [0, -80, 0], y: [0, -60, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(157,78,221,0.15) 0%, transparent 60%)',
          left: '40%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(50px)',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// Scan lines
function ScanLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }}
      />
      <motion.div
        className="absolute left-0 right-0 h-[3px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), rgba(255,107,53,0.5), transparent)',
          boxShadow: '0 0 20px rgba(0,212,255,0.3)',
        }}
        animate={{ top: ['-3px', '100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// Pulsing rings
function PulsingRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: 200 + i * 150,
            height: 200 + i * 150,
            borderColor: i % 2 === 0 ? 'rgba(0,212,255,0.1)' : 'rgba(255,107,53,0.1)',
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3], rotate: i % 2 === 0 ? [0, 360] : [360, 0] }}
          transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// Typewriter
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
      {showCursor && (
        <motion.span 
          className="text-[var(--molten-orange)] ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          █
        </motion.span>
      )}
    </span>
  );
}

// Animation variants
const fadeIn = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.15 } } };

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d0a14] to-[#050508]" />
      
      <FloatingOrbs />
      <GridLines />
      <PulsingRings />
      <ScannerCircles />
      <RadarSweep />
      <ParticleField />
      <ScanLines />
      
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)' }} />

      <motion.div className="relative z-10 text-center max-w-5xl mx-auto" variants={stagger} initial="initial" animate="animate">
        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-white/60 font-mono uppercase tracking-wider">System V2.0 Initialized</span>
        </motion.div>

        <motion.h1 variants={fadeIn} className="relative mb-6">
          <span className="absolute inset-0 font-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter blur-2xl opacity-50" style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c5a 50%, #00d4ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Project✦X
          </span>
          <span className="relative flex items-center justify-center gap-2 font-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter">
            <motion.span 
              className="bg-gradient-to-r from-[#ff6b35] via-[#ff8c5a] to-[#ffb088] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Project
            </motion.span>
            <motion.span 
              className="text-[#00d4ff] text-4xl sm:text-5xl md:text-6xl"
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{ rotate: { duration: 10, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
            >
              ✦
            </motion.span>
            <motion.span 
              className="text-white relative"
              animate={{ textShadow: ['0 0 20px rgba(255,255,255,0.5)', '0 0 40px rgba(255,255,255,0.8)', '0 0 20px rgba(255,255,255,0.5)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              X
            </motion.span>
          </span>
        </motion.h1>

        <motion.p variants={fadeIn} className="text-2xl sm:text-3xl md:text-4xl font-extralight tracking-[0.3em] text-white/50 mb-8 uppercase">
          Operating System
        </motion.p>

        <motion.div variants={fadeIn} className="text-xl sm:text-2xl md:text-3xl text-[var(--molten-orange)] mb-6 h-10">
          <Typewriter text="The Human Upgrade" delay={1000} />
        </motion.div>

        <motion.p variants={fadeIn} className="text-lg sm:text-xl md:text-2xl text-white/40 mb-14 max-w-2xl mx-auto">
          In the Age of Machines, <span className="text-white font-medium">We Build Humans.</span>
        </motion.p>

        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(255,107,53,0.4), 0 0 100px rgba(255,107,53,0.2)' }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-10 py-5 rounded-2xl overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#ff6b35] via-[#ff8c5a] to-[#ff6b35]"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: '200% 200%' }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative z-10 flex items-center gap-3 text-white font-bold text-lg">
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>⚡</motion.span>
                Enter the Experience
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
              </span>
            </motion.button>
          </Link>
          
          <motion.a href="#manifesto" className="group px-8 py-4 text-white/50 hover:text-white transition-colors font-medium flex items-center gap-3" whileHover={{ x: 5 }}>
            <span className="w-8 h-[1px] bg-white/30 group-hover:bg-white/60 group-hover:w-12 transition-all" />
            Read the Manifesto
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/20">Scroll</span>
          <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2">
            <motion.div className="w-1.5 h-1.5 bg-[var(--molten-orange)] rounded-full" animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
