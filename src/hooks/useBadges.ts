"use client";

import { useState, useEffect, useCallback } from "react";
import {
  badgesStore,
  userBadgesStore,
} from "@/lib/domain/store";
import type { Badge, UserBadge } from "@/lib/domain/types";
import { useCurrentUser } from "./useUser";

// =============================================================================
// USE BADGES
// =============================================================================

interface UseBadgesReturn {
  badges: Badge[];
  isLoading: boolean;
  getById: (id: string) => Badge | null;
  refresh: () => void;
}

export function useBadges(): UseBadgesReturn {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBadges = useCallback(() => {
    setIsLoading(true);
    const allBadges = badgesStore.getAll();
    setBadges(allBadges);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadBadges();
  }, [loadBadges]);

  const getById = useCallback((id: string) => {
    return badgesStore.getById(id);
  }, []);

  return {
    badges,
    isLoading,
    getById,
    refresh: loadBadges,
  };
}

// =============================================================================
// USE MY BADGES
// =============================================================================

interface EarnedBadge extends UserBadge {
  badge: Badge;
}

interface UseMyBadgesReturn {
  earned: EarnedBadge[];
  available: Badge[];
  count: number;
  isLoading: boolean;
  hasBadge: (badgeId: string) => boolean;
  refresh: () => void;
}

export function useMyBadges(): UseMyBadgesReturn {
  const { user } = useCurrentUser();
  const { badges } = useBadges();
  const [earned, setEarned] = useState<EarnedBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserBadges = useCallback(() => {
    if (!user) {
      setEarned([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const userBadges = userBadgesStore.getByUser(user.id);
    
    const enriched: EarnedBadge[] = userBadges
      .map(ub => {
        const badge = badges.find(b => b.id === ub.badgeId);
        if (!badge) return null;
        return { ...ub, badge };
      })
      .filter((b): b is EarnedBadge => b !== null);
    
    setEarned(enriched);
    setIsLoading(false);
  }, [user, badges]);

  useEffect(() => {
    loadUserBadges();
  }, [loadUserBadges]);

  const available = badges.filter(b => 
    !earned.some(e => e.badgeId === b.id)
  );

  const hasBadge = useCallback((badgeId: string) => {
    return earned.some(e => e.badgeId === badgeId);
  }, [earned]);

  return {
    earned,
    available,
    count: earned.length,
    isLoading,
    hasBadge,
    refresh: loadUserBadges,
  };
}

// =============================================================================
// USE BADGE ACTIONS
// =============================================================================

interface BadgeActions {
  awardBadge: (badgeId: string, earnedVia?: string) => UserBadge | null;
}

export function useBadgeActions(): BadgeActions {
  const { user } = useCurrentUser();

  const awardBadge = useCallback((badgeId: string, earnedVia?: string) => {
    if (!user) return null;

    // Check if already has badge
    const existing = userBadgesStore.getByUser(user.id);
    if (existing.some(ub => ub.badgeId === badgeId)) {
      return null;
    }

    const userBadge: UserBadge = {
      id: `ub_${Date.now()}`,
      userId: user.id,
      badgeId,
      earnedVia: earnedVia || "manual",
      earnedAt: new Date().toISOString(),
    };

    return userBadgesStore.create(userBadge);
  }, [user]);

  return {
    awardBadge,
  };
}
