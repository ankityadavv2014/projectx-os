"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// =============================================================================
// PROGRESS BAR
// =============================================================================

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "success" | "warning" | "error";
  showLabel?: boolean;
  label?: string;
  animate?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const variantStyles = {
  default: "bg-[var(--neon-blue)]",
  gradient: "bg-gradient-to-r from-[var(--molten-orange)] via-[var(--sacred-gold)] to-[var(--neon-blue)]",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
};

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  label,
  animate = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[var(--light-gray)]">{label}</span>
          {showLabel && (
            <span className="text-sm font-medium text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-white/10 overflow-hidden",
          sizeStyles[size]
        )}
      >
        <motion.div
          className={cn("h-full rounded-full", variantStyles[variant])}
          initial={animate ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// XP PROGRESS
// =============================================================================

interface XPProgressProps {
  currentXP: number;
  levelXP: number;
  nextLevelXP: number;
  level: number;
  className?: string;
}

export function XPProgress({
  currentXP,
  levelXP,
  nextLevelXP,
  level,
  className,
}: XPProgressProps) {
  const xpInCurrentLevel = currentXP - levelXP;
  const xpForNextLevel = nextLevelXP - levelXP;
  const percentage = (xpInCurrentLevel / xpForNextLevel) * 100;

  return (
    <div className={cn("", className)}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[var(--sacred-gold)] font-bold">⚡ Level {level}</span>
        </div>
        <span className="text-sm text-[var(--light-gray)]">
          {xpInCurrentLevel.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// PHASE PROGRESS
// =============================================================================

import type { Phase } from "@/lib/domain/types";

interface PhaseProgressProps {
  currentPhase: Phase;
  className?: string;
}

const phases: Phase[] = ["experience", "experiment", "excel", "expand"];
const phaseLabels: Record<Phase, string> = {
  experience: "Experience",
  experiment: "Experiment",
  excel: "Excel",
  expand: "Expand",
};
const phaseIcons: Record<Phase, string> = {
  experience: "🌱",
  experiment: "🧪",
  excel: "⚡",
  expand: "🚀",
};

export function PhaseProgress({ currentPhase, className }: PhaseProgressProps) {
  const currentIndex = phases.indexOf(currentPhase);

  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between">
        {phases.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLocked = index > currentIndex;

          return (
            <div key={phase} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={cn(
                    "absolute left-0 right-1/2 top-5 h-0.5 -translate-x-1/2",
                    isCompleted || isCurrent ? "bg-[var(--molten-orange)]" : "bg-white/20"
                  )}
                />
              )}
              {index < phases.length - 1 && (
                <div
                  className={cn(
                    "absolute left-1/2 right-0 top-5 h-0.5 translate-x-1/2",
                    isCompleted ? "bg-[var(--molten-orange)]" : "bg-white/20"
                  )}
                />
              )}
              
              {/* Phase indicator */}
              <div
                className={cn(
                  "relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg",
                  "border-2 transition-all duration-300",
                  isCompleted && "bg-[var(--molten-orange)] border-[var(--molten-orange)]",
                  isCurrent && "bg-[var(--deep-space)] border-[var(--molten-orange)] shadow-[0_0_15px_rgba(255,107,53,0.5)]",
                  isLocked && "bg-[var(--dark-gray)] border-white/20 opacity-50"
                )}
              >
                {isCompleted ? "✓" : phaseIcons[phase]}
              </div>
              
              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  isCurrent ? "text-[var(--molten-orange)]" : "text-[var(--light-gray)]",
                  isLocked && "opacity-50"
                )}
              >
                {phaseLabels[phase]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// CIRCULAR PROGRESS
// =============================================================================

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  showLabel = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--molten-orange)" />
            <stop offset="100%" stopColor="var(--sacred-gold)" />
          </linearGradient>
        </defs>
      </svg>
      {showLabel && (
        <span className="absolute text-lg font-bold text-white">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
