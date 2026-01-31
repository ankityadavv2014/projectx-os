# ProjectX OS — Event Schema

> **Version**: 1.0.0  
> **Last Updated**: January 30, 2026

## Overview

This document defines the event schema for analytics, XP engine, and platform telemetry in ProjectX OS.

---

## 1. Event Structure

### Base Event Schema

```typescript
interface BaseEvent {
  // Identity
  eventId: string;          // UUID v4
  eventType: string;        // Dot-notation event type
  
  // Timestamp
  timestamp: string;        // ISO 8601
  
  // Actor
  userId?: string;          // Who triggered
  userRole?: UserRole;      // Role at time of event
  sessionId?: string;       // Browser session
  
  // Context
  orgId?: string;           // Organization
  cohortId?: string;        // Cohort if applicable
  
  // Source
  source: 'web' | 'mobile' | 'api' | 'system';
  version: string;          // Schema version
  
  // Payload
  properties: Record<string, any>;
}
```

---

## 2. Core Events

### 2.1 User Lifecycle

#### `user.signed_up`
User created an account.

```typescript
{
  eventType: 'user.signed_up',
  properties: {
    method: 'email' | 'google' | 'sso',
    role: UserRole,
    inviteCode?: string,
    cohortCode?: string,
  }
}
```

#### `user.onboarded`
User completed onboarding flow.

```typescript
{
  eventType: 'user.onboarded',
  properties: {
    role: UserRole,
    onboardingDuration: number,  // seconds
    stepsCompleted: string[],
  }
}
```

#### `user.logged_in`
User authenticated.

```typescript
{
  eventType: 'user.logged_in',
  properties: {
    method: 'password' | 'magic_link' | 'sso',
  }
}
```

#### `user.logged_out`
User ended session.

```typescript
{
  eventType: 'user.logged_out',
  properties: {
    reason: 'manual' | 'timeout' | 'forced',
  }
}
```

---

### 2.2 OS Experience

#### `os.entered`
User entered the cyberpunk OS mode.

```typescript
{
  eventType: 'os.entered',
  properties: {
    entryPoint: 'landing' | 'direct' | 'deep_link',
    bootAnimationShown: boolean,
  }
}
```

#### `os.exited`
User left OS mode.

```typescript
{
  eventType: 'os.exited',
  properties: {
    destination: 'landing' | 'logout' | 'external',
    sessionDuration: number,  // seconds
  }
}
```

#### `os.app_opened`
User opened an app in OS.

```typescript
{
  eventType: 'os.app_opened',
  properties: {
    appId: string,
    appName: string,
    openMethod: 'dock' | 'desktop' | 'search' | 'shortcut',
  }
}
```

---

### 2.3 Missions

#### `mission.viewed`
User viewed a mission detail.

```typescript
{
  eventType: 'mission.viewed',
  properties: {
    missionId: string,
    missionTitle: string,
    trackId?: string,
    isAssigned: boolean,
  }
}
```

#### `mission.started`
User began working on a mission.

```typescript
{
  eventType: 'mission.started',
  properties: {
    missionId: string,
    missionTitle: string,
    dueDate?: string,
  }
}
```

#### `mission.completed`
Student submitted final artifact.

```typescript
{
  eventType: 'mission.completed',
  properties: {
    missionId: string,
    missionTitle: string,
    timeToComplete: number,  // seconds from start
  }
}
```

---

### 2.4 Submissions

#### `artifact.uploaded`
Student uploaded artifact file.

```typescript
{
  eventType: 'artifact.uploaded',
  properties: {
    missionId: string,
    artifactType: 'image' | 'video' | 'file' | 'link',
    fileSize?: number,
    mimeType?: string,
  }
}
```

#### `artifact.submitted`
Student submitted artifact for review.

```typescript
{
  eventType: 'artifact.submitted',
  properties: {
    submissionId: string,
    missionId: string,
    hasReflection: boolean,
    reflectionLength: number,
  }
}
```

#### `submission.reviewed`
Teacher scored a submission.

```typescript
{
  eventType: 'submission.reviewed',
  properties: {
    submissionId: string,
    missionId: string,
    studentId: string,
    reviewDuration: number,  // seconds
    rubricScores: Record<string, number>,
    overallScore: number,
  }
}
```

#### `submission.approved`
Teacher approved submission → triggers XP.

```typescript
{
  eventType: 'submission.approved',
  properties: {
    submissionId: string,
    missionId: string,
    studentId: string,
    xpAwarded: number,
    badgesAwarded: string[],
  }
}
```

#### `submission.revision_requested`
Teacher requested changes.

```typescript
{
  eventType: 'submission.revision_requested',
  properties: {
    submissionId: string,
    missionId: string,
    studentId: string,
    feedback: string,
  }
}
```

---

### 2.5 XP & Progression

#### `xp.awarded`
XP points granted to user.

```typescript
{
  eventType: 'xp.awarded',
  properties: {
    xpAmount: number,
    source: 'mission' | 'badge' | 'bonus' | 'streak',
    sourceId?: string,
    totalXp: number,
    levelBefore: number,
    levelAfter: number,
  }
}
```

#### `level.up`
User reached a new level.

```typescript
{
  eventType: 'level.up',
  properties: {
    newLevel: number,
    previousLevel: number,
    tierName: string,
    totalXp: number,
    celebrationShown: boolean,
  }
}
```

#### `badge.unlocked`
User earned a badge.

```typescript
{
  eventType: 'badge.unlocked',
  properties: {
    badgeId: string,
    badgeName: string,
    badgeRarity: 'common' | 'rare' | 'epic' | 'legendary',
    xpBonus: number,
  }
}
```

---

### 2.6 Phase System (Graduation Protocol)

#### `phase.progress.updated`
User's progress toward next phase changed.

```typescript
{
  eventType: 'phase.progress.updated',
  properties: {
    currentPhase: 'experience' | 'experiment' | 'excel' | 'expand',
    nextPhase: 'experiment' | 'excel' | 'expand' | null,
    progressPercentage: number,          // 0-100
    completedRequirements: string[],     // requirement IDs
    newlyCompleted?: string,             // Just completed requirement
    totalRequirements: number,
  }
}
```

#### `phase.unlocked.experiment`
User graduated from eXperience to eXperiment.

```typescript
{
  eventType: 'phase.unlocked.experiment',
  properties: {
    fromPhase: 'experience',
    toPhase: 'experiment',
    timeInPreviousPhase: number,         // days
    missionsCompleted: number,
    artifactsSubmitted: number,
    reflectionsWritten: number,
  }
}
```

#### `phase.unlocked.excel`
User graduated from eXperiment to eXcel.

```typescript
{
  eventType: 'phase.unlocked.excel',
  properties: {
    fromPhase: 'experiment',
    toPhase: 'excel',
    timeInPreviousPhase: number,         // days
    projectsCompleted: number,
    teamSimulations: number,
    assessmentsPassed: number,
    trustScore: number,
  }
}
```

#### `phase.unlocked.expand`
User graduated from eXcel to eXpand.

```typescript
{
  eventType: 'phase.unlocked.expand',
  properties: {
    fromPhase: 'excel',
    toPhase: 'expand',
    timeInPreviousPhase: number,         // days
    opportunitiesCompleted: number,
    menteesHelped: number,
    initiativesLaunched: number,
  }
}
```

#### `graduation.ceremony.viewed`
User saw the phase unlock ceremony.

```typescript
{
  eventType: 'graduation.ceremony.viewed',
  properties: {
    fromPhase: 'experience' | 'experiment' | 'excel',
    toPhase: 'experiment' | 'excel' | 'expand',
    ceremonyDuration: number,            // seconds watched
    skipped: boolean,
  }
}
```

#### `trust.score.updated`
User's trust score changed.

```typescript
{
  eventType: 'trust.score.updated',
  properties: {
    previousScore: number,
    newScore: number,
    reason: 'plagiarism_check' | 'authentic_work' | 'peer_report' | 'admin_adjustment',
    details?: string,
  }
}
```

#### `reflection.submitted`
User submitted a learning reflection (graduation requirement).

```typescript
{
  eventType: 'reflection.submitted',
  properties: {
    reflectionId: string,
    phase: 'experience' | 'experiment' | 'excel' | 'expand',
    wordCount: number,
    timeToComplete: number,              // seconds
  }
}
```

---

### 2.7 Parent Portal

#### `parent.linked_child`
Parent connected to child account.

```typescript
{
  eventType: 'parent.linked_child',
  properties: {
    childId: string,
    linkMethod: 'code' | 'invite',
  }
}
```

#### `parent.viewed_progress`
Parent viewed child's dashboard.

```typescript
{
  eventType: 'parent.viewed_progress',
  properties: {
    childId: string,
    sectionViewed: 'overview' | 'artifacts' | 'badges' | 'feedback',
  }
}
```

---

### 2.7 Admin Actions

#### `cohort.created`
Admin created a new cohort.

```typescript
{
  eventType: 'cohort.created',
  properties: {
    cohortId: string,
    cohortName: string,
    teacherIds: string[],
    gradeLevel?: string,
  }
}
```

#### `teacher.invited`
Admin invited a teacher.

```typescript
{
  eventType: 'teacher.invited',
  properties: {
    inviteEmail: string,
    cohortIds: string[],
  }
}
```

#### `report.exported`
Admin exported a report.

```typescript
{
  eventType: 'report.exported',
  properties: {
    reportType: 'progress' | 'adoption' | 'completion',
    format: 'pdf' | 'csv' | 'xlsx',
    dateRange: { start: string; end: string },
  }
}
```

---

### 2.8 Platform

#### `demo.requested`
Visitor requested a demo.

```typescript
{
  eventType: 'demo.requested',
  properties: {
    email: string,
    schoolName?: string,
    role?: string,
    source: string,
  }
}
```

#### `error.occurred`
An error happened.

```typescript
{
  eventType: 'error.occurred',
  properties: {
    errorCode: string,
    errorMessage: string,
    stack?: string,
    context: Record<string, any>,
  }
}
```

---

## 3. Implementation

### 3.1 Event Hook

```typescript
// src/hooks/useEvent.ts
import { useCallback } from 'react';
import { trackEvent } from '@/lib/analytics';

export function useEvent() {
  const track = useCallback((
    eventType: string,
    properties: Record<string, any> = {}
  ) => {
    trackEvent({
      eventType,
      properties,
      timestamp: new Date().toISOString(),
      source: 'web',
      version: '1.0.0',
    });
  }, []);

  return { track };
}
```

### 3.2 Analytics Service

```typescript
// src/lib/analytics/index.ts
const EVENT_STORAGE_KEY = 'projectx_events';

export function trackEvent(event: BaseEvent) {
  // Generate ID
  event.eventId = crypto.randomUUID();
  
  // Add user context
  const user = getCurrentUser();
  if (user) {
    event.userId = user.id;
    event.userRole = user.role;
    event.orgId = user.orgId;
  }
  
  // Add session
  event.sessionId = getSessionId();
  
  // Store locally (MVP)
  const events = JSON.parse(localStorage.getItem(EVENT_STORAGE_KEY) || '[]');
  events.push(event);
  localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(events));
  
  // Log in dev
  if (process.env.NODE_ENV === 'development') {
    console.log('[Event]', event.eventType, event.properties);
  }
  
  // TODO: Send to analytics backend
  // sendToBackend(event);
}
```

### 3.3 XP Engine Integration

```typescript
// src/lib/xp/engine.ts
export function processXpEvent(event: BaseEvent) {
  if (event.eventType === 'submission.approved') {
    const { studentId, xpAwarded } = event.properties;
    
    // Award XP
    const newTotal = awardXp(studentId, xpAwarded);
    
    // Check level up
    const { levelBefore, levelAfter } = calculateLevel(newTotal);
    
    if (levelAfter > levelBefore) {
      trackEvent({
        eventType: 'level.up',
        properties: {
          newLevel: levelAfter,
          previousLevel: levelBefore,
          totalXp: newTotal,
        }
      });
    }
  }
}
```

---

## 4. Event Retention

| Event Category | Retention | Purpose |
|----------------|-----------|---------|
| User lifecycle | 2 years | Compliance |
| XP/Badges | Forever | Portfolio |
| Submissions | 7 years | Education records |
| Analytics | 1 year | Insights |
| Errors | 90 days | Debugging |

---

## 5. Privacy Considerations

### 5.1 PII Handling
- Never log passwords
- Hash emails in analytics
- Anonymize for aggregates

### 5.2 Consent
- Track only after consent
- Provide opt-out
- Support data deletion

### 5.3 Student Data (COPPA/FERPA)
- Minimal collection
- Parent consent required
- No third-party sharing

---

## 6. Event Debugging

### 6.1 Dev Console
```javascript
// Enable event logging
localStorage.setItem('DEBUG_EVENTS', 'true');
```

### 6.2 View Stored Events
```javascript
// Get all stored events
JSON.parse(localStorage.getItem('projectx_events') || '[]');
```

### 6.3 Clear Events
```javascript
localStorage.removeItem('projectx_events');
```

---

*Events are the nervous system of ProjectX OS. Maintain schema consistency across all features.*
