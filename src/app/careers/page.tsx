'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const openings = [
  {
    title: 'AI Engineer',
    team: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build AI-powered mentorship and learning systems that adapt to each learner.',
  },
  {
    title: 'Frontend Developer',
    team: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Create beautiful, immersive experiences with Next.js and Framer Motion.',
  },
  {
    title: 'Curriculum Designer',
    team: 'Education',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design mission-based learning experiences that build real-world skills.',
  },
  {
    title: 'Community Manager',
    team: 'Growth',
    location: 'Remote',
    type: 'Part-time',
    description: 'Build and nurture our community of learners, educators, and mentors.',
  },
];

const values = [
  { icon: '🚀', title: 'Mission First', desc: 'We exist to transform human potential, not to build features.' },
  { icon: '🧪', title: 'Experiment Always', desc: 'Fail fast, learn faster. Every mistake is a data point.' },
  { icon: '🤝', title: 'Radical Transparency', desc: 'We share openly, give feedback honestly, and build trust daily.' },
  { icon: '🌍', title: 'Global Impact', desc: 'We build for the billions, not just the privileged few.' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            Join the{' '}
            <span className="bg-gradient-to-r from-purple-400 to-[var(--molten-orange)] bg-clip-text text-transparent">
              Mission
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/70 max-w-2xl mx-auto"
          >
            We&apos;re building the future of human development. 
            If you believe learning should be a superpower, not a chore — join us.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-bold mb-2">{value.title}</h3>
                <p className="text-white/60 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          
          <div className="space-y-4">
            {openings.map((job, index) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--deep-space)] border border-white/10 rounded-xl p-6 hover:border-[var(--molten-orange)]/50 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-white/50">
                      <span>{job.team}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                    <p className="text-white/70 mt-2">{job.description}</p>
                  </div>
                  <Link
                    href="/contact"
                    className="shrink-0 px-4 py-2 rounded-lg border border-[var(--molten-orange)] text-[var(--molten-orange)] hover:bg-[var(--molten-orange)] hover:text-[var(--deep-space)] transition-colors"
                  >
                    Apply
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-white/50 mb-4">Don&apos;t see a fit? We&apos;re always looking for exceptional people.</p>
            <Link
              href="/contact"
              className="text-[var(--molten-orange)] hover:underline"
            >
              Send us your story →
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Join Us?</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              { icon: '🌍', title: 'Remote-First', desc: 'Work from anywhere. We hire globally.' },
              { icon: '📈', title: 'Equity', desc: 'Own a piece of what we&apos;re building together.' },
              { icon: '📚', title: 'Learn & Grow', desc: 'Unlimited learning budget. Grow with us.' },
              { icon: '🏖️', title: 'Flexible PTO', desc: 'Take time when you need it. We trust you.' },
              { icon: '💪', title: 'Health & Wellness', desc: 'We invest in your wellbeing.' },
              { icon: '🎯', title: 'Impact', desc: 'Your work changes lives. Literally.' },
            ].map((benefit) => (
              <div key={benefit.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">{benefit.icon}</div>
                <h3 className="font-bold mb-1">{benefit.title}</h3>
                <p className="text-white/60 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
