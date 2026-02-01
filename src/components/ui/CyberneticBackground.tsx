'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Cybernetic grid with perspective
export function CyberGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Perspective grid floor */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,212,255,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,212,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center top',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
        }}
      />
      
      {/* Vertical grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,107,53,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,107,53,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
        }}
      />
    </div>
  );
}

// Horizontal scan line effect
export function ScanLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Slow moving scan line */}
      <motion.div
        className="absolute inset-x-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.6) 20%, rgba(0,212,255,0.8) 50%, rgba(0,212,255,0.6) 80%, transparent 100%)',
          boxShadow: '0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(0,212,255,0.3)',
        }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Secondary faster scan */}
      <motion.div
        className="absolute inset-x-0 h-[1px] opacity-50"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,107,53,0.5), transparent)',
        }}
        animate={{ top: ['100%', '0%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* CRT scanline overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />
    </div>
  );
}

// Floating data particles
export function DataParticles({ count = 30 }: { count?: number }) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    size: number;
    duration: number;
    delay: number;
    char: string;
  }>>([]);

  useEffect(() => {
    const chars = ['0', '1', '◆', '◇', '○', '●', '△', '▽', '✦', '⬡'];
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 12 + 8,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 10,
        char: chars[Math.floor(Math.random() * chars.length)],
      }))
    );
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-[var(--neon-blue)] font-mono"
          style={{
            left: `${particle.x}%`,
            fontSize: `${particle.size}px`,
            opacity: 0.15,
            textShadow: '0 0 10px currentColor',
          }}
          initial={{ bottom: '-5%', opacity: 0 }}
          animate={{ 
            bottom: '105%', 
            opacity: [0, 0.3, 0.3, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        >
          {particle.char}
        </motion.div>
      ))}
    </div>
  );
}

// Hexagonal pattern overlay
export function HexPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05]">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="hexPattern" width="60" height="52" patternUnits="userSpaceOnUse">
            <path
              d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z"
              fill="none"
              stroke="rgba(255,215,0,0.5)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexPattern)" />
      </svg>
    </div>
  );
}

// Glowing orbs with trails
export function GlowOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary orb - orange */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,53,0.25) 0%, rgba(255,107,53,0.1) 30%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: ['-10%', '60%', '30%', '-10%'],
          y: ['10%', '40%', '70%', '10%'],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Secondary orb - blue */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.2) 0%, rgba(0,212,255,0.08) 30%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: ['70%', '20%', '50%', '70%'],
          y: ['60%', '20%', '50%', '60%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Accent orb - gold */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 60%)',
          filter: 'blur(30px)',
        }}
        animate={{
          x: ['40%', '80%', '20%', '40%'],
          y: ['30%', '60%', '40%', '30%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// Corner frame decorations
export function CornerFrames() {
  return (
    <>
      {/* Top left */}
      <div className="fixed top-4 left-4 w-24 h-24 pointer-events-none z-40">
        <motion.div
          className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--molten-orange)] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ transformOrigin: 'left' }}
        />
        <motion.div
          className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[var(--molten-orange)] to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ transformOrigin: 'top' }}
        />
      </div>
      
      {/* Top right */}
      <div className="fixed top-4 right-4 w-24 h-24 pointer-events-none z-40">
        <motion.div
          className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-[var(--neon-blue)] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          style={{ transformOrigin: 'right' }}
        />
        <motion.div
          className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-[var(--neon-blue)] to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          style={{ transformOrigin: 'top' }}
        />
      </div>
      
      {/* Bottom left */}
      <div className="fixed bottom-4 left-4 w-24 h-24 pointer-events-none z-40">
        <motion.div
          className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--sacred-gold)] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          style={{ transformOrigin: 'left' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[2px] h-full bg-gradient-to-t from-[var(--sacred-gold)] to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          style={{ transformOrigin: 'bottom' }}
        />
      </div>
      
      {/* Bottom right */}
      <div className="fixed bottom-4 right-4 w-24 h-24 pointer-events-none z-40">
        <motion.div
          className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-[var(--molten-orange)] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          style={{ transformOrigin: 'right' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[2px] h-full bg-gradient-to-t from-[var(--molten-orange)] to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          style={{ transformOrigin: 'bottom' }}
        />
      </div>
    </>
  );
}

// System status indicator
export function SystemStatus() {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
    >
      <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-green-500/80 text-xs font-mono uppercase tracking-wider">System Online</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <span className="text-white/40 text-xs font-mono">{time}</span>
        <div className="w-px h-4 bg-white/20" />
        <span className="text-[var(--molten-orange)]/60 text-xs font-mono">ProjectX OS v2.0</span>
      </div>
    </motion.div>
  );
}

// Combined cybernetic background
export function CyberneticBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#0f0a1a] to-[#0a0a0f]" />
      
      {/* Layers */}
      <GlowOrbs />
      <CyberGrid />
      <HexPattern />
      <DataParticles count={25} />
      <ScanLines />
    </div>
  );
}
