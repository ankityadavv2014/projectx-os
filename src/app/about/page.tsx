'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--molten-orange)]/10 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            About{' '}
            <span className="bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] bg-clip-text text-transparent">
              The ProjectX Co.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/70 max-w-2xl mx-auto"
          >
            In the Age of Machines, We Build Humans.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-[var(--molten-orange)]">Our Mission</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              The ProjectX Co. exists to transform how humanity learns, grows, and evolves. 
              We&apos;re not building another education platform. We&apos;re building a new operating 
              system for human potential.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              Through our four-phase journey — <strong>eXperience</strong>, <strong>eXperiment</strong>, 
              <strong>eXcel</strong>, and <strong>eXpand</strong> — we guide humans from learning to 
              earning to inventing the future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Four Phases */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The Four Phases</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                phase: 'eXperience',
                tagline: 'Learn',
                description: 'Master skills through immersive missions, AI mentorship, and real-world challenges.',
                color: 'var(--molten-orange)',
                status: 'Active',
              },
              {
                phase: 'eXperiment',
                tagline: 'Work',
                description: 'Apply your skills on real projects, collaborate with peers, and build your portfolio.',
                color: 'var(--neon-blue)',
                status: 'Coming Soon',
              },
              {
                phase: 'eXcel',
                tagline: 'Earn',
                description: 'Transform your expertise into income through freelancing, employment, or entrepreneurship.',
                color: 'var(--sacred-gold)',
                status: 'Coming Soon',
              },
              {
                phase: 'eXpand',
                tagline: 'Invent',
                description: 'Lead the next generation. Build companies, mentor learners, shape the future.',
                color: '#a855f7',
                status: 'Coming Soon',
              },
            ].map((item, index) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--deep-space)] border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <h3 className="text-xl font-bold" style={{ color: item.color }}>
                    {item.phase}
                  </h3>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-white/10 text-white/50">
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-2">{item.tagline}</p>
                <p className="text-white/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">The Team</h2>
          <p className="text-white/70 mb-12 max-w-2xl mx-auto">
            We&apos;re a team of educators, technologists, and dreamers who believe 
            the future of humanity depends on how we evolve our learning systems.
          </p>
          
          <div className="flex justify-center">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--molten-orange)] to-[var(--sacred-gold)] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-1">Founder</h3>
              <p className="text-white/50 text-sm">The ProjectX Co.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to Begin?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/os"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] text-[var(--deep-space)] font-semibold hover:scale-105 transition-transform"
            >
              Enter ProjectX OS
            </Link>
            <Link
              href="/manifesto"
              className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Read the Manifesto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
