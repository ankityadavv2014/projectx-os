"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "../ui/Card";
import { Badge, PhaseBadge, StatusBadge } from "../ui/Badge";
import { ProgressBar } from "../ui/Progress";
import type { Mission } from "@/lib/domain/types";

// =============================================================================
// MISSION CARD
// =============================================================================

type MissionProgressStatus = "locked" | "available" | "in_progress" | "submitted" | "completed";

interface MissionCardProps {
  mission: Mission;
  progressStatus?: MissionProgressStatus;
  progress?: number;
  onClick?: () => void;
  className?: string;
  showProgress?: boolean;
}

const difficultyColors = {
  easy: "success",
  medium: "warning",
  hard: "error",
} as const;

const statusIcons: Record<MissionProgressStatus, string> = {
  locked: "🔒",
  available: "🎯",
  in_progress: "⏳",
  submitted: "📤",
  completed: "✅",
};

export function MissionCard({
  mission,
  progressStatus = "available",
  progress = 0,
  onClick,
  className,
  showProgress = true,
}: MissionCardProps) {
  const isLocked = progressStatus === "locked";
  
  return (
    <Card
      hover={!isLocked}
      onClick={isLocked ? undefined : onClick}
      className={cn(
        isLocked && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {/* Cover Image */}
      {mission.coverImage && (
        <div className="relative h-36 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden">
          <img
            src={mission.coverImage}
            alt={mission.title}
            className="w-full h-full object-cover"
          />
          {isLocked && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-4xl">🔒</span>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-white text-lg line-clamp-2">
            {mission.title}
          </h3>
          <p className="text-sm text-[var(--light-gray)]/70 line-clamp-2 mt-1">
            {mission.description}
          </p>
        </div>
        <span className="text-2xl flex-shrink-0">{statusIcons[progressStatus]}</span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant={difficultyColors[mission.difficulty]} size="sm">
          {mission.difficulty}
        </Badge>
        <Badge variant="default" size="sm">
          ⏱️ {mission.estimatedMinutes} min
        </Badge>
        <Badge variant="gold" size="sm">
          ⚡ {mission.xpReward} XP
        </Badge>
      </div>

      {/* Progress */}
      {showProgress && progressStatus !== "available" && progressStatus !== "locked" && (
        <ProgressBar
          value={progress}
          variant={progressStatus === "completed" ? "success" : "gradient"}
          size="sm"
          className="mt-auto"
        />
      )}

      {/* CTA */}
      {progressStatus === "available" && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <span className="text-[var(--neon-blue)] text-sm font-medium flex items-center gap-1">
            Start Mission
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      )}
    </Card>
  );
}

// =============================================================================
// MISSION CARD COMPACT
// =============================================================================

interface MissionCardCompactProps {
  mission: Mission;
  progressStatus?: MissionProgressStatus;
  onClick?: () => void;
  className?: string;
}

export function MissionCardCompact({
  mission,
  progressStatus = "available",
  onClick,
  className,
}: MissionCardCompactProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl text-left",
        "bg-[var(--dark-gray)] border border-white/10",
        "hover:bg-white/5 transition-all",
        "flex items-center gap-4",
        className
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">
        {statusIcons[progressStatus]}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white truncate">{mission.title}</h4>
        <div className="flex items-center gap-3 mt-1 text-sm text-[var(--light-gray)]/60">
          <span>⏱️ {mission.estimatedMinutes} min</span>
          <span>⚡ {mission.xpReward} XP</span>
        </div>
      </div>

      {/* Arrow */}
      <svg className="w-5 h-5 text-[var(--light-gray)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </motion.button>
  );
}

// =============================================================================
// MISSION LIST
// =============================================================================

interface MissionListProps {
  missions: Array<Mission & { progressStatus?: MissionProgressStatus; progress?: number }>;
  onMissionClick?: (mission: Mission) => void;
  variant?: "card" | "compact";
  emptyMessage?: string;
  className?: string;
}

export function MissionList({
  missions,
  onMissionClick,
  variant = "card",
  emptyMessage = "No missions available",
  className,
}: MissionListProps) {
  if (missions.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--light-gray)]/60">
        {emptyMessage}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        {missions.map((mission) => (
          <MissionCardCompact
            key={mission.id}
            mission={mission}
            progressStatus={mission.progressStatus}
            onClick={() => onMissionClick?.(mission)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
      {missions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          progressStatus={mission.progressStatus}
          progress={mission.progress}
          onClick={() => onMissionClick?.(mission)}
        />
      ))}
    </div>
  );
}
