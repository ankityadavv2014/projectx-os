// ProjectX OS - Domain Types
// Complete type definitions for the school platform

// =============================================================================
// PHASE SYSTEM (Forward Declaration)
// =============================================================================

/**
 * The Four Phases of ProjectX Evolution
 * Learn → Work → Earn → Invent
 */
export type Phase = 'experience' | 'experiment' | 'excel' | 'expand';

/**
 * User's progress through the phase system (forward declaration)
 * Full definition in PHASE SYSTEM section below
 */
export interface PhaseProgress {
  currentPhase: Phase;
  phaseUnlockedAt: Record<Phase, string | null>;
  requirements: PhaseRequirement[];
  completedRequirements: string[];
  trustScore: number;
  sessionCount: number;
  lastSessionAt: string;
  reflectionCount: number;
  teamParticipationCount: number;
  mentorshipCount: number;
  opportunitiesCompleted: number;
  initiativesLaunched: number;
}

export interface PhaseRequirement {
  id: string;
  label: string;
  description: string;
  type: 'missions' | 'artifacts' | 'badge' | 'reflection' | 'sessions' | 
        'projects' | 'team' | 'assessment' | 'trust' | 
        'opportunity' | 'mentorship' | 'initiative' | 'partner_review';
  target: number;
  current?: number;
  completed?: boolean;
}

// =============================================================================
// CORE IDENTITY
// =============================================================================

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'facilitator';

export interface User {
  id: string;
  email?: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  
  // Associations
  orgId: string;
  cohortIds: string[];
  linkedChildIds?: string[]; // For parents
  
  // XP (students only)
  xp: number;
  level: number;
  tier: string;
  
  // Phase System (Graduation Protocol)
  currentPhase: Phase;
  phaseProgress?: PhaseProgress;
  
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

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  timezone: string;
  
  settings: {
    allowParentAccess: boolean;
    requireParentConsent: boolean;
    academicYear: string;
    gradeLevels: string[];
  };
  
  status: 'trial' | 'active' | 'suspended';
  plan: 'starter' | 'pro' | 'enterprise';
  
  createdAt: string;
  updatedAt: string;
}

export interface Cohort {
  id: string;
  name: string;
  code: string;
  qrCode?: string;
  
  orgId: string;
  teacherIds: string[];
  facilitatorIds?: string[];
  
  gradeLevel?: string;
  academicYear: string;
  trackIds: string[];
  
  settings: {
    allowSelfEnroll: boolean;
    maxStudents?: number;
    startDate?: string;
    endDate?: string;
  };
  
  studentCount?: number;
  
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// LEARNING CONTENT
// =============================================================================

export interface Track {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage?: string;
  
  ageRange: { min: number; max: number };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  
  missionIds: string[];
  
  visibility: 'public' | 'org' | 'private';
  orgId?: string;
  
  status: 'draft' | 'published' | 'archived';
  
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface MissionStep {
  order: number;
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'embed';
}

export interface Mission {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  
  objective: string;
  materials: string[];
  steps: MissionStep[];
  
  trackId?: string;
  rubricId: string;
  kitId?: string;
  
  xpReward: number;
  badgeId?: string;
  
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  
  prerequisiteMissionIds?: string[];
  requiredLevel?: number;
  
  status: 'draft' | 'published' | 'archived';
  
  createdAt: string;
  updatedAt: string;
}

export interface RubricLevel {
  score: number;
  description: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  levels: RubricLevel[];
}

export interface Rubric {
  id: string;
  name: string;
  description?: string;
  
  criteria: RubricCriterion[];
  
  maxScore: number;
  passingScore: number;
  
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// SUBMISSIONS
// =============================================================================

export interface Assignment {
  id: string;
  missionId: string;
  
  cohortId?: string;
  studentIds?: string[];
  
  assignedBy: string;
  
  assignedAt: string;
  dueDate?: string;
  
  instructions?: string;
  
  status: 'active' | 'closed';
}

export type SubmissionStatus = 
  | 'draft' 
  | 'submitted' 
  | 'in_review' 
  | 'approved' 
  | 'revision_requested';

export interface Submission {
  id: string;
  
  studentId: string;
  missionId: string;
  assignmentId?: string;
  cohortId: string;
  
  artifactIds: string[];
  reflection: string;
  
  status: SubmissionStatus;
  
  reviewId?: string;
  
  xpAwarded?: number;
  badgesAwarded?: string[];
  
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
}

export type ArtifactType = 'image' | 'video' | 'file' | 'link';

export interface Artifact {
  id: string;
  submissionId: string;
  
  type: ArtifactType;
  url: string;
  thumbnailUrl?: string;
  
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  
  linkTitle?: string;
  linkDescription?: string;
  
  createdAt: string;
}

export interface ReviewScore {
  criterionId: string;
  score: number;
  comment?: string;
}

export interface Review {
  id: string;
  submissionId: string;
  
  reviewerId: string;
  reviewerRole: 'teacher' | 'admin' | 'facilitator';
  
  rubricId: string;
  scores: ReviewScore[];
  totalScore: number;
  
  feedback?: string;
  
  decision: 'approved' | 'revision_requested';
  
  createdAt: string;
}

// =============================================================================
// PROGRESSION
// =============================================================================

export type XPSource = 'mission' | 'badge' | 'bonus' | 'streak' | 'level_up';

export interface XPEvent {
  id: string;
  userId: string;
  
  amount: number;
  
  source: XPSource;
  sourceId?: string;
  sourceDescription: string;
  
  totalBefore: number;
  totalAfter: number;
  
  createdAt: string;
}

// =============================================================================
// PHASE SYSTEM (GRADUATION PROTOCOL)
// =============================================================================

export const PHASE_DISPLAY: Record<Phase, { 
  name: string; 
  verb: string; 
  tagline: string; 
  color: string;
  icon: string;
}> = {
  experience: { 
    name: 'Project eXperience', 
    verb: 'LEARN', 
    tagline: 'Give humans a chance to experience the future today.',
    color: 'var(--molten-orange)',
    icon: '🟠'
  },
  experiment: { 
    name: 'Project eXperiment', 
    verb: 'WORK', 
    tagline: 'Let humans experiment, collaborate, and simulate real work.',
    color: 'var(--neon-blue)',
    icon: '🔵'
  },
  excel: { 
    name: 'Project eXcel', 
    verb: 'EARN', 
    tagline: 'Turn capability into value.',
    color: 'var(--sacred-gold)',
    icon: '🟣'
  },
  expand: { 
    name: 'Project eXpand', 
    verb: 'INVENT', 
    tagline: 'Multiply impact across regions, cultures, and systems.',
    color: '#ff4444',
    icon: '🔴'
  },
};

/**
 * Graduation requirements for each phase transition
 */
export const GRADUATION_REQUIREMENTS: Record<Phase, PhaseRequirement[]> = {
  experience: [], // Entry phase - no requirements to enter
  
  experiment: [
    { id: 'missions_5', label: 'Complete 5 Missions', description: 'Prove you can build', type: 'missions', target: 5 },
    { id: 'artifacts_3', label: 'Submit 3 Portfolio Artifacts', description: 'Show proof of work', type: 'artifacts', target: 3 },
    { id: 'badge_explorer', label: 'Earn Explorer Badge', description: 'Demonstrate exploration', type: 'badge', target: 1 },
    { id: 'reflection_1', label: 'Complete 1 Learning Reflection', description: 'What did you build? Learn? What\'s next?', type: 'reflection', target: 1 },
    { id: 'sessions_3', label: 'Active for 3+ Sessions', description: 'Show consistency', type: 'sessions', target: 3 },
  ],
  
  excel: [
    { id: 'projects_3', label: 'Complete 3 Work-Grade Projects', description: 'Not just missions—real projects', type: 'projects', target: 3 },
    { id: 'team_1', label: 'Participate in 1 Team Simulation', description: 'Prove collaboration', type: 'team', target: 1 },
    { id: 'assessment_1', label: 'Pass 1 Assessment/Rubric Check', description: 'Teacher/Coach approval', type: 'assessment', target: 1 },
    { id: 'trust_baseline', label: 'Maintain Trust Score Baseline', description: 'No plagiarism, authentic work', type: 'trust', target: 70 },
  ],
  
  expand: [
    { id: 'opportunity_1', label: 'Complete 1 Real Opportunity', description: 'Internship/gig/community deployment', type: 'opportunity', target: 1 },
    { id: 'mentor_1', label: 'Help 1 Junior Learner', description: 'Give feedback, coach others', type: 'mentorship', target: 1 },
    { id: 'initiative_1', label: 'Launch 1 Micro-Initiative', description: 'Club, cohort, or local pilot', type: 'initiative', target: 1 },
    { id: 'partner_review', label: 'Pass Partner Mode Review', description: 'Admin/ProjectX approval', type: 'partner_review', target: 1 },
  ],
};

/**
 * Phase unlock event - when user graduates to next phase
 */
export interface PhaseUnlockEvent {
  id: string;
  userId: string;
  
  fromPhase: Phase;
  toPhase: Phase;
  
  unlockedAt: string;
  
  // Ceremony viewed?
  ceremonyViewedAt?: string;
}

/**
 * Learning reflection for graduation
 */
export interface LearningReflection {
  id: string;
  userId: string;
  
  phase: Phase;
  
  whatBuilt: string;
  whatLearned: string;
  whatsNext: string;
  
  submittedAt: string;
}

/**
 * Get next phase in the progression
 */
export function getNextPhase(current: Phase): Phase | null {
  const order: Phase[] = ['experience', 'experiment', 'excel', 'expand'];
  const idx = order.indexOf(current);
  return idx < order.length - 1 ? order[idx + 1] : null;
}

/**
 * Check if user can graduate to next phase
 */
export function canGraduate(progress: PhaseProgress): boolean {
  const nextPhase = getNextPhase(progress.currentPhase);
  if (!nextPhase) return false;
  
  const requirements = GRADUATION_REQUIREMENTS[nextPhase];
  return requirements.every(req => progress.completedRequirements.includes(req.id));
}

/**
 * Calculate graduation progress percentage
 */
export function getGraduationProgress(progress: PhaseProgress): number {
  const nextPhase = getNextPhase(progress.currentPhase);
  if (!nextPhase) return 100;
  
  const requirements = GRADUATION_REQUIREMENTS[nextPhase];
  if (requirements.length === 0) return 100;
  
  const completed = requirements.filter(req => 
    progress.completedRequirements.includes(req.id)
  ).length;
  
  return Math.round((completed / requirements.length) * 100);
}

/**
 * Default phase progress for new users
 */
export function createDefaultPhaseProgress(): PhaseProgress {
  return {
    currentPhase: 'experience',
    phaseUnlockedAt: {
      experience: new Date().toISOString(),
      experiment: null,
      excel: null,
      expand: null,
    },
    requirements: [...GRADUATION_REQUIREMENTS.experiment],
    completedRequirements: [],
    trustScore: 100,
    sessionCount: 1,
    lastSessionAt: new Date().toISOString(),
    reflectionCount: 0,
    teamParticipationCount: 0,
    mentorshipCount: 0,
    opportunitiesCompleted: 0,
    initiativesLaunched: 0,
  };
}

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BadgeCriteria {
  type: 'mission' | 'count' | 'streak' | 'level' | 'custom';
  missionId?: string;
  count?: number;
  level?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  
  iconUrl: string;
  color: string;
  
  rarity: BadgeRarity;
  
  xpBonus: number;
  
  criteria: BadgeCriteria;
  
  createdAt: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  
  earnedVia: string;
  
  earnedAt: string;
}

export interface Level {
  level: number;
  name: string;
  tier: string;
  
  xpRequired: number;
  xpTotal: number;
  
  rewards?: {
    type: 'badge' | 'unlock' | 'perk';
    id: string;
  }[];
}

// =============================================================================
// INVENTORY
// =============================================================================

export interface KitComponent {
  name: string;
  quantity: number;
  sku?: string;
}

export interface Kit {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  
  components: KitComponent[];
  
  cost: number;
  currency: string;
  
  trackId?: string;
  missionIds?: string[];
  
  status: 'active' | 'discontinued';
  
  createdAt: string;
}

export interface Inventory {
  id: string;
  orgId: string;
  kitId: string;
  
  quantity: number;
  allocated: number;
  available: number;
  
  updatedAt: string;
}

export type KitAssignmentStatus = 'assigned' | 'returned' | 'lost' | 'damaged';

export interface KitAssignment {
  id: string;
  kitId: string;
  studentId: string;
  cohortId: string;
  
  status: KitAssignmentStatus;
  
  assignedAt: string;
  returnedAt?: string;
}

// =============================================================================
// ANALYTICS / EVENTS
// =============================================================================

export type EventSource = 'web' | 'mobile' | 'api' | 'system';

export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  
  userId?: string;
  userRole?: UserRole;
  sessionId?: string;
  
  orgId?: string;
  cohortId?: string;
  
  source: EventSource;
  version: string;
  
  properties: Record<string, unknown>;
}

// =============================================================================
// PERMISSIONS
// =============================================================================

export type Permission = 
  // Missions
  | 'missions:view_assigned'
  | 'missions:view_all'
  | 'missions:create'
  | 'missions:edit'
  | 'missions:delete'
  | 'missions:assign'
  // Submissions
  | 'submissions:submit'
  | 'submissions:view_own'
  | 'submissions:view_cohort'
  | 'submissions:review'
  | 'submissions:approve'
  // XP
  | 'xp:view_own'
  | 'xp:view_cohort'
  | 'xp:award'
  // Users
  | 'users:view_profile'
  | 'users:edit_profile'
  | 'users:view_cohort'
  | 'users:create_cohort'
  | 'users:invite_teachers'
  | 'users:link_parent'
  // Org
  | 'org:view_settings'
  | 'org:edit_settings'
  | 'org:view_billing'
  | 'org:export_reports'
  | 'org:view_audit';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    'missions:view_assigned',
    'submissions:submit',
    'submissions:view_own',
    'xp:view_own',
    'users:view_profile',
    'users:edit_profile',
  ],
  teacher: [
    'missions:view_assigned',
    'missions:view_all',
    'missions:create',
    'missions:edit',
    'missions:assign',
    'submissions:view_cohort',
    'submissions:review',
    'submissions:approve',
    'xp:view_own',
    'xp:view_cohort',
    'xp:award',
    'users:view_profile',
    'users:edit_profile',
    'users:view_cohort',
    'org:export_reports',
  ],
  parent: [
    'submissions:view_own', // Linked child only
    'xp:view_own', // Linked child only
    'users:view_profile',
    'users:edit_profile',
    'users:link_parent',
  ],
  admin: [
    'missions:view_assigned',
    'missions:view_all',
    'missions:create',
    'missions:edit',
    'missions:delete',
    'missions:assign',
    'submissions:view_cohort',
    'submissions:review',
    'submissions:approve',
    'xp:view_own',
    'xp:view_cohort',
    'xp:award',
    'users:view_profile',
    'users:edit_profile',
    'users:view_cohort',
    'users:create_cohort',
    'users:invite_teachers',
    'users:link_parent',
    'org:view_settings',
    'org:edit_settings',
    'org:view_billing',
    'org:export_reports',
    'org:view_audit',
  ],
  facilitator: [
    'missions:view_assigned',
    'missions:view_all',
    'submissions:view_cohort',
    'submissions:review',
    'xp:view_cohort',
    'users:view_profile',
    'users:edit_profile',
    'users:view_cohort',
  ],
};

// =============================================================================
// LEVEL DEFINITIONS
// =============================================================================

export const LEVELS: Level[] = [
  { level: 1, name: 'Initiate', tier: 'Bronze', xpRequired: 0, xpTotal: 0 },
  { level: 2, name: 'Novice', tier: 'Bronze', xpRequired: 100, xpTotal: 100 },
  { level: 3, name: 'Apprentice', tier: 'Bronze', xpRequired: 150, xpTotal: 250 },
  { level: 4, name: 'Explorer', tier: 'Silver', xpRequired: 200, xpTotal: 450 },
  { level: 5, name: 'Adventurer', tier: 'Silver', xpRequired: 300, xpTotal: 750 },
  { level: 6, name: 'Specialist', tier: 'Silver', xpRequired: 400, xpTotal: 1150 },
  { level: 7, name: 'Expert', tier: 'Gold', xpRequired: 500, xpTotal: 1650 },
  { level: 8, name: 'Master', tier: 'Gold', xpRequired: 750, xpTotal: 2400 },
  { level: 9, name: 'Champion', tier: 'Gold', xpRequired: 1000, xpTotal: 3400 },
  { level: 10, name: 'Legend', tier: 'Platinum', xpRequired: 1500, xpTotal: 4900 },
];

export function getLevelForXP(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpTotal) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getXPProgress(xp: number): { current: number; required: number; percentage: number } {
  const level = getLevelForXP(xp);
  const currentLevelXP = xp - level.xpTotal;
  const nextLevel = LEVELS[level.level] || LEVELS[LEVELS.length - 1];
  const required = nextLevel.xpRequired;
  
  return {
    current: currentLevelXP,
    required,
    percentage: Math.min((currentLevelXP / required) * 100, 100),
  };
}
