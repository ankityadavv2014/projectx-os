"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  xpEventsStore,
  usersStore,
  currentUserStore,
} from "@/lib/domain/store";
import type { XPEvent, User, XPSource } from "@/lib/domain/types";
import { useCurrentUser } from "./useUser";

// =============================================================================
// XP LEVEL CALCULATIONS
// =============================================================================

const XP_PER_LEVEL_BASE = 100;
const XP_LEVEL_MULTIPLIER = 1.5;

export function calculateLevelFromXP(xp: number): number {
  let level = 1;
  let xpNeeded = XP_PER_LEVEL_BASE;
  let totalXPForLevel = 0;
  
  while (totalXPForLevel + xpNeeded <= xp) {
    totalXPForLevel += xpNeeded;
    level++;
    xpNeeded = Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_LEVEL_MULTIPLIER, level - 1));
  }
  
  return level;
}

export function calculateXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_LEVEL_MULTIPLIER, i - 1));
  }
  return total;
}

export function calculateXPForNextLevel(level: number): number {
  return calculateXPForLevel(level + 1);
}

export function getTierFromLevel(level: number): string {
  if (level >= 50) return "Legendary";
  if (level >= 40) return "Master";
  if (level >= 30) return "Expert";
  if (level >= 20) return "Advanced";
  if (level >= 10) return "Intermediate";
  if (level >= 5) return "Beginner";
  return "Novice";
}

// =============================================================================
// USE XP
// =============================================================================

interface XPStats {
  totalXP: number;
  level: number;
  tier: string;
  currentLevelXP: number;
  nextLevelXP: number;
  xpInCurrentLevel: number;
  progressPercentage: number;
}

interface UseXPReturn extends XPStats {
  events: XPEvent[];
  recentEvents: XPEvent[];
  isLoading: boolean;
  awardXP: (amount: number, description: string, source: XPSource, sourceId?: string) => void;
  refresh: () => void;
}

export function useXP(): UseXPReturn {
  const { user, updateProfile } = useCurrentUser();
  const [events, setEvents] = useState<XPEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEvents = useCallback(() => {
    if (!user) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const userEvents = xpEventsStore.getByUser(user.id);
    // Sort by most recent first
    userEvents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setEvents(userEvents);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const totalXP = user?.xp || 0;
  const level = calculateLevelFromXP(totalXP);
  const tier = getTierFromLevel(level);
  const currentLevelXP = calculateXPForLevel(level);
  const nextLevelXP = calculateXPForNextLevel(level);
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const progressPercentage = ((xpInCurrentLevel) / (nextLevelXP - currentLevelXP)) * 100;

  const recentEvents = useMemo(() => events.slice(0, 5), [events]);

  const awardXP = useCallback((
    amount: number,
    description: string,
    source: XPSource,
    sourceId?: string
  ) => {
    if (!user) return;

    const totalBefore = user.xp;
    const totalAfter = user.xp + amount;

    const event: XPEvent = {
      id: `xp_${Date.now()}`,
      userId: user.id,
      amount,
      source,
      sourceId,
      sourceDescription: description,
      totalBefore,
      totalAfter,
      createdAt: new Date().toISOString(),
    };

    xpEventsStore.create(event);

    const newXP = totalAfter;
    const newLevel = calculateLevelFromXP(newXP);
    const newTier = getTierFromLevel(newLevel);

    updateProfile({
      xp: newXP,
      level: newLevel,
      tier: newTier,
    });

    loadEvents();
  }, [user, updateProfile, loadEvents]);

  return {
    totalXP,
    level,
    tier,
    currentLevelXP,
    nextLevelXP,
    xpInCurrentLevel,
    progressPercentage,
    events,
    recentEvents,
    isLoading,
    awardXP,
    refresh: loadEvents,
  };
}

// =============================================================================
// USE XP LEADERBOARD
// =============================================================================

interface LeaderboardEntry {
  user: User;
  rank: number;
  xp: number;
  level: number;
  tier: string;
}

interface UseLeaderboardOptions {
  cohortId?: string;
  limit?: number;
}

interface UseLeaderboardReturn {
  leaderboard: LeaderboardEntry[];
  myRank: number | null;
  isLoading: boolean;
  refresh: () => void;
}

export function useLeaderboard(options?: UseLeaderboardOptions): UseLeaderboardReturn {
  const { user } = useCurrentUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLeaderboard = useCallback(() => {
    setIsLoading(true);
    
    let students = usersStore.getByRole("student");
    
    if (options?.cohortId) {
      students = students.filter(s => s.cohortIds.includes(options.cohortId!));
    }

    // Sort by XP descending
    students.sort((a, b) => b.xp - a.xp);

    // Limit results
    const limit = options?.limit || 10;
    const topStudents = students.slice(0, limit);

    const entries: LeaderboardEntry[] = topStudents.map((student, index) => ({
      user: student,
      rank: index + 1,
      xp: student.xp,
      level: student.level,
      tier: student.tier,
    }));

    setLeaderboard(entries);
    setIsLoading(false);
  }, [options?.cohortId, options?.limit]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const myRank = useMemo(() => {
    if (!user) return null;
    
    const students = usersStore.getByRole("student");
    students.sort((a, b) => b.xp - a.xp);
    const index = students.findIndex(s => s.id === user.id);
    
    return index === -1 ? null : index + 1;
  }, [user, leaderboard]);

  return {
    leaderboard,
    myRank,
    isLoading,
    refresh: loadLeaderboard,
  };
}
