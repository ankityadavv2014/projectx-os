"use client";

import { motion } from "framer-motion";
import { useXPStore } from "@/stores/xp-store";
import { getTierColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface XPBarProps {
  className?: string;
  showLevel?: boolean;
  compact?: boolean;
}

export function XPBar({ className, showLevel = true, compact = false }: XPBarProps) {
  const { xp, getLevel, getProgress, getTier } = useXPStore();
  const level = getLevel();
  const progress = getProgress();
  const tier = getTier();
  const tierColor = getTierColor(tier);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: tierColor, color: "#0a0a0f" }}
        >
          {level}
        </div>
        <div className="w-20 h-2 bg-[var(--dark-gray)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--molten-orange)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-4 rounded-xl bg-[var(--dark-gray)] border border-white/10", className)}>
      {/* Level and tier */}
      {showLevel && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: tierColor, color: "#0a0a0f" }}
            >
              {level}
            </div>
            <div>
              <div className="text-sm font-medium text-white">Level {level}</div>
              <div className="text-xs" style={{ color: tierColor }}>{tier}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-[var(--molten-orange)]">{xp} XP</div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="relative">
        <div className="h-3 bg-[var(--deep-space)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--molten-orange)] to-[var(--sacred-gold)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-[var(--light-gray)]/60">
          <span>{progress.current} XP</span>
          <span>{progress.required} XP to next level</span>
        </div>
      </div>
    </div>
  );
}

// XP popup notification
interface XPPopupProps {
  amount: number;
  reason: string;
  onComplete: () => void;
}

export function XPPopup({ amount, reason, onComplete }: XPPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      onAnimationComplete={onComplete}
      transition={{ duration: 0.3 }}
      className="fixed bottom-8 right-8 z-50 p-4 rounded-xl bg-[var(--dark-gray)] border border-[var(--molten-orange)]/50 shadow-[0_0_30px_rgba(255,107,53,0.3)]"
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl">⚡</div>
        <div>
          <div className="text-xl font-bold text-[var(--molten-orange)]">+{amount} XP</div>
          <div className="text-sm text-[var(--light-gray)]/70">{reason}</div>
        </div>
      </div>
    </motion.div>
  );
}

// Level badge
interface LevelBadgeProps {
  level: number;
  tier: string;
  size?: "sm" | "md" | "lg";
}

export function LevelBadge({ level, tier, size = "md" }: LevelBadgeProps) {
  const tierColor = getTierColor(tier);
  
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold",
        "shadow-[0_0_15px_rgba(0,0,0,0.3)]",
        sizeClasses[size]
      )}
      style={{ 
        backgroundColor: tierColor, 
        color: "#0a0a0f",
        boxShadow: `0 0 20px ${tierColor}40`
      }}
    >
      {level}
    </div>
  );
}
