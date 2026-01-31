"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GlowButton } from "@/components/ui/Button";
import { GlowText } from "@/components/ui/GlowText";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Feature card with hover effects
function FeatureCard({ icon, label, description, delay }: { 
  icon: string; 
  label: string; 
  description: string;
  delay: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#ff6b35]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
      />
      <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ff6b35]/30 transition-all duration-300 hover:-translate-y-1">
        <motion.div 
          className="text-4xl mb-3"
          animate={isHovered ? { scale: 1.2, rotate: [0, -10, 10, 0] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
        <div className="text-lg font-semibold text-white mb-1">{label}</div>
        <div className="text-sm text-white/50">{description}</div>
      </div>
    </motion.div>
  );
}

// Animated OS preview mockup
function OSPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative mt-16 max-w-4xl mx-auto"
    >
      {/* Glow effect behind */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b35]/20 via-[#00d4ff]/10 to-transparent blur-3xl transform scale-110" />
      
      {/* Mock window */}
      <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/30">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center text-sm text-white/40 font-mono">
            ProjectX OS v2.0
          </div>
        </div>
        
        {/* Content area */}
        <div className="p-8 min-h-[300px] relative">
          {/* Animated grid */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,107,53,0.3) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          
          {/* Mock dock */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-4 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            {['🎯', '📊', '💻', '⚙️', '👤'].map((icon, i) => (
              <motion.div
                key={i}
                className="w-12 h-12 flex items-center justify-center text-2xl rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                whileHover={{ y: -8, scale: 1.1 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                {icon}
              </motion.div>
            ))}
          </div>
          
          {/* Floating elements */}
          <motion.div
            className="absolute top-8 left-8 px-4 py-2 rounded-lg bg-[#ff6b35]/10 border border-[#ff6b35]/30 text-sm text-[#ff6b35]"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            +50 XP Earned! 🎉
          </motion.div>
          
          <motion.div
            className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-white/60">3 missions active</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function EnterOS() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const features = [
    { icon: "🎯", label: "Missions", description: "Real-world challenges" },
    { icon: "⚡", label: "XP System", description: "Track your growth" },
    { icon: "🏆", label: "Badges", description: "Earn achievements" },
    { icon: "🔮", label: "AI Guide", description: "Personal mentor" },
  ];

  return (
    <section
      id="enter-os"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-4 overflow-hidden"
    >
      {/* Deep background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0f1a] to-[#0a0a0f]" />

      {/* Animated mesh gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 50%)',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 50%)',
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 5 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto"
        variants={staggerContainer}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/5">
              <motion.span
                className="w-2 h-2 bg-[#00d4ff] rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[#00d4ff] font-mono text-sm tracking-wider uppercase">
                READY TO LAUNCH
              </span>
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-display font-black mb-6 text-white"
          >
            Enter the{" "}
            <span className="relative inline-block">
              <GlowText color="blue">Experience</GlowText>
              <motion.span
                className="absolute -top-2 -right-4 text-xl"
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Step into a new paradigm of learning. Where every action counts, 
            every challenge transforms, and every human levels up.
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.label}
              icon={feature.icon}
              label={feature.label}
              description={feature.description}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* OS Preview */}
        <OSPreview />

        {/* CTA Section */}
        <motion.div
          variants={fadeInUp}
          className="text-center mt-16"
        >
          <Link href="/os">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <GlowButton className="text-xl px-12 py-6">
                <span className="flex items-center gap-3">
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    ⚡
                  </motion.span>
                  Launch ProjectX OS
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </GlowButton>
            </motion.div>
          </Link>

          {/* Keyboard hint */}
          <motion.p
            variants={fadeInUp}
            className="mt-6 text-white/30 text-sm font-mono"
          >
            Press <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 mx-1">⌘</kbd>+
            <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 mx-1">K</kbd> for quick access
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
