// ProjectX OS - Hooks Index
// Centralized exports for all custom hooks

// User & Auth
export {
  useCurrentUser,
  useUsers,
  useRoleCheck,
  useUser,
} from "./useUser";

// Missions
export {
  useMissions,
  useMission,
  useAssignments,
  useMyMissions,
} from "./useMissions";

// Submissions
export {
  useSubmissions,
  useMySubmissions,
  usePendingReviews,
  useSubmission,
  useSubmissionActions,
} from "./useSubmissions";

// Reviews
export {
  useReviews,
  useMyReviews,
  useReviewActions,
} from "./useReviews";

// XP & Progression
export {
  useXP,
  useLeaderboard,
  calculateLevelFromXP,
  calculateXPForLevel,
  calculateXPForNextLevel,
  getTierFromLevel,
} from "./useXP";

// Phases
export {
  usePhase,
  usePhaseUnlock,
} from "./usePhase";

// Badges
export {
  useBadges,
  useMyBadges,
  useBadgeActions,
} from "./useBadges";

// Cohorts
export {
  useCohorts,
  useMyCohorts,
  useCohort,
} from "./useCohorts";

// Easter Eggs (existing)
export { useEasterEggs } from "./useEasterEggs";
