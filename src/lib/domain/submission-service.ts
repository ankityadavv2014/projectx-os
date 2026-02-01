/**
 * ProjectX OS — Submission Service
 *
 * Core submission workflow engine with 7-state machine.
 * Reference: /docs/GO-LIVE-SPEC.md Section 5
 */

import type {
  Submission,
  SubmissionStatus,
  SubmissionEvent,
  SubmissionEventType,
  SubmissionArtifact,
  TeacherFeedback,
  VALID_STATUS_TRANSITIONS,
  GoLiveUser,
} from '@/types/go-live';
import { getSession } from '@/lib/auth';

// ============================================
// MOCK SUBMISSION DATABASE
// ============================================

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-001',
    userId: 'student-001',
    missionId: 'mission-001',
    regionId: 'region-mumbai',
    schoolId: 'school-projectx-hq',
    assignedTeacherId: 'teacher-001',
    status: 'SUBMITTED',
    artifacts: [
      {
        id: 'artifact-001',
        type: 'image',
        filename: 'robot-assembly.jpg',
        url: '/uploads/robot-assembly.jpg',
        sizeBytes: 2048000,
        mimeType: 'image/jpeg',
        uploadedAt: new Date('2025-01-30'),
      },
    ],
    selfReflection: 'I learned how to connect the motors to the microcontroller.',
    resubmissionCount: 0,
    createdAt: new Date('2025-01-28'),
    submittedAt: new Date('2025-01-30'),
    lastUpdatedAt: new Date('2025-01-30'),
  },
  {
    id: 'sub-002',
    userId: 'student-001',
    missionId: 'mission-002',
    regionId: 'region-mumbai',
    schoolId: 'school-projectx-hq',
    assignedTeacherId: 'teacher-001',
    status: 'DRAFT',
    artifacts: [],
    resubmissionCount: 0,
    createdAt: new Date('2025-01-31'),
    lastUpdatedAt: new Date('2025-01-31'),
  },
  {
    id: 'sub-003',
    userId: 'student-002',
    missionId: 'mission-001',
    regionId: 'region-mumbai',
    schoolId: 'school-projectx-hq',
    assignedTeacherId: 'teacher-001',
    status: 'UNDER_REVIEW',
    artifacts: [
      {
        id: 'artifact-002',
        type: 'video',
        filename: 'robot-demo.mp4',
        url: '/uploads/robot-demo.mp4',
        sizeBytes: 15728640,
        mimeType: 'video/mp4',
        uploadedAt: new Date('2025-01-29'),
      },
    ],
    resubmissionCount: 0,
    createdAt: new Date('2025-01-27'),
    submittedAt: new Date('2025-01-29'),
    reviewedAt: new Date('2025-01-31'),
    lastUpdatedAt: new Date('2025-01-31'),
  },
  {
    id: 'sub-004',
    userId: 'student-001',
    missionId: 'mission-003',
    regionId: 'region-mumbai',
    schoolId: 'school-projectx-hq',
    assignedTeacherId: 'teacher-001',
    status: 'APPROVED',
    artifacts: [
      {
        id: 'artifact-003',
        type: 'pdf',
        filename: 'project-report.pdf',
        url: '/uploads/project-report.pdf',
        sizeBytes: 512000,
        mimeType: 'application/pdf',
        uploadedAt: new Date('2025-01-20'),
      },
    ],
    feedback: [
      {
        id: 'feedback-001',
        teacherId: 'teacher-001',
        content: 'Excellent work! Your understanding of the concepts is clear.',
        type: 'general',
        createdAt: new Date('2025-01-22'),
      },
    ],
    xpEarned: 250,
    resubmissionCount: 0,
    createdAt: new Date('2025-01-15'),
    submittedAt: new Date('2025-01-20'),
    reviewedAt: new Date('2025-01-21'),
    completedAt: new Date('2025-01-22'),
    lastUpdatedAt: new Date('2025-01-22'),
  },
];

const MOCK_EVENTS: SubmissionEvent[] = [];

// ============================================
// STATUS MACHINE
// ============================================

/**
 * Valid status transitions
 */
const STATUS_TRANSITIONS: Record<SubmissionStatus, SubmissionStatus[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['FEEDBACK_REQUESTED', 'APPROVED', 'REJECTED'],
  FEEDBACK_REQUESTED: ['RESUBMITTED'],
  RESUBMITTED: ['UNDER_REVIEW'],
  APPROVED: [], // Terminal state
  REJECTED: ['DRAFT'], // Can restart
};

/**
 * Check if status transition is valid
 */
export function isValidTransition(
  from: SubmissionStatus,
  to: SubmissionStatus
): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Get allowed next statuses
 */
export function getNextStatuses(current: SubmissionStatus): SubmissionStatus[] {
  return STATUS_TRANSITIONS[current] ?? [];
}

// ============================================
// SUBMISSION CRUD
// ============================================

/**
 * Get submission by ID
 */
export async function getSubmission(id: string): Promise<Submission | null> {
  return MOCK_SUBMISSIONS.find((s) => s.id === id) || null;
}

/**
 * Get submissions for student
 */
export async function getSubmissionsForStudent(
  studentId: string
): Promise<Submission[]> {
  return MOCK_SUBMISSIONS.filter((s) => s.userId === studentId);
}

/**
 * Get submissions for teacher (assigned queue)
 */
export async function getSubmissionsForTeacher(
  teacherId: string,
  statusFilter?: SubmissionStatus[]
): Promise<Submission[]> {
  let submissions = MOCK_SUBMISSIONS.filter(
    (s) => s.assignedTeacherId === teacherId
  );

  if (statusFilter && statusFilter.length > 0) {
    submissions = submissions.filter((s) => statusFilter.includes(s.status));
  }

  // Sort by last updated, newest first
  return submissions.sort(
    (a, b) => b.lastUpdatedAt.getTime() - a.lastUpdatedAt.getTime()
  );
}

/**
 * Get pending review queue for teacher
 */
export async function getPendingReviewQueue(
  teacherId: string
): Promise<Submission[]> {
  return getSubmissionsForTeacher(teacherId, [
    'SUBMITTED',
    'RESUBMITTED',
    'UNDER_REVIEW',
  ]);
}

/**
 * Get submission for mission by student
 */
export async function getSubmissionForMission(
  studentId: string,
  missionId: string
): Promise<Submission | null> {
  return (
    MOCK_SUBMISSIONS.find(
      (s) => s.userId === studentId && s.missionId === missionId
    ) || null
  );
}

/**
 * Create draft submission when student starts mission
 */
export async function createDraftSubmission(
  studentId: string,
  missionId: string,
  assignedTeacherId: string,
  regionId: string,
  schoolId: string
): Promise<Submission> {
  const now = new Date();
  const submission: Submission = {
    id: `sub-${Date.now()}`,
    userId: studentId,
    missionId,
    regionId,
    schoolId,
    assignedTeacherId,
    status: 'DRAFT',
    artifacts: [],
    resubmissionCount: 0,
    createdAt: now,
    lastUpdatedAt: now,
  };

  MOCK_SUBMISSIONS.push(submission);

  // Log event
  await logSubmissionEvent(submission.id, 'CREATED', studentId, 'student');

  return submission;
}

/**
 * Update submission status with validation
 */
export async function updateSubmissionStatus(
  submissionId: string,
  newStatus: SubmissionStatus,
  actorId: string,
  actorRole: 'student' | 'teacher' | 'school_admin' | 'regional_admin' | 'super_admin',
  feedback?: string
): Promise<{ success: boolean; submission?: Submission; error?: string }> {
  const submission = await getSubmission(submissionId);

  if (!submission) {
    return { success: false, error: 'Submission not found' };
  }

  // Validate transition
  if (!isValidTransition(submission.status, newStatus)) {
    return {
      success: false,
      error: `Invalid status transition: ${submission.status} → ${newStatus}`,
    };
  }

  const previousStatus = submission.status;
  const now = new Date();

  // Update status
  submission.status = newStatus;
  submission.lastUpdatedAt = now;

  // Handle status-specific updates
  switch (newStatus) {
    case 'SUBMITTED':
      submission.submittedAt = now;
      break;

    case 'UNDER_REVIEW':
      if (!submission.reviewedAt) {
        submission.reviewedAt = now;
      }
      break;

    case 'RESUBMITTED':
      submission.resubmissionCount += 1;
      break;

    case 'APPROVED':
    case 'REJECTED':
      submission.completedAt = now;
      // Add XP for approved submissions
      if (newStatus === 'APPROVED') {
        submission.xpEarned = 250; // TODO: Get from mission config
      }
      break;
  }

  // Add feedback if provided
  if (feedback && actorRole === 'teacher') {
    const feedbackEntry: TeacherFeedback = {
      id: `feedback-${Date.now()}`,
      teacherId: actorId,
      content: feedback,
      type: 'general',
      createdAt: now,
    };
    submission.feedback = submission.feedback || [];
    submission.feedback.push(feedbackEntry);
  }

  // Log event
  const eventType = getEventTypeForStatus(newStatus);
  await logSubmissionEvent(
    submissionId,
    eventType,
    actorId,
    actorRole,
    previousStatus,
    newStatus
  );

  return { success: true, submission };
}

/**
 * Add artifact to submission
 */
export async function addArtifact(
  submissionId: string,
  artifact: Omit<SubmissionArtifact, 'id' | 'uploadedAt'>
): Promise<{ success: boolean; artifact?: SubmissionArtifact; error?: string }> {
  const submission = await getSubmission(submissionId);

  if (!submission) {
    return { success: false, error: 'Submission not found' };
  }

  // Can only add artifacts to draft, submitted, or feedback_requested
  if (!['DRAFT', 'SUBMITTED', 'FEEDBACK_REQUESTED'].includes(submission.status)) {
    return { success: false, error: 'Cannot add artifacts in current status' };
  }

  const newArtifact: SubmissionArtifact = {
    ...artifact,
    id: `artifact-${Date.now()}`,
    uploadedAt: new Date(),
  };

  submission.artifacts.push(newArtifact);
  submission.lastUpdatedAt = new Date();

  // Log event
  const session = getSession();
  if (session) {
    await logSubmissionEvent(
      submissionId,
      'ARTIFACT_UPLOADED',
      session.userId,
      session.role,
      undefined,
      undefined,
      { artifactId: newArtifact.id, filename: newArtifact.filename }
    );
  }

  return { success: true, artifact: newArtifact };
}

/**
 * Remove artifact from submission
 */
export async function removeArtifact(
  submissionId: string,
  artifactId: string
): Promise<{ success: boolean; error?: string }> {
  const submission = await getSubmission(submissionId);

  if (!submission) {
    return { success: false, error: 'Submission not found' };
  }

  // Can only remove artifacts from draft or feedback_requested
  if (!['DRAFT', 'FEEDBACK_REQUESTED'].includes(submission.status)) {
    return { success: false, error: 'Cannot remove artifacts in current status' };
  }

  const index = submission.artifacts.findIndex((a) => a.id === artifactId);
  if (index === -1) {
    return { success: false, error: 'Artifact not found' };
  }

  submission.artifacts.splice(index, 1);
  submission.lastUpdatedAt = new Date();

  return { success: true };
}

/**
 * Update self-reflection
 */
export async function updateReflection(
  submissionId: string,
  reflection: string
): Promise<{ success: boolean; error?: string }> {
  const submission = await getSubmission(submissionId);

  if (!submission) {
    return { success: false, error: 'Submission not found' };
  }

  // Can only update reflection before final approval
  if (['APPROVED', 'REJECTED'].includes(submission.status)) {
    return { success: false, error: 'Cannot update reflection after completion' };
  }

  submission.selfReflection = reflection;
  submission.lastUpdatedAt = new Date();

  return { success: true };
}

// ============================================
// AUDIT LOG
// ============================================

/**
 * Log submission event
 */
async function logSubmissionEvent(
  submissionId: string,
  eventType: SubmissionEventType,
  actorId: string,
  actorRole: string,
  previousStatus?: SubmissionStatus,
  newStatus?: SubmissionStatus,
  metadata?: Record<string, unknown>
): Promise<void> {
  const event: SubmissionEvent = {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    submissionId,
    eventType,
    actorId,
    actorRole: actorRole as any,
    timestamp: new Date(),
    metadata,
    previousStatus,
    newStatus,
  };

  MOCK_EVENTS.push(event);
}

/**
 * Get events for submission
 */
export async function getSubmissionEvents(
  submissionId: string
): Promise<SubmissionEvent[]> {
  return MOCK_EVENTS.filter((e) => e.submissionId === submissionId).sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}

/**
 * Get recent events for school (admin view)
 */
export async function getRecentEvents(
  schoolId: string,
  limit: number = 50
): Promise<SubmissionEvent[]> {
  // In production, filter by school
  return MOCK_EVENTS.slice(-limit).reverse();
}

// ============================================
// HELPERS
// ============================================

/**
 * Map status to event type
 */
function getEventTypeForStatus(status: SubmissionStatus): SubmissionEventType {
  switch (status) {
    case 'SUBMITTED':
      return 'SUBMITTED';
    case 'UNDER_REVIEW':
      return 'OPENED';
    case 'FEEDBACK_REQUESTED':
      return 'FEEDBACK_REQUESTED';
    case 'RESUBMITTED':
      return 'RESUBMITTED';
    case 'APPROVED':
      return 'APPROVED';
    case 'REJECTED':
      return 'REJECTED';
    default:
      return 'CREATED';
  }
}

/**
 * Get status display info
 */
export function getStatusInfo(status: SubmissionStatus): {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
} {
  switch (status) {
    case 'DRAFT':
      return {
        label: 'Draft',
        color: 'text-gray-400',
        bgColor: 'bg-gray-800',
        icon: '📝',
      };
    case 'SUBMITTED':
      return {
        label: 'Submitted',
        color: 'text-blue-400',
        bgColor: 'bg-blue-900/50',
        icon: '📤',
      };
    case 'UNDER_REVIEW':
      return {
        label: 'Under Review',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-900/50',
        icon: '🔍',
      };
    case 'FEEDBACK_REQUESTED':
      return {
        label: 'Feedback Requested',
        color: 'text-orange-400',
        bgColor: 'bg-orange-900/50',
        icon: '💬',
      };
    case 'RESUBMITTED':
      return {
        label: 'Resubmitted',
        color: 'text-purple-400',
        bgColor: 'bg-purple-900/50',
        icon: '🔄',
      };
    case 'APPROVED':
      return {
        label: 'Approved',
        color: 'text-green-400',
        bgColor: 'bg-green-900/50',
        icon: '✅',
      };
    case 'REJECTED':
      return {
        label: 'Rejected',
        color: 'text-red-400',
        bgColor: 'bg-red-900/50',
        icon: '❌',
      };
    default:
      return {
        label: 'Unknown',
        color: 'text-gray-400',
        bgColor: 'bg-gray-800',
        icon: '❓',
      };
  }
}

// ============================================
// STATISTICS
// ============================================

/**
 * Get submission stats for student
 */
export async function getStudentStats(studentId: string): Promise<{
  total: number;
  draft: number;
  pending: number;
  approved: number;
  rejected: number;
}> {
  const submissions = await getSubmissionsForStudent(studentId);

  return {
    total: submissions.length,
    draft: submissions.filter((s) => s.status === 'DRAFT').length,
    pending: submissions.filter((s) =>
      ['SUBMITTED', 'UNDER_REVIEW', 'FEEDBACK_REQUESTED', 'RESUBMITTED'].includes(s.status)
    ).length,
    approved: submissions.filter((s) => s.status === 'APPROVED').length,
    rejected: submissions.filter((s) => s.status === 'REJECTED').length,
  };
}

/**
 * Get review stats for teacher
 */
export async function getTeacherStats(teacherId: string): Promise<{
  pendingReviews: number;
  reviewedToday: number;
  totalReviewed: number;
  averageReviewTime: number;
}> {
  const submissions = await getSubmissionsForTeacher(teacherId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pendingReviews = submissions.filter((s) =>
    ['SUBMITTED', 'RESUBMITTED', 'UNDER_REVIEW'].includes(s.status)
  ).length;

  const reviewedToday = submissions.filter(
    (s) =>
      s.reviewedAt &&
      s.reviewedAt >= today &&
      ['APPROVED', 'REJECTED', 'FEEDBACK_REQUESTED'].includes(s.status)
  ).length;

  const totalReviewed = submissions.filter((s) =>
    ['APPROVED', 'REJECTED'].includes(s.status)
  ).length;

  // Mock average review time (in production, calculate from events)
  const averageReviewTime = 15; // minutes

  return {
    pendingReviews,
    reviewedToday,
    totalReviewed,
    averageReviewTime,
  };
}
