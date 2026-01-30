/**
 * ProjectX OS — Canonical Entity Types
 * 
 * These types define the platform's core data model.
 * Reference: /docs/NORTH-STAR.md Section 2
 */

// ============================================
// IDENTITY & ACCESS
// ============================================

export type UserRole = 
  | 'learner'
  | 'parent'
  | 'educator'
  | 'facilitator'
  | 'school_admin'
  | 'partner'
  | 'vendor'
  | 'employer'
  | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  organizationId?: string;
  cohortIds: string[];
  xp: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  profile: UserProfile;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
  timezone: string;
}

export interface UserProfile {
  bio?: string;
  location?: string;
  birthYear?: number;
  interests: string[];
  skills: string[];
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'website' | 'other';
  url: string;
}

export type OrganizationType = 
  | 'school'
  | 'lab'
  | 'ngo'
  | 'company'
  | 'community_hub'
  | 'university';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  logo?: string;
  regionId: string;
  adminUserIds: string[];
  settings: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSettings {
  allowedDomains: string[];
  maxUsers: number;
  features: string[];
  branding?: {
    primaryColor?: string;
    logoUrl?: string;
  };
}

export interface Cohort {
  id: string;
  name: string;
  organizationId: string;
  facilitatorIds: string[];
  learnerIds: string[];
  trackId: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Region {
  id: string;
  name: string;
  country: string;
  state?: string;
  city?: string;
  timezone: string;
  language: string;
  currency: string;
}

// ============================================
// LEARNING & EXPERIENCE
// ============================================

export type TrackDomain = 
  | 'science'
  | 'technology'
  | 'robotics'
  | 'engineering'
  | 'arts'
  | 'mathematics'
  | 'sustainability'
  | 'entrepreneurship'
  | 'life_skills';

export interface Track {
  id: string;
  name: string;
  description: string;
  domain: TrackDomain;
  icon: string;
  color: string;
  kitIds: string[];
  challengeIds: string[];
  prerequisites: string[];
  order: number;
}

export type KitTier = 
  | 'starter'      // 5-7 age
  | 'discovery'    // 8-10 age
  | 'explorer'     // 10-14 age
  | 'advanced'     // 14-18 age
  | 'mastery'      // 18+ age
  | 'premium';     // 25+ corporate

export interface Kit {
  id: string;
  name: string;
  description: string;
  tier: KitTier;
  trackId: string;
  components: Component[];
  learningObjectives: string[];
  challengeIds: string[];
  expectedOutcomes: string[];
  rubricId: string;
  earnMapping?: EarnMapping;
  price?: number;
  qrGuideUrl?: string;
  imageUrl?: string;
  estimatedHours: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface Component {
  id: string;
  name: string;
  type: 'physical' | 'digital';
  description: string;
  quantity: number;
  imageUrl?: string;
  downloadUrl?: string;
}

export interface EarnMapping {
  skills: string[];
  opportunities: string[];
  potentialEarning: string;
}

export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  kitId?: string;
  trackId: string;
  difficulty: ChallengeDifficulty;
  estimatedMinutes: number;
  prerequisites: string[];
  rubricId: string;
  xpReward: number;
  badgeId?: string;
  instructions: ChallengeStep[];
  expectedOutcome: string;
  artifactTypes: ArtifactType[];
  tips?: string[];
  antiCheatGuidelines?: string[];
}

export interface ChallengeStep {
  order: number;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
}

export type ArtifactType = 'image' | 'video' | 'code' | 'document' | 'link' | 'audio';

export interface ActivitySession {
  id: string;
  userId: string;
  challengeId: string;
  cohortId?: string;
  status: 'started' | 'in_progress' | 'submitted' | 'reviewed' | 'completed';
  startedAt: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
  completedAt?: Date;
  artifacts: Artifact[];
  selfReflection?: string;
  rubricScores?: RubricScore[];
  facilitatorFeedback?: string;
  xpEarned?: number;
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  createdAt: Date;
}

export interface Outcome {
  id: string;
  activitySessionId: string;
  userId: string;
  challengeId: string;
  artifacts: Artifact[];
  rubricScores: RubricScore[];
  totalScore: number;
  maxScore: number;
  feedback?: string;
  createdAt: Date;
}

export interface Rubric {
  id: string;
  name: string;
  description: string;
  criteria: RubricCriterion[];
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  points: number;
  label: string;
  description: string;
}

export interface RubricScore {
  criterionId: string;
  points: number;
  feedback?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  challengeId?: string;
  trackId?: string;
  requirements: string;
}

export interface Credential {
  id: string;
  userId: string;
  badgeId: string;
  issuedAt: Date;
  expiresAt?: Date;
  verificationUrl: string;
  metadata: Record<string, unknown>;
}

export interface PortfolioArtifact {
  id: string;
  userId: string;
  outcomeId?: string;
  type: ArtifactType;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// ENGAGEMENT & ECONOMY
// ============================================

export type XPEventType = 
  | 'mission_complete'
  | 'challenge_complete'
  | 'artifact_upload'
  | 'badge_earned'
  | 'streak_bonus'
  | 'easter_egg'
  | 'referral'
  | 'daily_login'
  | 'first_visit'
  | 'level_up';

export interface XPEvent {
  id: string;
  userId: string;
  type: XPEventType;
  amount: number;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Level {
  level: number;
  name: string;
  tier: 'initiate' | 'explorer' | 'builder' | 'architect' | 'ascended' | 'transcendent';
  minXp: number;
  maxXp: number;
  icon: string;
  perks: string[];
}

export type RewardType = 'points' | 'voucher' | 'badge' | 'recognition' | 'access';

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  value: number | string;
  imageUrl?: string;
  expiresAt?: Date;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  claimedAt: Date;
  status: 'available' | 'claimed' | 'expired' | 'used';
}

export type OpportunityType = 
  | 'internship'
  | 'gig'
  | 'volunteer'
  | 'work_simulation'
  | 'apprenticeship'
  | 'mentorship';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  organizationId: string;
  requiredSkills: string[];
  requiredBadges: string[];
  minLevel: number;
  location?: string;
  isRemote: boolean;
  compensation?: string;
  duration?: string;
  applicationDeadline?: Date;
  status: 'draft' | 'open' | 'closed' | 'filled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  userId: string;
  opportunityId: string;
  score: number;
  status: 'suggested' | 'applied' | 'interviewing' | 'accepted' | 'rejected';
  appliedAt?: Date;
  updatedAt: Date;
}

// ============================================
// OPERATIONS
// ============================================

export interface InventoryItem {
  id: string;
  kitId?: string;
  componentId?: string;
  organizationId?: string;
  regionId: string;
  quantity: number;
  reservedQuantity: number;
  reorderThreshold: number;
  vendorId: string;
  updatedAt: Date;
}

export type ShipmentStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'returned';

export interface Shipment {
  id: string;
  userId: string;
  organizationId?: string;
  items: ShipmentItem[];
  status: ShipmentStatus;
  trackingNumber?: string;
  carrier?: string;
  shippingAddress: Address;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShipmentItem {
  kitId?: string;
  componentId?: string;
  quantity: number;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface VendorProfile {
  id: string;
  name: string;
  contactEmail: string;
  regions: string[];
  components: string[];
  rating: number;
  status: 'active' | 'inactive' | 'pending';
}

export interface FacilitatorAssignment {
  id: string;
  userId: string;
  cohortId: string;
  role: 'lead' | 'assistant';
  assignedAt: Date;
  status: 'active' | 'completed';
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assigneeId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface FeedbackLoop {
  id: string;
  userId: string;
  type: 'nps' | 'reflection' | 'survey' | 'review';
  entityType: 'challenge' | 'kit' | 'cohort' | 'facilitator' | 'platform';
  entityId: string;
  rating?: number;
  response: Record<string, unknown>;
  createdAt: Date;
}

// ============================================
// ANALYTICS EVENTS
// ============================================

export type AnalyticsEventType =
  | 'page_view'
  | 'session_start'
  | 'session_end'
  | 'feature_used'
  | 'conversion'
  | 'error'
  | 'xp_earned'
  | 'mission_started'
  | 'mission_completed'
  | 'artifact_uploaded'
  | 'level_up'
  | 'easter_egg_found';

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  type: AnalyticsEventType;
  properties: Record<string, unknown>;
  timestamp: Date;
  userAgent?: string;
  ipHash?: string;
}
