'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const partnerTypes = [
  {
    type: 'Schools',
    icon: '🏫',
    description: 'Bring ProjectX to your classrooms and transform how students learn.',
    benefits: [
      'Curriculum-aligned missions',
      'Teacher training & support',
      'Progress analytics',
      'Impact reporting',
    ],
    cta: 'Become a Partner School',
    href: '/school',
  },
  {
    type: 'Organizations',
    icon: '🏢',
    description: 'Prepare the next generation of talent with real-world skills.',
    benefits: [
      'Skill-building programs',
      'Talent pipeline access',
      'CSR impact metrics',
      'Custom learning paths',
    ],
    cta: 'Explore Partnership',
    href: '/contact',
  },
  {
    type: 'Mentors',
    icon: '🧑‍🏫',
    description: 'Share your expertise and guide learners on their journey.',
    benefits: [
      'Flexible commitment',
      'Impact tracking',
      'Community recognition',
      'Revenue sharing',
    ],
    cta: 'Become a Mentor',
    href: '/contact',
  },
  {
    type: 'Investors',
    icon: '💼',
    description: 'Join us in building the future of human development.',
    benefits: [
      'Mission-driven growth',
      'Global scalability',
      'EdTech innovation',
      'Social impact returns',
    ],
    cta: 'Connect With Us',
    href: '/contact',
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--sacred-gold)]/10 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            Partner{' '}
            <span className="bg-gradient-to-r from-[var(--sacred-gold)] to-[var(--molten-orange)] bg-clip-text text-transparent">
              With Us
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/70 max-w-2xl mx-auto"
          >
            Join the movement to transform human potential. 
            Together, we&apos;re building the future of learning.
          </motion.p>
        </div>
      </section>

      {/* Aspirational Partnerships */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
          >
            <p className="text-sm text-white/50 uppercase tracking-wider mb-4">
              Inspired by world-class standards
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-2xl font-bold text-white/30">
              <span>MIT</span>
              <span>Stanford</span>
              <span>Harvard</span>
              <span>Google</span>
              <span>Microsoft</span>
              <span>UNESCO</span>
            </div>
            <p className="text-sm text-white/40 italic mt-4">
              Partnerships in progress. We aim to meet these standards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Ways to Partner</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {partnerTypes.map((partner, index) => (
              <motion.div
                key={partner.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors"
              >
                <div className="text-4xl mb-4">{partner.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{partner.type}</h3>
                <p className="text-white/70 mb-6">{partner.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {partner.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-white/60 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--molten-orange)]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={partner.href}
                  className="inline-flex items-center gap-2 text-[var(--molten-orange)] hover:text-[var(--sacred-gold)] transition-colors"
                >
                  {partner.cta}
                  <span>→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-white/60 mb-8">
            Let&apos;s discuss how we can work together to transform education.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-8 py-3 rounded-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] text-[var(--deep-space)] font-semibold hover:scale-105 transition-transform"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
