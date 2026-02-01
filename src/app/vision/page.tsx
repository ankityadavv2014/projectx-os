'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const roadmapItems = [
  {
    phase: 'Q1 2026',
    title: 'Project eXperience Launch',
    status: 'current',
    items: [
      'Student missions & challenges',
      'Teacher cohort management',
      'Parent progress tracking',
      'AI Mentor integration',
      'XP & badge system',
    ],
  },
  {
    phase: 'Q2 2026',
    title: 'School Onboarding',
    status: 'upcoming',
    items: [
      'School admin dashboard',
      'Curriculum integration',
      'Bulk teacher onboarding',
      'Impact analytics',
      'Pilot school rollout',
    ],
  },
  {
    phase: 'Q3 2026',
    title: 'Project eXperiment Beta',
    status: 'planned',
    items: [
      'Real-world project matching',
      'Peer collaboration tools',
      'Portfolio enhancement',
      'Skill verification',
      'Mentor marketplace',
    ],
  },
  {
    phase: 'Q4 2026',
    title: 'Project eXcel Preview',
    status: 'planned',
    items: [
      'Freelance opportunity board',
      'Employer partnerships',
      'Income tracking',
      'Career guidance AI',
      'Financial literacy modules',
    ],
  },
  {
    phase: '2027+',
    title: 'Project eXpand',
    status: 'vision',
    items: [
      'Startup incubator',
      'Facilitator certification',
      'Community chapters',
      'Global expansion',
      'Education policy advocacy',
    ],
  },
];

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--neon-blue)]/10 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            Vision &{' '}
            <span className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--sacred-gold)] bg-clip-text text-transparent">
              Roadmap
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/70 max-w-2xl mx-auto"
          >
            Where we&apos;re going and how we&apos;ll get there. 
            From learning to earning to inventing the future.
          </motion.p>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-xl text-white/80 leading-relaxed">
              A world where every human has access to a personalized path from 
              <strong className="text-[var(--molten-orange)]"> learning</strong> to 
              <strong className="text-[var(--neon-blue)]"> working</strong> to 
              <strong className="text-[var(--sacred-gold)]"> earning</strong> to 
              <strong className="text-purple-400"> inventing</strong> — 
              powered by AI mentorship and guided by human wisdom.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The Roadmap</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--molten-orange)] via-[var(--neon-blue)] to-[var(--sacred-gold)]" />
            
            {roadmapItems.map((item, index) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative mb-12 md:mb-16 ${
                  index % 2 === 0 ? 'md:pr-[50%] md:text-right' : 'md:pl-[50%] md:ml-auto'
                }`}
              >
                {/* Dot */}
                <div 
                  className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 z-10 ${
                    item.status === 'current' 
                      ? 'bg-[var(--molten-orange)] ring-4 ring-[var(--molten-orange)]/30' 
                      : 'bg-white/30'
                  }`}
                />
                
                <div className={`ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className={`text-sm font-mono ${
                        item.status === 'current' ? 'text-[var(--molten-orange)]' : 'text-white/50'
                      }`}>
                        {item.phase}
                      </span>
                      {item.status === 'current' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--molten-orange)]/20 text-[var(--molten-orange)]">
                          Current
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                    
                    <ul className={`space-y-2 text-white/70 text-sm ${
                      index % 2 === 0 ? 'md:text-right' : ''
                    }`}>
                      {item.items.map((listItem) => (
                        <li key={listItem} className="flex items-center gap-2 md:justify-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
                          {listItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Join the Journey</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/os"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] text-[var(--deep-space)] font-semibold hover:scale-105 transition-transform"
            >
              Start Now
            </Link>
            <Link
              href="/partners"
              className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Partner With Us →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
