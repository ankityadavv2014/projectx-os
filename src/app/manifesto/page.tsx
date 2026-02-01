'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-[var(--deep-space)] text-white">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--molten-orange)]/10 to-transparent" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="text-6xl">📜</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            The{' '}
            <span className="bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] bg-clip-text text-transparent">
              Manifesto
            </span>
          </motion.h1>
        </div>
      </section>

      {/* Manifesto Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <div className="space-y-8 text-lg leading-relaxed">
              <p className="text-2xl font-bold text-[var(--molten-orange)]">
                School is broken.
              </p>
              
              <p className="text-white/80">
                Not because teachers don&apos;t care. Not because students don&apos;t try. 
                But because the system was built for a world that no longer exists.
              </p>
              
              <p className="text-white/80">
                We memorize answers that machines can now generate in seconds. 
                We chase grades that mean nothing in a world where skills speak louder than certificates. 
                We prepare for jobs that will be automated before graduation.
              </p>
              
              <div className="border-l-4 border-[var(--molten-orange)] pl-6 py-2 my-8">
                <p className="text-xl font-semibold text-white">
                  In the Age of Machines, the only competitive advantage left is being <em>more human</em>.
                </p>
              </div>
              
              <p className="text-white/80">
                We believe in a different path.
              </p>
              
              <p className="text-white/80">
                One where learning is measured by what you can <strong>create</strong>, not what you can <strong>repeat</strong>. 
                Where every challenge builds your portfolio, not just your transcript. 
                Where AI is your co-pilot, not your replacement.
              </p>
              
              <h2 className="text-2xl font-bold text-[var(--neon-blue)] mt-12 mb-4">
                The Four Evolutions
              </h2>
              
              <ul className="space-y-4 text-white/80">
                <li>
                  <strong className="text-[var(--molten-orange)]">eXperience (Learn)</strong> — 
                  Master through missions. Build through doing. Fail fast, learn faster.
                </li>
                <li>
                  <strong className="text-[var(--neon-blue)]">eXperiment (Work)</strong> — 
                  Apply skills to real projects. Collaborate. Ship.
                </li>
                <li>
                  <strong className="text-[var(--sacred-gold)]">eXcel (Earn)</strong> — 
                  Turn expertise into income. Freelance, employ, create.
                </li>
                <li>
                  <strong className="text-purple-400">eXpand (Invent)</strong> — 
                  Lead the next wave. Build companies. Shape tomorrow.
                </li>
              </ul>
              
              <div className="border-l-4 border-[var(--sacred-gold)] pl-6 py-2 my-8">
                <p className="text-xl font-semibold text-white">
                  We are not building a platform.<br />
                  We are building humans.
                </p>
              </div>
              
              <p className="text-white/80">
                The future isn&apos;t coming. It&apos;s here. And it belongs to those 
                who learn to learn, adapt to adapt, and create what doesn&apos;t yet exist.
              </p>
              
              <p className="text-2xl font-bold text-[var(--molten-orange)] mt-12">
                Welcome to ProjectX.
              </p>
              
              <p className="text-white/60 italic">
                The Human Upgrade begins now.
              </p>
            </div>
          </motion.article>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to Evolve?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/os"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)] text-[var(--deep-space)] font-semibold hover:scale-105 transition-transform"
            >
              Enter ProjectX OS
            </Link>
            <Link
              href="/vision"
              className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              See the Vision →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
