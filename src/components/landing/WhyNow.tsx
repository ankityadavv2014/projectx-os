'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const problems = [
  {
    stat: '65%',
    context: 'of jobs in 2035',
    problem: "don't exist today",
    insight: 'Schools are preparing students for a world that no longer exists.',
  },
  {
    stat: '85%',
    context: 'of learning',
    problem: 'is forgotten within 30 days',
    insight: 'Because it was never applied. Knowledge without action decays.',
  },
  {
    stat: '70%',
    context: 'of students',
    problem: 'feel disengaged',
    insight: "They're not lazy. They're bored. The system wasn't built for them.",
  },
];

const truths = [
  {
    old: 'Curriculum → Exam → Forget',
    new: 'Mission → Create → Portfolio',
    icon: '🔄',
  },
  {
    old: 'Grades measure memory',
    new: 'XP measures growth',
    icon: '📊',
  },
  {
    old: 'Learn alone, compete against peers',
    new: 'Learn together, elevate each other',
    icon: '🤝',
  },
  {
    old: 'Graduate, then figure it out',
    new: 'Build credentials as you learn',
    icon: '🎯',
  },
];

export function WhyNow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={containerRef}
      className="relative py-32 px-4 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--deep-space)] via-[#0a0a12] to-[var(--deep-space)]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[var(--molten-orange)] font-mono text-sm tracking-widest uppercase">
            [ THE TRUTH ]
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-white">
            Education is Broken
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Not because teachers don't care. Not because students won't try.
            <br />
            <span className="text-white/80">Because the operating system is obsolete.</span>
          </p>
        </motion.div>

        {/* Problem Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {problems.map((item, index) => (
            <motion.div
              key={index}
              className="relative p-8 rounded-2xl border border-white/10 bg-white/[0.02]"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {/* Stat */}
              <div className="mb-4">
                <span className="text-5xl md:text-6xl font-black text-[var(--molten-orange)]">
                  {item.stat}
                </span>
                <span className="text-white/40 text-sm block mt-1">
                  {item.context}
                </span>
              </div>
              
              {/* Problem */}
              <p className="text-xl text-white font-semibold mb-3">
                {item.problem}
              </p>
              
              {/* Insight */}
              <p className="text-white/50 text-sm leading-relaxed">
                {item.insight}
              </p>
            </motion.div>
          ))}
        </div>

        {/* The Shift */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            We're Not Fixing Education
          </h3>
          <p className="text-white/50">
            We're replacing the operating system entirely.
          </p>
        </motion.div>

        {/* Old vs New */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {truths.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-white/40 text-sm line-through decoration-white/20">
                  {item.old}
                </p>
                <p className="text-white font-medium">
                  {item.new}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom truth */}
        <motion.p
          className="text-center mt-16 text-white/30 text-sm font-mono max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          ProjectX isn't another EdTech app. It's a complete reimagination of 
          how humans learn, grow, and prove their capabilities.
        </motion.p>
      </div>
    </section>
  );
}
