/**
 * ProjectX OS — Go-Live Entity Types
 *
 * Core data model for the mission workflow spine:
 * QR Scan → Mission → Submission → Teacher Review → Feedback/Approval → Student Progress
 *
 * Reference: /docs/GO-LIVE-SPEC.md
 */

// ============================================
// ROLES & ACCESS CONTROL (RBAC)
// ============================================

/**
 * Core roles for Go-Live
 * Matches acceptance criteria in GO-LIVE-SPEC.md Section 1
 */
export type GoLiveRole =
  | 'student' // Missions, Submissions, Uploads, Feedback
  | 'teacher' // Review Queue, Feedback, Status Updates
  | 'school_admin' // User onboarding, teacher assignment, mission publishing
  | 'regional_admin' // Multi-school oversight
  | 'super_admin'; // Global control

/**
 * Permission definitions by role
 */
export const ROLE_PERMISSIONS: Record<GoLiveRole, string[]> = {
  student: [
    'mission:view',
    'mission:start',
    'submission:create',
    'submission:view:own',
    'submission:update:own',
    'upload:create',
    'feedback:view:own',
    'dashboard:student',
  ],
  teacher: [
    'mission:view',
    'submission:view:assigned',
    'submission:review',
    'submission:status:update',
    'feedback:create',
    'feedback:view:assigned',
    'dashboard:teacher',
    'student:view:assigned',
  ],
  school_admin: [
    'mission:view',
    'mission:create',
    'mission:update',
    'mission:publish',
    'user:create',
    'user:view:school',
    'user:update:school',
    'user:import',
    'teacher:assign',
    'cohort:manage',
    'dashboard:admin',
    'submission:view:school',
  ],
  regional_admin: [
    'mission:view',
    'mission:create',
    'mission:update',
    'mission:publish',
    'user:view:region',
    'user:create',
    'user:update:region',
    'school:manage',
    'dashboard:regional',
    'analytics:view:region',
    'submission:view:region',
  ],
  super_admin: [
    'mission:*',
    'user:*',
    'school:*',
    'region:*',
    'submission:*',
    'analytics:*',
    'system:*',
    'dashboard:*',
  ],
};

// ============================================
// MULTI-TENANT SCOPING
// ============================================

/**
 * Base interface for all tenant-scoped entities
 * Every core object MUST have these fields (GO-LIVE-SPEC Section 2)
 */
export interface TenantScoped {
  regionId: string;
  schoolId: string;
}

/**
 * Extended tenant scope for user-owned entities
 */
export interface UserScoped extends TenantScoped {
  userId: string;
}

// ============================================
// USER & AUTHENTICATION
// ============================================

/**
 * Go-Live User model
 * Extends base user with tenant scoping and teacher assignment
 */
export interface GoLiveUser extends TenantScoped {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: GoLiveRole;

  // Teacher assignment (for students)
  assignedTeacherId?: string;

  // Cohort membership
  cohortIds: string[];

  // XP & Progress
  xp: number;
  level: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;

  // Status
  status: 'active' | 'suspended' | 'pending_verification';
}

/**
 * Session data for authenticated users
 */
export interface AuthSession {
  userId: string;
  role: GoLiveRole;
  regionId: string;
  schoolId: string;
  permissions: string[];
  expiresAt: Date;
}

// ============================================
// TEACHER ASSIGNMENT
// ============================================

/**
 * Teacher-Student assignment record
 * Each student has ONE assigned teacher (GO-LIVE-SPEC Section 3)
 */
export interface TeacherAssignment extends TenantScoped {
  id: string;
  teacherId: string;
  studentId: string;
  cohortId?: string;
  assignedAt: Date;
  assignedBy: string; // Admin who made the assignment
  status: 'active' | 'inactive';
}

// ============================================
// MISSION SYSTEM
// ============================================

/**
 * Mission entity - the core learning unit
 */
export interface Mission extends TenantScoped {
  id: string;
  title: string;
  description: string;
  objective: string;

  // Content
  steps: MissionStep[];
  requirements: string[];
  tips?: string[];

  // Resources
  kitId?: string;
  labLocation?: string;
  resourceLinks: ResourceLink[];

  // Submission requirements
  artifactTypes: ArtifactType[];
  rubricId?: string;

  // Rewards
  xpReward: number;
  badgeId?: string;

  // QR Code
  qrCode?: string;
  qrCodeUrl?: string;

  // Status
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;

  // Metadata
  estimatedMinutes: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  trackId?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface MissionStep {
  order: number;
  type: 'read' | 'watch' | 'do' | 'submit' | 'reflect';
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  checkpoint?: boolean;
  estimatedMinutes?: number;
}

export interface ResourceLink {
  title: string;
  url: string;
  type: 'guide' | 'video' | 'document' | 'external';
}

export type ArtifactType = 'image' | 'video' | 'pdf' | 'document' | 'spreadsheet' | 'code' | 'link';

// ============================================
// SUBMISSION STATUS ENGINE
// ============================================

/**
 * Submission status - 7-state machine
 * GO-LIVE-SPEC Section 5
 */
export type SubmissionStatus =
  | 'DRAFT' // Started but not submitted
  | 'SUBMITTED' // Sent to teacher queue
  | 'UNDER_REVIEW' // Teacher opened review
  | 'FEEDBACK_REQUESTED' // Teacher wants changes
  | 'RESUBMITTED' // Student updated work
  | 'APPROVED' // Mission complete
  | 'REJECTED'; // Mission failed (requires reason)

/**
 * Valid status transitions
 */
export const VALID_STATUS_TRANSITIONS: Record<SubmissionStatus, SubmissionStatus[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['FEEDBACK_REQUESTED', 'APPROVED', 'REJECTED'],
  FEEDBACK_REQUESTED: ['RESUBMITTED'],
  RESUBMITTED: ['UNDER_REVIEW'],
  APPROVED: [], // Terminal state
  REJECTED: ['DRAFT'], // Can restart
};

/**
 * Submission entity - student work on a mission
 */
export interface Submission extends UserScoped {
  id: string;
  missionId: string;
  status: SubmissionStatus;

  // Teacher assignment (auto-routed)
  assignedTeacherId: string;

  // Artifacts (uploaded evidence)
  artifacts: SubmissionArtifact[];

  // Student reflection
  selfReflection?: string;

  // Teacher feedback
  feedback?: TeacherFeedback[];

  // Scores
  rubricScores?: RubricScore[];
  totalScore?: number;

  // XP awarded on approval
  xpEarned?: number;

  // Timestamps
  createdAt: Date; // When draft created
  submittedAt?: Date; // When first submitted
  reviewedAt?: Date; // When teacher first opened
  completedAt?: Date; // When approved/rejected

  // Resubmission tracking
  resubmissionCount: number;
  lastUpdatedAt: Date;
}

export interface SubmissionArtifact {
  id: string;
  type: ArtifactType;
  filename: string;
  url: string; // Signed URL for secure access
  thumbnailUrl?: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface TeacherFeedback {
  id: string;
  teacherId: string;
  content: string;
  type: 'general' | 'inline' | 'rubric';
  artifactId?: string; // For inline feedback on specific artifact
  createdAt: Date;
}

export interface RubricScore {
  criterionId: string;
  criterionName: string;
  points: number;
  maxPoints: number;
  feedback?: string;
}

// ============================================
// SUBMISSION EVENTS (AUDIT LOG)
// ============================================

/**
 * Submission event types for audit log
 * GO-LIVE-SPEC Section 10
 */
export type SubmissionEventType =
  | 'CREATED' // Draft created
  | 'ARTIFACT_UPLOADED' // Evidence uploaded
  | 'SUBMITTED' // Student submitted
  | 'OPENED' // Teacher opened for review
  | 'FEEDBACK_REQUESTED' // Teacher requested changes
  | 'FEEDBACK_ADDED' // Teacher added feedback
  | 'RESUBMITTED' // Student resubmitted
  | 'APPROVED' // Teacher approved
  | 'REJECTED' // Teacher rejected
  | 'XP_AWARDED'; // XP credited to student

/**
 * Audit log entry for submission actions
 */
export interface SubmissionEvent {
  id: string;
  submissionId: string;
  eventType: SubmissionEventType;
  actorId: string; // User who performed action
  actorRole: GoLiveRole;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  previousStatus?: SubmissionStatus;
  newStatus?: SubmissionStatus;
}

// ============================================
// SCHOOL & REGION
// ============================================

/**
 * School entity
 */
export interface School {
  id: string;
  name: string;
  regionId: string;
  code: string; // Short code for identification
  address?: Address;
  timezone: string;
  status: 'active' | 'inactive' | 'pending';
  settings: SchoolSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface SchoolSettings {
  maxStudents: number;
  maxTeachers: number;
  features: string[];
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
  };
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Region entity
 */
export interface GoLiveRegion {
  id: string;
  name: string;
  code: string;
  country: string;
  timezone: string;
  language: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

// ============================================
// COHORT
// ============================================

/**
 * Cohort - group of students with assigned teachers
 */
export interface GoLiveCohort extends TenantScoped {
  id: string;
  name: string;
  teacherIds: string[];
  studentIds: string[];
  missionIds: string[]; // Assigned missions
  startDate: Date;
  endDate?: Date;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// UPLOAD SYSTEM
// ============================================

/**
 * Upload configuration
 */
export const UPLOAD_CONFIG = {
  maxFileSizeMB: 100,
  allowedMimeTypes: [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Videos
    'video/mp4',
    'video/quicktime',
    'video/webm',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  signedUrlExpiryMinutes: 60,
} as const;

/**
 * Upload request
 */
export interface UploadRequest {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  submissionId: string;
}

/**
 * Upload response with signed URL
 */
export interface UploadResponse {
  uploadUrl: string;
  artifactId: string;
  expiresAt: Date;
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * API error response
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * API success response
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// ============================================
// DASHBOARD TYPES
// ============================================

/**
 * Student dashboard data
 */
export interface StudentDashboard {
  user: GoLiveUser;
  assignedTeacher?: Pick<GoLiveUser, 'id' | 'displayName' | 'avatarUrl'>;
  activeMissions: MissionWithProgress[];
  recentSubmissions: SubmissionSummary[];
  pendingFeedback: FeedbackNotification[];
  stats: StudentStats;
}

export interface MissionWithProgress {
  mission: Mission;
  submission?: Submission;
  progress: number; // 0-100
}

export interface SubmissionSummary {
  id: string;
  missionTitle: string;
  status: SubmissionStatus;
  submittedAt?: Date;
  lastUpdatedAt: Date;
}

export interface FeedbackNotification {
  submissionId: string;
  missionTitle: string;
  feedbackPreview: string;
  createdAt: Date;
}

export interface StudentStats {
  totalMissions: number;
  completedMissions: number;
  pendingSubmissions: number;
  totalXP: number;
  currentLevel: number;
}

/**
 * Teacher dashboard data
 */
export interface TeacherDashboard {
  user: GoLiveUser;
  assignedStudents: Pick<GoLiveUser, 'id' | 'displayName' | 'avatarUrl'>[];
  submissionQueue: SubmissionQueueItem[];
  stats: TeacherStats;
}

export interface SubmissionQueueItem {
  submission: Submission;
  student: Pick<GoLiveUser, 'id' | 'displayName' | 'avatarUrl'>;
  missionTitle: string;
}

export interface TeacherStats {
  totalStudents: number;
  pendingReviews: number;
  reviewedToday: number;
  averageReviewTime: number; // minutes
}

/**
 * Admin dashboard data
 */
export interface AdminDashboard {
  school: School;
  stats: AdminStats;
  recentActivity: SubmissionEvent[];
  unassignedStudents: Pick<GoLiveUser, 'id' | 'displayName' | 'email'>[];
}

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalMissions: number;
  activeSubmissions: number;
  completionRate: number;
}
