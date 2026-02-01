"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "../ui/Card";
import type { Badge as BadgeType, UserBadge } from "@/lib/domain/types";

// =============================================================================
// BADGE DISPLAY
// =============================================================================

interface BadgeDisplayProps {
  badge: BadgeType;
  earned?: boolean;
  earnedAt?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
}

const sizeStyles = {
  sm: { container: "w-12 h-12", icon: "text-xl" },
  md: { container: "w-16 h-16", icon: "text-2xl" },
  lg: { container: "w-24 h-24", icon: "text-4xl" },
};

const rarityColors = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-[var(--sacred-gold)] to-[var(--molten-orange)]",
};

const rarityGlows = {
  common: "",
  rare: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
  epic: "shadow-[0_0_15px_rgba(168,85,247,0.4)]",
  legendary: "shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse",
};

export function BadgeDisplay({
  badge,
  earned = true,
  earnedAt,
  size = "md",
  onClick,
  className,
}: BadgeDisplayProps) {
  const { container, icon } = sizeStyles[size];
  
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center group",
        !earned && "opacity-40 grayscale",
        className
      )}
      whileHover={earned ? { scale: 1.05 } : undefined}
      whileTap={earned ? { scale: 0.95 } : undefined}
    >
      {/* Badge Icon */}
      <div
        className={cn(
          container,
          "rounded-full flex items-center justify-center",
          "bg-gradient-to-br",
          rarityColors[badge.rarity],
          earned && rarityGlows[badge.rarity]
        )}
      >
        {badge.iconUrl ? (
          <img src={badge.iconUrl} alt={badge.name} className="w-2/3 h-2/3 object-contain" />
        ) : (
          <span className={icon}>🏆</span>
        )}
      </div>

      {/* Badge Name */}
      {size !== "sm" && (
        <span className="mt-2 text-sm font-medium text-white text-center max-w-[80px] line-clamp-2">
          {badge.name}
        </span>
      )}

      {/* Earned indicator */}
      {earned && (
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}

      {/* Lock for unearned */}
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🔒</span>
        </div>
      )}
    </motion.button>
  );
}

// =============================================================================
// BADGE GRID
// =============================================================================

interface EarnedBadgeWithDetails extends UserBadge {
  badge: BadgeType;
}

interface BadgeGridProps {
  badges: BadgeType[];
  earnedBadges?: EarnedBadgeWithDetails[];
  onBadgeClick?: (badge: BadgeType) => void;
  showUnearnedHidden?: boolean;
  columns?: 4 | 5 | 6;
  className?: string;
}

export function BadgeGrid({
  badges,
  earnedBadges = [],
  onBadgeClick,
  showUnearnedHidden = false,
  columns = 5,
  className,
}: BadgeGridProps) {
  const earnedIds = new Set(earnedBadges.map(eb => eb.badgeId));
  
  const displayBadges = showUnearnedHidden
    ? badges.filter(b => earnedIds.has(b.id))
    : badges;

  const columnClasses = {
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };

  return (
    <div className={cn("grid gap-4", columnClasses[columns], className)}>
      {displayBadges.map((badge) => {
        const earnedBadge = earnedBadges.find(eb => eb.badgeId === badge.id);
        return (
          <BadgeDisplay
            key={badge.id}
            badge={badge}
            earned={!!earnedBadge}
            earnedAt={earnedBadge?.earnedAt}
            onClick={() => onBadgeClick?.(badge)}
          />
        );
      })}
    </div>
  );
}

// =============================================================================
// BADGE DETAIL CARD
// =============================================================================

interface BadgeDetailCardProps {
  badge: BadgeType;
  earned?: boolean;
  earnedAt?: string;
  className?: string;
}

export function BadgeDetailCard({
  badge,
  earned = false,
  earnedAt,
  className,
}: BadgeDetailCardProps) {
  return (
    <Card className={cn("text-center", className)}>
      <BadgeDisplay badge={badge} earned={earned} size="lg" className="mx-auto" />
      
      <h3 className="mt-4 text-xl font-bold text-white">{badge.name}</h3>
      <p className="mt-2 text-[var(--light-gray)]/70">{badge.description}</p>
      
      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <span className="text-[var(--sacred-gold)]">
          +{badge.xpBonus} XP Bonus
        </span>
        <span className={cn(
          "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
          badge.rarity === "common" && "bg-gray-500/20 text-gray-400",
          badge.rarity === "rare" && "bg-blue-500/20 text-blue-400",
          badge.rarity === "epic" && "bg-purple-500/20 text-purple-400",
          badge.rarity === "legendary" && "bg-[var(--sacred-gold)]/20 text-[var(--sacred-gold)]"
        )}>
          {badge.rarity}
        </span>
      </div>

      {earned && earnedAt && (
        <p className="mt-4 text-sm text-[var(--light-gray)]/60">
          Earned on {new Date(earnedAt).toLocaleDateString()}
        </p>
      )}

      {!earned && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-[var(--light-gray)]/60">
            Complete the requirements to unlock this badge
          </p>
        </div>
      )}
    </Card>
  );
}

// =============================================================================
// RECENT BADGES
// =============================================================================

interface RecentBadgesProps {
  badges: EarnedBadgeWithDetails[];
  maxDisplay?: number;
  className?: string;
}

export function RecentBadges({ badges, maxDisplay = 5, className }: RecentBadgesProps) {
  const sorted = [...badges].sort(
    (a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
  );
  const display = sorted.slice(0, maxDisplay);

  return (
    <div className={cn("flex gap-2", className)}>
      {display.map((eb) => (
        <BadgeDisplay
          key={eb.id}
          badge={eb.badge}
          earned
          size="sm"
        />
      ))}
      {badges.length > maxDisplay && (
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-sm text-[var(--light-gray)]">
          +{badges.length - maxDisplay}
        </div>
      )}
    </div>
  );
}
