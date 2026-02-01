'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const personas = [
  {
    id: 'student',
    icon: '🎯',
    title: 'I want to learn',
    description: 'Complete missions. Earn XP. Build a portfolio that proves what you can actually do.',
    cta: 'Start learning',
    href: '/student',
    color: 'var(--molten-orange)',
  },
  {
    id: 'teacher',
    icon: '📚',
    title: 'I want to teach',
    description: 'Design missions. Review work. Watch your students grow in ways grades never captured.',
    cta: 'Start teaching',
    href: '/teacher',
    color: 'var(--neon-blue)',
  },
  {
    id: 'parent',
    icon: '�️',
    title: 'I want to support',
    description: 'See what your child is building. Understand their growth. Celebrate real wins.',
    cta: 'Track progress',
    href: '/parent',
    color: 'var(--sacred-gold)',
  },
  {
    id: 'school',
    icon: '🏫',
    title: 'I run a school',
    description: 'Deploy ProjectX across your institution. Get analytics, tools, and a new way forward.',
    cta: 'Partner with us',
    href: '/partners',
    color: '#a855f7',
  },
];

export function PersonaPathways() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--deep-space)]" />
      
      {/* Subtle radial gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,107,53,0.1) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[var(--sacred-gold)] font-mono text-sm tracking-widest uppercase">
            [ CHOOSE YOUR PATH ]
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-white">
            Built for Every Human
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Whether you&apos;re a curious student, dedicated teacher, supportive parent, 
            or visionary school leader — there&apos;s a place for you.
          </p>
        </motion.div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona, index) => (
            <PersonaCard key={persona.id} persona={persona} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonaCard({ 
  persona, 
  index 
}: { 
  persona: typeof personas[0]; 
  index: number;
}) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div 
        className="relative h-full rounded-2xl border p-6 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${persona.color}08 0%, transparent 100%)`,
          borderColor: `${persona.color}20`,
        }}
      >
        {/* Hover glow */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at center, ${persona.color}15 0%, transparent 70%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <motion.div 
            className="text-5xl mb-4"
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            {persona.icon}
          </motion.div>

          {/* Title */}
          <h3 
            className="text-xl font-bold mb-3"
            style={{ color: persona.color }}
          >
            {persona.title}
          </h3>

          {/* Description */}
          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            {persona.description}
          </p>

          {/* CTA Button */}
          <Link href={persona.href}>
            <motion.button
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 border"
              style={{
                borderColor: persona.color,
                color: persona.color,
              }}
              whileHover={{
                backgroundColor: persona.color,
                color: 'var(--deep-space)',
              }}
            >
              {persona.cta} →
            </motion.button>
          </Link>
        </div>

        {/* Corner accent */}
        <div 
          className="absolute top-0 right-0 w-20 h-20 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${persona.color} 0%, transparent 70%)`,
          }}
        />
      </div>
    </motion.div>
  );
}
