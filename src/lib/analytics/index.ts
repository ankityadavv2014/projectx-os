// ProjectX OS - Analytics & Event Tracking
'use client';

import { useCallback } from 'react';
import type { UserRole, BaseEvent } from '@/lib/domain/types';

// =============================================================================
// CONSTANTS
// =============================================================================

const EVENT_STORAGE_KEY = 'projectx_events';
const SESSION_STORAGE_KEY = 'projectx_session';
const SCHEMA_VERSION = '1.0.0';

// =============================================================================
// HELPERS
// =============================================================================

function generateId(): string {
  return crypto.randomUUID();
}

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
}

function getStoredEvents(): BaseEvent[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(EVENT_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function storeEvent(event: BaseEvent): void {
  if (typeof window === 'undefined') return;
  const events = getStoredEvents();
  events.push(event);
  
  // Keep only last 1000 events to prevent storage bloat
  const trimmed = events.slice(-1000);
  localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(trimmed));
}

// =============================================================================
// CORE TRACKING FUNCTION
// =============================================================================

interface TrackOptions {
  userId?: string;
  userRole?: UserRole;
  orgId?: string;
  cohortId?: string;
}

export function trackEvent(
  eventType: string,
  properties: Record<string, unknown> = {},
  options: TrackOptions = {}
): void {
  const event: BaseEvent = {
    eventId: generateId(),
    eventType,
    timestamp: new Date().toISOString(),
    userId: options.userId,
    userRole: options.userRole,
    orgId: options.orgId,
    cohortId: options.cohortId,
    sessionId: getSessionId(),
    source: 'web',
    version: SCHEMA_VERSION,
    properties,
  };
  
  // Store locally
  storeEvent(event);
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventType, properties);
  }
  
  // TODO: Send to analytics backend
  // sendToBackend(event);
}

// =============================================================================
// TYPED EVENT FUNCTIONS
// =============================================================================

// User Lifecycle
export const events = {
  // User lifecycle
  userSignedUp: (method: 'email' | 'google' | 'sso', role: UserRole) =>
    trackEvent('user.signed_up', { method, role }),
  
  userOnboarded: (role: UserRole, durationSeconds: number) =>
    trackEvent('user.onboarded', { role, onboardingDuration: durationSeconds }),
  
  userLoggedIn: (method: 'password' | 'magic_link' | 'sso') =>
    trackEvent('user.logged_in', { method }),
  
  userLoggedOut: (reason: 'manual' | 'timeout' | 'forced') =>
    trackEvent('user.logged_out', { reason }),
  
  // OS Experience
  osEntered: (entryPoint: 'landing' | 'direct' | 'deep_link') =>
    trackEvent('os.entered', { entryPoint, bootAnimationShown: true }),
  
  osExited: (destination: 'landing' | 'logout' | 'external', sessionDuration: number) =>
    trackEvent('os.exited', { destination, sessionDuration }),
  
  osAppOpened: (appId: string, appName: string, method: 'dock' | 'desktop' | 'search' | 'shortcut') =>
    trackEvent('os.app_opened', { appId, appName, openMethod: method }),
  
  // Missions
  missionViewed: (missionId: string, missionTitle: string, isAssigned: boolean) =>
    trackEvent('mission.viewed', { missionId, missionTitle, isAssigned }),
  
  missionStarted: (missionId: string, missionTitle: string, dueDate?: string) =>
    trackEvent('mission.started', { missionId, missionTitle, dueDate }),
  
  missionCompleted: (missionId: string, missionTitle: string, timeToCompleteSeconds: number) =>
    trackEvent('mission.completed', { missionId, missionTitle, timeToComplete: timeToCompleteSeconds }),
  
  // Submissions
  artifactUploaded: (missionId: string, type: 'image' | 'video' | 'file' | 'link', fileSize?: number) =>
    trackEvent('artifact.uploaded', { missionId, artifactType: type, fileSize }),
  
  artifactSubmitted: (submissionId: string, missionId: string, hasReflection: boolean, reflectionLength: number) =>
    trackEvent('artifact.submitted', { submissionId, missionId, hasReflection, reflectionLength }),
  
  submissionReviewed: (submissionId: string, missionId: string, studentId: string, reviewDurationSeconds: number, totalScore: number) =>
    trackEvent('submission.reviewed', { submissionId, missionId, studentId, reviewDuration: reviewDurationSeconds, overallScore: totalScore }),
  
  submissionApproved: (submissionId: string, missionId: string, studentId: string, xpAwarded: number, badgesAwarded: string[]) =>
    trackEvent('submission.approved', { submissionId, missionId, studentId, xpAwarded, badgesAwarded }),
  
  submissionRevisionRequested: (submissionId: string, missionId: string, studentId: string, feedback: string) =>
    trackEvent('submission.revision_requested', { submissionId, missionId, studentId, feedback }),
  
  // XP & Progression
  xpAwarded: (amount: number, source: 'mission' | 'badge' | 'bonus' | 'streak', sourceId: string, totalXp: number, levelBefore: number, levelAfter: number) =>
    trackEvent('xp.awarded', { xpAmount: amount, source, sourceId, totalXp, levelBefore, levelAfter }),
  
  levelUp: (newLevel: number, previousLevel: number, tierName: string, totalXp: number) =>
    trackEvent('level.up', { newLevel, previousLevel, tierName, totalXp, celebrationShown: true }),
  
  badgeUnlocked: (badgeId: string, badgeName: string, rarity: string, xpBonus: number) =>
    trackEvent('badge.unlocked', { badgeId, badgeName, badgeRarity: rarity, xpBonus }),
  
  // Parent Portal
  parentLinkedChild: (childId: string, method: 'code' | 'invite') =>
    trackEvent('parent.linked_child', { childId, linkMethod: method }),
  
  parentViewedProgress: (childId: string, section: 'overview' | 'artifacts' | 'badges' | 'feedback') =>
    trackEvent('parent.viewed_progress', { childId, sectionViewed: section }),
  
  // Platform
  demoRequested: (email: string, schoolName?: string, role?: string, source?: string) =>
    trackEvent('demo.requested', { email, schoolName, role, source }),
  
  errorOccurred: (errorCode: string, errorMessage: string, context: Record<string, unknown>) =>
    trackEvent('error.occurred', { errorCode, errorMessage, context }),
};

// =============================================================================
// REACT HOOK
// =============================================================================

export function useAnalytics(userId?: string, userRole?: UserRole, orgId?: string) {
  const track = useCallback((
    eventType: string,
    properties: Record<string, unknown> = {}
  ) => {
    trackEvent(eventType, properties, { userId, userRole, orgId });
  }, [userId, userRole, orgId]);
  
  return { track, events };
}

// =============================================================================
// DEBUG UTILITIES
// =============================================================================

export const analyticsDebug = {
  getEvents: () => getStoredEvents(),
  
  clearEvents: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(EVENT_STORAGE_KEY);
    }
  },
  
  getEventsByType: (type: string) => 
    getStoredEvents().filter(e => e.eventType === type),
  
  getRecentEvents: (count: number = 20) =>
    getStoredEvents().slice(-count),
  
  enableLogging: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('DEBUG_EVENTS', 'true');
    }
  },
  
  disableLogging: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('DEBUG_EVENTS');
    }
  },
};
