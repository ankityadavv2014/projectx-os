# ProjectX OS — Data Model

> **Version**: 1.0.0  
> **Last Updated**: January 30, 2026

## Overview

This document defines the complete data model for ProjectX OS, covering all domain entities and their relationships.

---

## 1. Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ Organization │◄──────│    User      │───────►│   Cohort     │
└──────────────┘       └──────────────┘       └──────────────┘
       │                      │                      │
       │                      │                      │
       ▼                      ▼                      ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    Track     │◄──────│   Mission    │───────►│ Assignment   │
└──────────────┘       └──────────────┘       └──────────────┘
                              │                      │
                              │                      │
                              ▼                      ▼
                       ┌──────────────┐       ┌──────────────┐
                       │   Rubric     │       │ Submission   │
                       └──────────────┘       └──────────────┘
                                                     │
                              ┌───────────────┬──────┴───────┐
                              ▼               ▼              ▼
                       ┌──────────────┐┌──────────────┐┌──────────────┐
                       │   Artifact   ││   Review     ││  XPEvent     │
                       └──────────────┘└──────────────┘└──────────────┘
                                                              │
                                                              ▼
                                                       ┌──────────────┐
                                                       │    Badge     │
                                                       └──────────────┘
```

---

## 2. Core Entities

### 2.1 Organization

```typescript
interface Organization {
  id: string;
  name: string;
  slug: string;              // URL-safe identifier
  logo?: string;
  timezone: string;
  
  // Settings
  settings: {
    allowParentAccess: boolean;
    requireParentConsent: boolean;
    academicYear: string;
    gradeLevels: string[];
  };
  
  // Status
  status: 'trial' | 'active' | 'suspended';
  plan: 'starter' | 'pro' | 'enterprise';
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

### 2.2 User

```typescript
interface User {
  id: string;
  email?: string;            // Optional for students
  displayName: string;
  avatarUrl?: string;
  
  // Role
  role: 'student' | 'teacher' | 'parent' | 'admin' | 'facilitator';
  
  // Associations
  orgId: string;
  cohortIds: string[];       // Student/Teacher cohorts
  linkedChildIds?: string[]; // For parents
  
  // XP (for students)
  xp?: number;
  level?: number;
  tier?: string;
  
  // Profile
  profile?: {
    bio?: string;
    gradeLevel?: string;
    interests?: string[];
  };
  
  // Status
  status: 'pending' | 'active' | 'suspended';
  onboardedAt?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
}
```

### 2.3 Cohort

```typescript
interface Cohort {
  id: string;
  name: string;
  code: string;              // Join code
  qrCode?: string;           // QR code image URL
  
  // Associations
  orgId: string;
  teacherIds: string[];
  facilitatorIds?: string[];
  
  // Metadata
  gradeLevel?: string;
  academicYear: string;
  trackIds: string[];        // Assigned tracks
  
  // Settings
  settings: {
    allowSelfEnroll: boolean;
    maxStudents?: number;
    startDate?: string;
    endDate?: string;
  };
  
  // Stats (computed)
  studentCount?: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

---

## 3. Learning Entities

### 3.1 Track

```typescript
interface Track {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage?: string;
  
  // Metadata
  ageRange: { min: number; max: number };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  
  // Content
  missionIds: string[];
  
  // Visibility
  visibility: 'public' | 'org' | 'private';
  orgId?: string;            // For org-specific tracks
  
  // Status
  status: 'draft' | 'published' | 'archived';
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
```

### 3.2 Mission

```typescript
interface Mission {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  
  // Content
  objective: string;         // What student will do
  materials: string[];       // Required materials
  steps: MissionStep[];      // Instructions
  
  // Associations
  trackId?: string;
  rubricId: string;
  kitId?: string;            // Physical kit if needed
  
  // XP & Badges
  xpReward: number;
  badgeId?: string;          // Badge earned on completion
  
  // Metadata
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  
  // Prerequisites
  prerequisiteMissionIds?: string[];
  requiredLevel?: number;
  
  // Status
  status: 'draft' | 'published' | 'archived';
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

interface MissionStep {
  order: number;
  title: string;
  content: string;           // Markdown
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'embed';
}
```

### 3.3 Rubric

```typescript
interface Rubric {
  id: string;
  name: string;
  description?: string;
  
  // Criteria
  criteria: RubricCriterion[];
  
  // Scoring
  maxScore: number;          // Computed from criteria
  passingScore: number;      // Minimum to pass
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;            // 1-5
  levels: {
    score: number;           // 1-5
    description: string;
  }[];
}
```

---

## 4. Submission Entities

### 4.1 Assignment

```typescript
interface Assignment {
  id: string;
  
  // What
  missionId: string;
  
  // To whom
  cohortId?: string;
  studentIds?: string[];     // For individual assignments
  
  // By whom
  assignedBy: string;        // Teacher/Admin ID
  
  // When
  assignedAt: string;
  dueDate?: string;
  
  // Notes
  instructions?: string;     // Custom instructions
  
  // Status
  status: 'active' | 'closed';
}
```

### 4.2 Submission

```typescript
interface Submission {
  id: string;
  
  // Associations
  studentId: string;
  missionId: string;
  assignmentId?: string;
  cohortId: string;
  
  // Content
  artifactIds: string[];
  reflection: string;
  
  // Status
  status: 'draft' | 'submitted' | 'in_review' | 'approved' | 'revision_requested';
  
  // Review (populated after review)
  reviewId?: string;
  
  // XP (populated after approval)
  xpAwarded?: number;
  badgesAwarded?: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
}
```

### 4.3 Artifact

```typescript
interface Artifact {
  id: string;
  submissionId: string;
  
  // Content
  type: 'image' | 'video' | 'file' | 'link';
  url: string;
  thumbnailUrl?: string;
  
  // Metadata
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  
  // For links
  linkTitle?: string;
  linkDescription?: string;
  
  // Timestamps
  createdAt: string;
}
```

### 4.4 Review

```typescript
interface Review {
  id: string;
  submissionId: string;
  
  // Reviewer
  reviewerId: string;
  reviewerRole: 'teacher' | 'admin' | 'facilitator';
  
  // Scoring
  rubricId: string;
  scores: {
    criterionId: string;
    score: number;
    comment?: string;
  }[];
  totalScore: number;
  
  // Feedback
  feedback?: string;
  
  // Decision
  decision: 'approved' | 'revision_requested';
  
  // Timestamps
  createdAt: string;
}
```

---

## 5. Progression Entities

### 5.1 XPEvent

```typescript
interface XPEvent {
  id: string;
  userId: string;
  
  // Amount
  amount: number;
  
  // Source
  source: 'mission' | 'badge' | 'bonus' | 'streak' | 'level_up';
  sourceId?: string;
  sourceDescription: string;
  
  // State
  totalBefore: number;
  totalAfter: number;
  
  // Timestamp
  createdAt: string;
}
```

### 5.2 Badge

```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  
  // Visuals
  iconUrl: string;
  color: string;
  
  // Rarity
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  
  // Rewards
  xpBonus: number;
  
  // Criteria (how to earn)
  criteria: {
    type: 'mission' | 'count' | 'streak' | 'level' | 'custom';
    missionId?: string;
    count?: number;
    level?: number;
  };
  
  // Timestamps
  createdAt: string;
}

interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  
  // How earned
  earnedVia: string;         // Mission ID, etc.
  
  // Timestamp
  earnedAt: string;
}
```

### 5.3 Level

```typescript
interface Level {
  level: number;
  name: string;              // "Novice", "Explorer", etc.
  tier: string;              // "Bronze", "Silver", etc.
  
  // Thresholds
  xpRequired: number;
  xpTotal: number;           // Cumulative XP to reach
  
  // Rewards
  rewards?: {
    type: 'badge' | 'unlock' | 'perk';
    id: string;
  }[];
}
```

---

## 6. Inventory Entities

### 6.1 Kit

```typescript
interface Kit {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  
  // Contents
  components: {
    name: string;
    quantity: number;
    sku?: string;
  }[];
  
  // Pricing
  cost: number;
  currency: string;
  
  // Associations
  trackId?: string;
  missionIds?: string[];
  
  // Status
  status: 'active' | 'discontinued';
  
  // Timestamps
  createdAt: string;
}
```

### 6.2 Inventory

```typescript
interface Inventory {
  id: string;
  orgId: string;
  
  // Kit
  kitId: string;
  
  // Stock
  quantity: number;
  allocated: number;         // Assigned to students
  available: number;         // Computed
  
  // Timestamps
  updatedAt: string;
}
```

### 6.3 KitAssignment

```typescript
interface KitAssignment {
  id: string;
  
  // What
  kitId: string;
  
  // To whom
  studentId: string;
  cohortId: string;
  
  // Status
  status: 'assigned' | 'returned' | 'lost' | 'damaged';
  
  // Timestamps
  assignedAt: string;
  returnedAt?: string;
}
```

---

## 7. Relationships Summary

| Entity | Has Many | Belongs To |
|--------|----------|------------|
| Organization | Users, Cohorts, Tracks | - |
| User | Submissions, XPEvents, Badges | Organization |
| Cohort | Students, Assignments | Organization |
| Track | Missions | Organization |
| Mission | Submissions, Artifacts | Track |
| Submission | Artifacts, Review | User, Mission |
| Review | - | Submission, Reviewer |

---

## 8. Indexes (for Database)

```sql
-- Users
CREATE INDEX idx_users_org ON users(org_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Submissions
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_mission ON submissions(mission_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_cohort ON submissions(cohort_id);

-- XP Events
CREATE INDEX idx_xp_events_user ON xp_events(user_id);
CREATE INDEX idx_xp_events_created ON xp_events(created_at);

-- Assignments
CREATE INDEX idx_assignments_cohort ON assignments(cohort_id);
CREATE INDEX idx_assignments_mission ON assignments(mission_id);
```

---

## 9. Mock Data Strategy

For MVP development, use localStorage with this structure:

```typescript
// src/lib/data/mock-store.ts
const STORE_KEYS = {
  users: 'projectx_users',
  organizations: 'projectx_orgs',
  cohorts: 'projectx_cohorts',
  missions: 'projectx_missions',
  submissions: 'projectx_submissions',
  reviews: 'projectx_reviews',
  xpEvents: 'projectx_xp_events',
  badges: 'projectx_badges',
  userBadges: 'projectx_user_badges',
};

// Initialize with seed data on first load
function initializeMockData() {
  if (!localStorage.getItem(STORE_KEYS.users)) {
    localStorage.setItem(STORE_KEYS.users, JSON.stringify(SEED_USERS));
    // ... more seed data
  }
}
```

---

## 10. Migration Path

When moving to production database:

1. **Phase 1**: Export localStorage → Supabase/PostgreSQL
2. **Phase 2**: Add real-time subscriptions
3. **Phase 3**: Implement Row Level Security
4. **Phase 4**: Add full-text search

---

*This data model is the foundation of ProjectX OS. Maintain consistency across all features.*
