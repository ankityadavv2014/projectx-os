"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import { PhaseBadge } from "../ui/Badge";
import type { User, Phase } from "@/lib/domain/types";

// =============================================================================
// USER CARD
// =============================================================================

interface UserCardProps {
  user: User;
  onClick?: () => void;
  showXP?: boolean;
  showPhase?: boolean;
  className?: string;
}

export function UserCard({
  user,
  onClick,
  showXP = true,
  showPhase = true,
  className,
}: UserCardProps) {
  return (
    <Card hover onClick={onClick} className={className}>
      <div className="flex items-center gap-4">
        <Avatar
          src={user.avatarUrl}
          name={user.displayName}
          size="lg"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">
            {user.displayName}
          </h3>
          <p className="text-sm text-[var(--light-gray)]/60 capitalize">
            {user.role}
          </p>
        </div>

        <div className="text-right">
          {showXP && user.role === "student" && (
            <div className="text-lg font-bold text-[var(--sacred-gold)]">
              {user.xp.toLocaleString()} XP
            </div>
          )}
          {showPhase && user.role === "student" && (
            <PhaseBadge phase={user.currentPhase} size="sm" />
          )}
        </div>
      </div>
    </Card>
  );
}

// =============================================================================
// USER LIST ITEM (Compact)
// =============================================================================

interface UserListItemProps {
  user: User;
  onClick?: () => void;
  trailing?: React.ReactNode;
  className?: string;
}

export function UserListItem({
  user,
  onClick,
  trailing,
  className,
}: UserListItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-full p-3 rounded-lg text-left",
        "hover:bg-white/5 transition-all",
        "flex items-center gap-3",
        className
      )}
      whileHover={{ x: 4 }}
    >
      <Avatar src={user.avatarUrl} name={user.displayName} size="sm" />
      
      <div className="flex-1 min-w-0">
        <span className="text-white truncate block">{user.displayName}</span>
      </div>

      {trailing}
    </motion.button>
  );
}

// =============================================================================
// LEADERBOARD ENTRY
// =============================================================================

interface LeaderboardEntryProps {
  rank: number;
  user: User;
  xp: number;
  isCurrentUser?: boolean;
  className?: string;
}

export function LeaderboardEntry({
  rank,
  user,
  xp,
  isCurrentUser = false,
  className,
}: LeaderboardEntryProps) {
  const rankColors: Record<number, string> = {
    1: "text-[var(--sacred-gold)]",
    2: "text-gray-400",
    3: "text-amber-700",
  };

  const rankEmojis: Record<number, string> = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
  };

  return (
    <motion.div
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl",
        isCurrentUser ? "bg-[var(--neon-blue)]/10 border border-[var(--neon-blue)]/30" : "bg-[var(--dark-gray)]",
        className
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
    >
      {/* Rank */}
      <div className={cn(
        "w-8 text-center font-bold text-lg",
        rankColors[rank] || "text-[var(--light-gray)]"
      )}>
        {rankEmojis[rank] || rank}
      </div>

      {/* Avatar */}
      <Avatar src={user.avatarUrl} name={user.displayName} size="md" />

      {/* Name */}
      <div className="flex-1">
        <span className={cn(
          "font-medium",
          isCurrentUser ? "text-[var(--neon-blue)]" : "text-white"
        )}>
          {user.displayName}
          {isCurrentUser && " (You)"}
        </span>
        <span className="block text-sm text-[var(--light-gray)]/60">
          Level {user.level} • {user.tier}
        </span>
      </div>

      {/* XP */}
      <div className="text-right">
        <span className="text-lg font-bold text-[var(--sacred-gold)]">
          {xp.toLocaleString()}
        </span>
        <span className="text-sm text-[var(--light-gray)]/60 ml-1">XP</span>
      </div>
    </motion.div>
  );
}

// =============================================================================
// LEADERBOARD
// =============================================================================

interface LeaderboardProps {
  entries: Array<{
    rank: number;
    user: User;
    xp: number;
  }>;
  currentUserId?: string;
  className?: string;
}

export function Leaderboard({ entries, currentUserId, className }: LeaderboardProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {entries.map((entry) => (
        <LeaderboardEntry
          key={entry.user.id}
          rank={entry.rank}
          user={entry.user}
          xp={entry.xp}
          isCurrentUser={entry.user.id === currentUserId}
        />
      ))}
    </div>
  );
}
