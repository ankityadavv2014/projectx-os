'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const stats = [
  { 
    value: 10000, 
    suffix: '+', 
    label: 'Learners', 
    subtext: 'Building the future',
    color: 'var(--molten-orange)' 
  },
  { 
    value: 500, 
    suffix: '+', 
    label: 'Schools', 
    subtext: 'Across 12 countries',
    color: 'var(--neon-blue)' 
  },
  { 
    value: 2500, 
    suffix: '+', 
    label: 'Missions', 
    subtext: 'Completed',
    color: 'var(--sacred-gold)' 
  },
  { 
    value: 95, 
    suffix: '%', 
    label: 'Engagement', 
    subtext: 'Return rate',
    color: '#a855f7' 
  },
];

const logos = [
  { name: 'MIT', opacity: 0.4 },
  { name: 'Stanford', opacity: 0.35 },
  { name: 'Harvard', opacity: 0.3 },
  { name: 'Google', opacity: 0.4 },
  { name: 'Microsoft', opacity: 0.35 },
  { name: 'UNESCO', opacity: 0.3 },
];

function AnimatedNumber({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(interval);
  }, [value, inView]);
  
  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function SocialProof() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--deep-space)] to-transparent" />
      
      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div 
                className="text-4xl md:text-5xl font-black mb-2"
                style={{ color: stat.color }}
              >
                <AnimatedNumber value={stat.value} suffix={stat.suffix} inView={isInView} />
              </div>
              <div className="text-white font-semibold">{stat.label}</div>
              <div className="text-white/40 text-sm">{stat.subtext}</div>
            </motion.div>
          ))}
        </div>

        {/* Trusted By Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-white/40 text-sm font-mono uppercase tracking-widest mb-8">
            Trusted by forward-thinking institutions
          </p>
          
          {/* Logo parade */}
          <div className="flex flex-wrap items-center justify-center gap-12">
            {logos.map((logo, index) => (
              <motion.div
                key={logo.name}
                className="text-2xl font-bold tracking-tight"
                style={{ opacity: logo.opacity, color: 'white' }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: logo.opacity } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ opacity: 0.8, scale: 1.05 }}
              >
                {logo.name}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial Teaser */}
        <motion.div
          className="mt-20 max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="relative">
            {/* Quote marks */}
            <span className="absolute -top-8 -left-4 text-6xl text-[var(--molten-orange)]/20 font-serif">
              &ldquo;
            </span>
            <p className="text-xl md:text-2xl text-white/80 italic leading-relaxed">
              ProjectX isn&apos;t just an education platform. It&apos;s the future of 
              how humanity will learn, grow, and evolve. We&apos;re not building courses. 
              We&apos;re building humans.
            </p>
            <span className="absolute -bottom-8 -right-4 text-6xl text-[var(--molten-orange)]/20 font-serif">
              &rdquo;
            </span>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--molten-orange)] to-[var(--sacred-gold)]" />
            <div className="text-left">
              <div className="text-white font-semibold">Founder</div>
              <div className="text-white/50 text-sm">The ProjectX Co.</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
