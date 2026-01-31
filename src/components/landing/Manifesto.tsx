"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { GlowText } from "@/components/ui/GlowText";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const manifestoLines = [
  { text: "In the Age of Machines,", highlight: false, delay: 0 },
  { text: "We Build Humans.", highlight: true, delay: 0.1 },
  { text: "", highlight: false, delay: 0 },
  { text: "Not apps. Not algorithms.", highlight: false, delay: 0.2 },
  { text: "Humans.", highlight: true, delay: 0.3 },
  { text: "", highlight: false, delay: 0 },
  { text: "We believe technology should elevate,", highlight: false, delay: 0.4 },
  { text: "not replace, the human spirit.", highlight: false, delay: 0.5 },
  { text: "", highlight: false, delay: 0 },
  { text: "We are architects of potential.", highlight: true, delay: 0.6 },
  { text: "Engineers of evolution.", highlight: false, delay: 0.7 },
  { text: "Builders of the future self.", highlight: false, delay: 0.8 },
  { text: "", highlight: false, delay: 0 },
  { text: "This is", highlight: false, delay: 0.9 },
  { text: "ProjectX.", highlight: true, delay: 1.0 },
];

// Animated line with reveal effect
function ManifestoLine({ text, highlight, index, isInView }: { 
  text: string; 
  highlight: boolean; 
  index: number;
  isInView: boolean;
}) {
  if (text === "") {
    return <div className="h-8" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)',
      } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="overflow-hidden"
    >
      <p className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display leading-relaxed ${
        highlight ? "font-bold" : "text-white/60"
      }`}>
        {highlight ? (
          <span className="relative inline-block">
            <GlowText color="orange">{text}</GlowText>
            <motion.span
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#ff6b35] to-[#ffd700]"
              initial={{ width: 0 }}
              animate={isInView ? { width: '100%' } : {}}
              transition={{ duration: 1, delay: index * 0.08 + 0.5 }}
            />
          </span>
        ) : (
          text
        )}
      </p>
    </motion.div>
  );
}

export function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.3, 0]);

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-4 overflow-hidden"
    >
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)',
            opacity: glowOpacity,
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
            opacity: glowOpacity,
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </motion.div>
      
      {/* Vertical lines decoration */}
      <div className="absolute inset-0 flex justify-center gap-[200px] opacity-[0.03]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        variants={staggerContainer}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
      >
        {/* Section label with animated border */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#ff6b35]/30 bg-[#ff6b35]/5">
            <motion.span
              className="w-2 h-2 bg-[#ff6b35] rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[var(--molten-orange)] font-mono text-sm tracking-[0.2em] uppercase">
              THE MANIFESTO
            </span>
          </span>
        </motion.div>

        {/* Manifesto text with staggered reveal */}
        <div className="space-y-1">
          {manifestoLines.map((line, index) => (
            <ManifestoLine 
              key={index}
              text={line.text}
              highlight={line.highlight}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 flex justify-center items-center gap-4"
        >
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#ff6b35]/50" />
          <motion.div
            className="w-3 h-3 border border-[#ff6b35]/50 rotate-45"
            animate={{ rotate: [45, 225, 45] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#ff6b35]/50" />
        </motion.div>
      </motion.div>

      {/* Floating quotes - enhanced */}
      <motion.div
        className="absolute left-4 md:left-12 top-1/4 text-[150px] md:text-[250px] font-serif text-[var(--molten-orange)]/[0.03] select-none pointer-events-none"
        animate={{ 
          y: [0, -30, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        &ldquo;
      </motion.div>
      <motion.div
        className="absolute right-4 md:right-12 bottom-1/4 text-[150px] md:text-[250px] font-serif text-[var(--molten-orange)]/[0.03] select-none pointer-events-none"
        animate={{ 
          y: [0, 30, 0],
          rotate: [5, -5, 5],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 4 }}
      >
        &rdquo;
      </motion.div>
    </section>
  );
}
