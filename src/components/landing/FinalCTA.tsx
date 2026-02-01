'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function FinalCTA() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--deep-space)] via-[#1a0a0f] to-[var(--deep-space)]" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[var(--molten-orange)]/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[var(--neon-blue)]/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
            <span className="text-white">The world doesn't need</span>
            <br />
            <span className="text-white/40">another course platform.</span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-white mb-4">
            It needs a new{' '}
            <span className="bg-gradient-to-r from-[var(--molten-orange)] via-[var(--sacred-gold)] to-[var(--neon-blue)] bg-clip-text text-transparent font-bold">
              operating system
            </span>
            {' '}for humans.
          </p>
          
          <p className="text-lg text-white/50 max-w-xl mx-auto mb-12">
            We're building it. And we're looking for the first believers—
            students, teachers, schools—who want to help shape it.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/os">
            <motion.button
              className="group relative px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--molten-orange)] via-[var(--sacred-gold)] to-[var(--molten-orange)] bg-[length:200%_100%] group-hover:animate-gradient-x" />
              
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              
              <span className="relative z-10 flex items-center gap-2 text-[var(--deep-space)]">
                <span className="text-xl">⚡</span>
                Enter the OS
              </span>
            </motion.button>
          </Link>

          <Link href="/partners">
            <motion.button
              className="px-8 py-5 rounded-2xl font-semibold text-lg border border-white/20 text-white/80 hover:bg-white/5 hover:border-white/40 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Partner with us
            </motion.button>
          </Link>
        </motion.div>

        {/* Honest positioning */}
        <motion.div
          className="mt-16 p-6 rounded-2xl border border-white/10 bg-white/[0.02] max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-white/60 text-sm leading-relaxed">
            <span className="text-white font-semibold">Honest disclaimer:</span> We're early. 
            The platform is live, but we're still building. If you're looking for 
            a finished product with all the answers, this isn't it yet. 
            But if you want to be part of building something that could 
            change how humans learn—<span className="text-[var(--molten-orange)]">we want you here.</span>
          </p>
        </motion.div>

        {/* Keyboard hint */}
        <motion.p
          className="mt-8 text-white/20 text-sm font-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          Press <kbd className="px-2 py-1 rounded bg-white/10 border border-white/10 mx-1">⌘</kbd>+
          <kbd className="px-2 py-1 rounded bg-white/10 border border-white/10 mx-1">K</kbd> anywhere
        </motion.p>
      </div>
    </section>
  );
}
