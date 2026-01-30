"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { GlowButton } from "@/components/ui/Button";
import { GlowText } from "@/components/ui/GlowText";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function EnterOS() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      id="enter-os"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-4"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--deep-space)] via-[var(--dark-gray)]/30 to-[var(--deep-space)]" />

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--molten-orange)]/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--neon-blue)]/10 blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 4 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-3xl mx-auto"
        variants={staggerContainer}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        {/* Section label */}
        <motion.div variants={fadeInUp} className="mb-8">
          <span className="text-[var(--matrix-green)] font-mono text-sm tracking-wider uppercase">
            [ ENTER OS MODE ]
          </span>
        </motion.div>

        {/* Main text */}
        <motion.h2
          variants={fadeInUp}
          className="text-4xl md:text-6xl font-display font-bold mb-6 text-white"
        >
          Ready to{" "}
          <GlowText color="blue">Upgrade</GlowText>
          ?
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="text-xl text-[var(--light-gray)]/80 mb-12"
        >
          Step into the ProjectX operating system. Explore, discover, and unlock your potential.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeInUp}>
          <Link href="/desktop">
            <GlowButton className="text-xl px-12 py-6">
              <span className="flex items-center gap-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth={2} />
                  <line x1="8" y1="21" x2="16" y2="21" strokeWidth={2} />
                  <line x1="12" y1="17" x2="12" y2="21" strokeWidth={2} />
                </svg>
                Enter OS Mode
              </span>
            </GlowButton>
          </Link>
        </motion.div>

        {/* Features preview */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: "🖥️", label: "Desktop" },
            { icon: "🚀", label: "Projects" },
            { icon: "🔮", label: "AI Orb" },
            { icon: "⚡", label: "XP System" },
          ].map((feature) => (
            <div
              key={feature.label}
              className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <div className="text-sm text-[var(--light-gray)]/60">{feature.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Keyboard hint */}
        <motion.p
          variants={fadeInUp}
          className="mt-12 text-sm text-[var(--light-gray)]/40 font-mono"
        >
          Press <kbd className="px-2 py-1 bg-white/10 rounded">⌘</kbd> + <kbd className="px-2 py-1 bg-white/10 rounded">K</kbd> to open AI Orb anytime
        </motion.p>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--deep-space)] to-transparent" />
    </section>
  );
}
