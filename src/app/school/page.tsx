'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BookOpen, 
  GraduationCap, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Handshake,
  Building2,
  type LucideIcon
} from 'lucide-react';

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BookOpen,
    title: 'Curriculum Integration',
    description: 'Align ProjectX missions with your existing curriculum and learning objectives.',
  },
  {
    icon: GraduationCap,
    title: 'Teacher Training',
    description: 'Comprehensive onboarding and ongoing support for your educators.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track student progress, engagement, and learning outcomes in real-time.',
  },
  {
    icon: Target,
    title: 'Custom Missions',
    description: 'Create school-specific missions aligned to your goals and values.',
  },
  {
    icon: TrendingUp,
    title: 'Impact Reports',
    description: 'Detailed reports on student growth, skill development, and portfolio quality.',
  },
  {
    icon: Handshake,
    title: 'Dedicated Support',
    description: 'A partner success manager to guide your implementation journey.',
  },
];

const steps = [
  { step: 1, title: 'Schedule a Demo', description: 'See ProjectX in action and discuss your needs.' },
  { step: 2, title: 'Pilot Program', description: 'Start with a cohort to test and refine the experience.' },
  { step: 3, title: 'Teacher Training', description: 'Equip your educators with tools and techniques.' },
  { step: 4, title: 'Full Rollout', description: 'Expand to more students with ongoing support.' },
];

export default function SchoolPage() {
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--neon-blue)]/10 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex justify-center"
          >
            <Building2 className="w-16 h-16 text-[var(--molten-orange)]" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-black mb-6"
          >
            Bring{' '}
            <span className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--molten-orange)] bg-clip-text text-transparent">
              ProjectX
            </span>{' '}
            to Your School
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-white/70 max-w-2xl mx-auto mb-8"
          >
            Transform how your students learn. Equip them with skills for tomorrow 
            through immersive missions, AI mentorship, and real-world challenges.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/contact"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] text-[var(--deep-space)] font-semibold hover:scale-105 transition-transform"
            >
              Schedule a Demo
            </Link>
            <Link
              href="/vision"
              className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              See the Vision →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What You Get</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--deep-space)] border border-white/10 rounded-xl p-6"
              >
                <div className="mb-4">
                  <feature.icon className="w-10 h-10 text-[var(--molten-orange)]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Steps */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--molten-orange)] to-[var(--sacred-gold)]" />
            
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative mb-8 flex items-start gap-6 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Number */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-[var(--molten-orange)] to-[var(--sacred-gold)] flex items-center justify-center text-[var(--deep-space)] font-bold text-xl shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                  {step.step}
                </div>
                
                {/* Content */}
                <div className={`flex-1 ml-4 md:ml-0 ${index % 2 === 0 ? 'md:pr-24 md:text-right' : 'md:pl-24'}`}>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-white/60">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { value: '10,000+', label: 'Students', subtext: 'across partner schools' },
              { value: '200+', label: 'Schools', subtext: 'piloting ProjectX' },
              { value: '95%', label: 'Engagement', subtext: 'student return rate' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-black text-[var(--molten-orange)] mb-2">{stat.value}</div>
                <div className="text-xl font-semibold">{stat.label}</div>
                <div className="text-white/50 text-sm">{stat.subtext}</div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-white/40 text-sm mt-8 italic">
            *Projected targets. Pilot programs in progress.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your School?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Join the movement to prepare students for the future. 
            Schedule a demo and see how ProjectX can work for your institution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] text-[var(--deep-space)] font-semibold hover:scale-105 transition-transform"
            >
              Schedule a Demo
            </Link>
            <Link
              href="/partners"
              className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Learn About Partnerships
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
