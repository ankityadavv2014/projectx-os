"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowTextProps {
  children: React.ReactNode;
  className?: string;
  color?: "orange" | "blue" | "green" | "gold" | "purple";
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  animate?: boolean;
}

const colorClasses = {
  orange: "text-[var(--molten-orange)]",
  blue: "text-[var(--neon-blue)]",
  green: "text-[var(--matrix-green)]",
  gold: "text-[var(--sacred-gold)]",
  purple: "text-[var(--cosmic-purple)]",
};

const glowClasses = {
  orange: "drop-shadow-[0_0_20px_rgba(255,107,53,0.8)]",
  blue: "drop-shadow-[0_0_20px_rgba(0,212,255,0.8)]",
  green: "drop-shadow-[0_0_20px_rgba(0,255,65,0.8)]",
  gold: "drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]",
  purple: "drop-shadow-[0_0_20px_rgba(157,78,221,0.8)]",
};

export function GlowText({
  children,
  className,
  color = "orange",
  as: Component = "span",
  animate = false,
}: GlowTextProps) {
  const baseClasses = cn(
    colorClasses[color],
    glowClasses[color],
    "font-display font-bold",
    className
  );

  if (animate) {
    return (
      <motion.span
        className={baseClasses}
        animate={{
          textShadow: [
            `0 0 10px currentColor`,
            `0 0 30px currentColor`,
            `0 0 10px currentColor`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.span>
    );
  }

  return <Component className={baseClasses}>{children}</Component>;
}

// Animated text that reveals letter by letter
interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function RevealText({ text, className, delay = 0 }: RevealTextProps) {
  const letters = text.split("");

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.03,
            delayChildren: delay,
          },
        },
      }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="inline-block"
          style={{ whiteSpace: letter === " " ? "pre" : "normal" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Gradient text
interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
}

export function GradientText({
  children,
  className,
  from = "var(--molten-orange)",
  via,
  to = "var(--neon-blue)",
}: GradientTextProps) {
  const gradient = via
    ? `linear-gradient(90deg, ${from}, ${via}, ${to})`
    : `linear-gradient(90deg, ${from}, ${to})`;

  return (
    <span
      className={cn("bg-clip-text text-transparent font-display font-bold", className)}
      style={{ backgroundImage: gradient }}
    >
      {children}
    </span>
  );
}
