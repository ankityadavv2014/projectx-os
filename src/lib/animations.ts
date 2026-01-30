/**
 * Animation variants for Framer Motion
 */

import { Variants } from "framer-motion";

// Fade in from opacity 0 to 1
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Fade in and slide up
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Fade in and slide down
export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

// Scale in
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

// Slide in from left
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

// Slide in from right
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

// Stagger children
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Stagger children faster
export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Window open animation (for OS Mode)
export const windowOpen: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

// Dock icon hover
export const dockIconHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.2,
    y: -8,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 400,
    },
  },
  tap: { scale: 0.95 },
};

// Orb pulse
export const orbPulse: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Orb expand to overlay
export const orbExpand: Variants = {
  initial: { 
    width: 48, 
    height: 48, 
    borderRadius: 24,
  },
  animate: { 
    width: "100%", 
    height: "100%", 
    borderRadius: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
    },
  },
  exit: {
    width: 48,
    height: 48,
    borderRadius: 24,
    transition: {
      duration: 0.3,
    },
  },
};

// Text reveal (letter by letter)
export const textReveal: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.02,
    },
  },
};

export const letterReveal: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// Page transition
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// Matrix rain character
export const matrixCharacter: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: [0, 1, 0.5, 1, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Glow pulse
export const glowPulse: Variants = {
  initial: { 
    boxShadow: "0 0 10px rgba(0, 212, 255, 0.3)",
  },
  animate: {
    boxShadow: [
      "0 0 10px rgba(0, 212, 255, 0.3)",
      "0 0 30px rgba(0, 212, 255, 0.6)",
      "0 0 10px rgba(0, 212, 255, 0.3)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Floating animation
export const floating: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Spring config presets
export const springConfigs = {
  gentle: { damping: 25, stiffness: 120 },
  snappy: { damping: 20, stiffness: 400 },
  bouncy: { damping: 10, stiffness: 200 },
  stiff: { damping: 30, stiffness: 500 },
} as const;
