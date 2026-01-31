'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Phase, PHASE_DISPLAY } from '@/lib/domain/types';

const phases: Phase[] = ['experience', 'experiment', 'excel', 'expand'];

export function PhaseJourney() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section 
      ref={containerRef}
      className="relative py-32 px-4 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--deep-space)] via-[#0a0515] to-[var(--deep-space)]" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,107,53,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,107,53,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[var(--neon-blue)] font-mono text-sm tracking-widest uppercase">
            [ THE EVOLUTION LADDER ]
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
            <span className="text-white">Your Journey Through </span>
            <span className="bg-gradient-to-r from-[var(--molten-orange)] via-[var(--sacred-gold)] to-[var(--neon-blue)] bg-clip-text text-transparent">
              Four Phases
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            From curiosity to capability to contribution to creation. 
            No shortcuts. Only graduation.
          </p>
        </motion.div>

        {/* Phase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((phase, index) => (
            <PhaseCard 
              key={phase} 
              phase={phase} 
              index={index}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Connection line (desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-[12.5%] right-[12.5%] h-0.5 -translate-y-8">
          <motion.div 
            className="h-full bg-gradient-to-r from-[var(--molten-orange)] via-[var(--neon-blue)] via-[var(--sacred-gold)] to-[#ff4444]"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </div>
      </div>
    </section>
  );
}

function PhaseCard({ 
  phase, 
  index,
}: { 
  phase: Phase; 
  index: number;
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const info = PHASE_DISPLAY[phase];
  
  const unlockDescriptions: Record<Phase, string[]> = {
    experience: ['Complete missions', 'Earn XP & badges', 'Build portfolio', 'Join cohorts'],
    experiment: ['Team challenges', 'Sandbox labs', 'AI collaboration', 'Advanced kits'],
    excel: ['Verified credentials', 'Opportunity matching', 'Employer connections', 'Real earnings'],
    expand: ['Partner toolkit', 'Territory rollout', 'Create content', 'Lead communities'],
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      {/* Phase number */}
      <div 
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 border-2"
        style={{ 
          backgroundColor: 'var(--deep-space)',
          borderColor: info.color,
          color: info.color,
        }}
      >
        {index + 1}
      </div>

      {/* Card */}
      <div 
        className="relative h-full pt-8 pb-6 px-6 rounded-2xl border transition-all duration-500 group-hover:scale-[1.02]"
        style={{
          background: `linear-gradient(135deg, ${info.color}10 0%, transparent 50%)`,
          borderColor: `${info.color}30`,
        }}
      >
        {/* Glow on hover */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
          style={{ background: `${info.color}20` }}
        />
        
        <div className="relative z-10">
          {/* Icon & Title */}
          <div className="text-center mb-4">
            <span className="text-4xl mb-2 block">{info.icon}</span>
            <h3 
              className="text-lg font-bold"
              style={{ color: info.color }}
            >
              {info.name.replace('Project ', '')}
            </h3>
            <p className="text-2xl font-black text-white mt-1">
              {info.verb}
            </p>
          </div>

          {/* Tagline */}
          <p className="text-sm text-white/50 text-center italic mb-4 min-h-[40px]">
            &ldquo;{info.tagline}&rdquo;
          </p>

          {/* Unlock list */}
          <ul className="space-y-2">
            {unlockDescriptions[phase].map((item, i) => (
              <motion.li 
                key={i}
                className="flex items-center gap-2 text-sm text-white/70"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + i * 0.1 + 0.5 }}
              >
                <span 
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: info.color }}
                />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Arrow to next (not on last) */}
        {index < 3 && (
          <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-white/30 text-2xl">
            →
          </div>
        )}
      </div>
    </motion.div>
  );
}
