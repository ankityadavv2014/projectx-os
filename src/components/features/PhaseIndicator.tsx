"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Phase } from "@/lib/domain/types";

// =============================================================================
// PHASE INDICATOR
// =============================================================================

const phases: Phase[] = ["experience", "experiment", "excel", "expand"];

const phaseConfig: Record<Phase, { label: string; icon: string; color: string; bgColor: string }> = {
  experience: {
    label: "Experience",
    icon: "🌱",
    color: "#3B82F6",
    bgColor: "rgba(59, 130, 246, 0.2)",
  },
  experiment: {
    label: "Experiment",
    icon: "🧪",
    color: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.2)",
  },
  excel: {
    label: "Excel",
    icon: "⚡",
    color: "var(--sacred-gold)",
    bgColor: "rgba(245, 158, 11, 0.2)",
  },
  expand: {
    label: "Expand",
    icon: "🚀",
    color: "var(--molten-orange)",
    bgColor: "rgba(255, 107, 53, 0.2)",
  },
};

interface PhaseIndicatorProps {
  currentPhase: Phase;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function PhaseIndicator({
  currentPhase,
  size = "md",
  showLabel = true,
  className,
}: PhaseIndicatorProps) {
  const { label, icon, color, bgColor } = phaseConfig[currentPhase];

  const sizeStyles = {
    sm: { container: "px-2 py-1", icon: "text-sm", label: "text-xs" },
    md: { container: "px-3 py-1.5", icon: "text-lg", label: "text-sm" },
    lg: { container: "px-4 py-2", icon: "text-2xl", label: "text-base" },
  };

  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 rounded-full",
        sizeStyles[size].container,
        className
      )}
      style={{ backgroundColor: bgColor }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <span className={sizeStyles[size].icon}>{icon}</span>
      {showLabel && (
        <span
          className={cn("font-medium", sizeStyles[size].label)}
          style={{ color }}
        >
          {label}
        </span>
      )}
    </motion.div>
  );
}

// =============================================================================
// PHASE TIMELINE
// =============================================================================

interface PhaseTimelineProps {
  currentPhase: Phase;
  unlockedPhases?: Phase[];
  onPhaseClick?: (phase: Phase) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function PhaseTimeline({
  currentPhase,
  unlockedPhases = ["experience"],
  onPhaseClick,
  orientation = "horizontal",
  className,
}: PhaseTimelineProps) {
  const currentIndex = phases.indexOf(currentPhase);
  const isVertical = orientation === "vertical";

  return (
    <div
      className={cn(
        "flex",
        isVertical ? "flex-col" : "flex-row items-center justify-between",
        className
      )}
    >
      {phases.map((phase, index) => {
        const { label, icon, color } = phaseConfig[phase];
        const isUnlocked = unlockedPhases.includes(phase);
        const isCurrent = phase === currentPhase;
        const isPast = index < currentIndex;
        const isFuture = index > currentIndex;

        return (
          <div
            key={phase}
            className={cn(
              "flex items-center",
              isVertical ? "flex-row" : "flex-col",
              !isVertical && index > 0 && "flex-1"
            )}
          >
            {/* Connector Line */}
            {index > 0 && (
              <div
                className={cn(
                  isVertical ? "w-0.5 h-8 mx-5" : "h-0.5 flex-1",
                  isPast || isCurrent
                    ? "bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)]"
                    : "bg-white/20"
                )}
              />
            )}

            {/* Phase Node */}
            <motion.button
              onClick={() => isUnlocked && onPhaseClick?.(phase)}
              className={cn(
                "relative flex flex-col items-center",
                isUnlocked ? "cursor-pointer" : "cursor-not-allowed"
              )}
              whileHover={isUnlocked ? { scale: 1.1 } : undefined}
              whileTap={isUnlocked ? { scale: 0.95 } : undefined}
            >
              {/* Circle */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                  "border-2 transition-all duration-300",
                  isCurrent && [
                    "border-[var(--molten-orange)]",
                    "shadow-[0_0_20px_rgba(255,107,53,0.5)]",
                  ],
                  isPast && "bg-[var(--molten-orange)] border-[var(--molten-orange)]",
                  isFuture && !isUnlocked && "bg-[var(--dark-gray)] border-white/20 opacity-40"
                )}
                style={{
                  backgroundColor: isCurrent ? phaseConfig[phase].bgColor : undefined,
                  borderColor: isCurrent ? color : undefined,
                }}
              >
                {isPast ? "✓" : icon}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  isCurrent && "text-[var(--molten-orange)]",
                  isPast && "text-white",
                  isFuture && "text-[var(--light-gray)]/50"
                )}
              >
                {label}
              </span>

              {/* Current indicator */}
              {isCurrent && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--molten-orange)]"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// PHASE CARD
// =============================================================================

interface PhaseCardProps {
  phase: Phase;
  isUnlocked?: boolean;
  isCurrent?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PhaseCard({
  phase,
  isUnlocked = false,
  isCurrent = false,
  onClick,
  className,
}: PhaseCardProps) {
  const { label, icon, color, bgColor } = phaseConfig[phase];

  return (
    <motion.button
      onClick={isUnlocked ? onClick : undefined}
      className={cn(
        "relative p-6 rounded-2xl text-left",
        "border-2 transition-all duration-300",
        isUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-50",
        isCurrent && "border-[var(--molten-orange)] shadow-[0_0_30px_rgba(255,107,53,0.3)]",
        !isCurrent && isUnlocked && "border-white/10 hover:border-white/30",
        !isUnlocked && "border-white/10",
        className
      )}
      style={{
        backgroundColor: isCurrent ? bgColor : "var(--dark-gray)",
      }}
      whileHover={isUnlocked ? { scale: 1.02 } : undefined}
      whileTap={isUnlocked ? { scale: 0.98 } : undefined}
    >
      {/* Icon */}
      <div className="text-4xl mb-4">{icon}</div>

      {/* Label */}
      <h3
        className="text-xl font-bold"
        style={{ color: isCurrent ? color : "white" }}
      >
        {label}
      </h3>

      {/* Status */}
      <div className="mt-2 flex items-center gap-2 text-sm">
        {isCurrent && (
          <span className="text-[var(--molten-orange)] font-medium">Current Phase</span>
        )}
        {!isCurrent && isUnlocked && (
          <span className="text-green-400">✓ Completed</span>
        )}
        {!isUnlocked && (
          <span className="text-[var(--light-gray)]/60">🔒 Locked</span>
        )}
      </div>

      {/* Lock overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 rounded-2xl bg-black/30 flex items-center justify-center">
          <span className="text-4xl">🔒</span>
        </div>
      )}
    </motion.button>
  );
}
