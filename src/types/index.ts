/**
 * ProjectX OS — Type Exports
 */

export * from './entities';

// Go-Live types (explicit exports to avoid conflicts)
export type {
  GoLiveRole,
  TenantScoped,
  UserScoped,
  GoLiveUser,
  AuthSession,
  TeacherAssignment,
  Mission,
  MissionStep,
  ResourceLink,
  SubmissionStatus,
  Submission,
  SubmissionArtifact,
  TeacherFeedback,
  SubmissionEventType,
  SubmissionEvent,
  School,
  SchoolSettings,
  GoLiveRegion,
  GoLiveCohort,
  UploadRequest,
  UploadResponse,
  PaginatedResponse,
  ApiError,
  ApiResponse,
  StudentDashboard,
  MissionWithProgress,
  SubmissionSummary,
  FeedbackNotification,
  StudentStats,
  TeacherDashboard,
  SubmissionQueueItem,
  TeacherStats,
  AdminDashboard,
  AdminStats,
} from './go-live';

export {
  ROLE_PERMISSIONS,
  VALID_STATUS_TRANSITIONS,
  UPLOAD_CONFIG,
} from './go-live';
