"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useXPStore } from "@/stores/xp-store";

export function Trailer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [isPlaying, setIsPlaying] = useState(false);
  const { completeMission, isMissionCompleted } = useXPStore();

  const handlePlay = () => {
    setIsPlaying(true);
    // Complete mission when trailer is watched
    if (!isMissionCompleted("trailer-watcher")) {
      // In a real implementation, we'd track actual video completion
      setTimeout(() => {
        completeMission("trailer-watcher");
      }, 5000); // Award after 5 seconds of "watching"
    }
  };

  return (
    <section
      id="trailer"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-4"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--deep-space)]" />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto"
        variants={staggerContainer}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        {/* Section label */}
        <motion.div
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <span className="text-[var(--neon-blue)] font-mono text-sm tracking-wider uppercase">
            [ THE VISION ]
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 text-white">
            See the Future
          </h2>
        </motion.div>

        {/* Video container */}
        <motion.div
          variants={fadeInUp}
          className="relative aspect-video rounded-2xl overflow-hidden bg-[var(--dark-gray)] border border-white/10"
        >
          {!isPlaying ? (
            // Placeholder with play button
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--dark-gray)] to-[var(--deep-space)]">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,var(--molten-orange)_45%,var(--molten-orange)_55%,transparent_55%)] bg-[length:20px_20px] animate-pulse" />
              </div>

              {/* Play button */}
              <button
                onClick={handlePlay}
                className="relative group"
                aria-label="Play trailer"
              >
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full bg-[var(--molten-orange)]/20 scale-100 group-hover:scale-110 transition-transform duration-300" />
                
                {/* Button */}
                <div className="relative w-24 h-24 rounded-full bg-[var(--molten-orange)] flex items-center justify-center group-hover:shadow-[0_0_40px_rgba(255,107,53,0.6)] transition-shadow duration-300">
                  <svg
                    className="w-10 h-10 text-[var(--deep-space)] ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                {/* Pulse animation */}
                <div className="absolute inset-0 rounded-full border-2 border-[var(--molten-orange)] animate-ping opacity-20" />
              </button>

              {/* Coming soon text */}
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-[var(--light-gray)]/60 font-mono text-sm">
                  Trailer coming soon • Click to preview
                </p>
              </div>
            </div>
          ) : (
            // Video placeholder (would be actual video embed)
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--deep-space)]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[var(--molten-orange)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[var(--light-gray)] font-mono">
                  Loading experience...
                </p>
              </div>
            </div>
          )}

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[var(--molten-orange)]/50" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[var(--molten-orange)]/50" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[var(--molten-orange)]/50" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[var(--molten-orange)]/50" />
        </motion.div>

        {/* Caption */}
        <motion.p
          variants={fadeInUp}
          className="text-center mt-8 text-[var(--light-gray)]/60 italic"
        >
          &ldquo;The future belongs to those who dare to evolve.&rdquo;
        </motion.p>
      </motion.div>
    </section>
  );
}
