import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Delay utility for simulating async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Calculate level from XP
 * XP required per level increases: level * 100
 */
export function calculateLevel(xp: number): number {
  let level = 1;
  let xpForNextLevel = 100;
  let totalXpNeeded = 0;

  while (xp >= totalXpNeeded + xpForNextLevel) {
    totalXpNeeded += xpForNextLevel;
    level++;
    xpForNextLevel = level * 100;
  }

  return level;
}

/**
 * Calculate XP progress to next level
 */
export function calculateXPProgress(xp: number): { current: number; required: number; percentage: number } {
  const level = calculateLevel(xp);
  
  // Calculate XP needed for current level
  let xpForCurrentLevel = 0;
  for (let i = 1; i < level; i++) {
    xpForCurrentLevel += i * 100;
  }
  
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpForNextLevel = level * 100;
  const percentage = (xpInCurrentLevel / xpForNextLevel) * 100;

  return {
    current: xpInCurrentLevel,
    required: xpForNextLevel,
    percentage: Math.min(percentage, 100),
  };
}

/**
 * Get level tier name
 */
export function getLevelTier(level: number): string {
  if (level <= 5) return "Bronze";
  if (level <= 10) return "Silver";
  if (level <= 15) return "Gold";
  if (level <= 20) return "Platinum";
  return "Diamond";
}

/**
 * Get tier color
 */
export function getTierColor(tier: string): string {
  switch (tier) {
    case "Bronze":
      return "#cd7f32";
    case "Silver":
      return "#c0c0c0";
    case "Gold":
      return "#ffd700";
    case "Platinum":
      return "#e5e4e2";
    case "Diamond":
      return "#b9f2ff";
    default:
      return "#ffffff";
  }
}

/**
 * Sanitize input for security
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .trim()
    .slice(0, 500)
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "");
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (!isBrowser()) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
