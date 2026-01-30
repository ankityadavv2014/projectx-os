"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GlowText } from "@/components/ui/GlowText";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const manifestoLines = [
  { text: "In the Age of Machines,", highlight: false },
  { text: "We Build Humans.", highlight: true },
  { text: "", highlight: false },
  { text: "Not apps. Not algorithms.", highlight: false },
  { text: "Humans.", highlight: true },
  { text: "", highlight: false },
  { text: "We believe technology should elevate,", highlight: false },
  { text: "not replace, the human spirit.", highlight: false },
  { text: "", highlight: false },
  { text: "We are architects of potential.", highlight: true },
  { text: "Engineers of evolution.", highlight: false },
  { text: "Builders of the future self.", highlight: false },
  { text: "", highlight: false },
  { text: "This is", highlight: false },
  { text: "ProjectX.", highlight: true },
];

export function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-4"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--deep-space)] via-[var(--dark-gray)]/50 to-[var(--deep-space)]" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-3xl mx-auto text-center"
        variants={staggerContainer}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        {/* Section label */}
        <motion.div
          variants={fadeInUp}
          className="mb-12"
        >
          <span className="text-[var(--molten-orange)] font-mono text-sm tracking-wider uppercase">
            [ THE MANIFESTO ]
          </span>
        </motion.div>

        {/* Manifesto text */}
        <div className="space-y-2">
          {manifestoLines.map((line, index) => {
            if (line.text === "") {
              return <div key={index} className="h-6" />;
            }

            return (
              <motion.p
                key={index}
                variants={fadeInUp}
                custom={index}
                className={`text-2xl md:text-3xl lg:text-4xl font-display leading-relaxed ${
                  line.highlight
                    ? "font-bold"
                    : "text-[var(--light-gray)]/80"
                }`}
              >
                {line.highlight ? (
                  <GlowText color="orange">{line.text}</GlowText>
                ) : (
                  line.text
                )}
              </motion.p>
            );
          })}
        </div>

        {/* Decorative element */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 flex justify-center"
        >
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--molten-orange)] to-transparent" />
        </motion.div>
      </motion.div>

      {/* Floating quotes */}
      <motion.div
        className="absolute left-8 top-1/4 text-[200px] font-display text-[var(--molten-orange)]/5 select-none pointer-events-none"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        &ldquo;
      </motion.div>
      <motion.div
        className="absolute right-8 bottom-1/4 text-[200px] font-display text-[var(--molten-orange)]/5 select-none pointer-events-none"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 3 }}
      >
        &rdquo;
      </motion.div>
    </section>
  );
}
