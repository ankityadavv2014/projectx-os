/**
 * ProjectX OS — Auth Module Exports
 */

// Auth Context (React hooks)
export { AuthProvider, useAuth, usePermission, useRequireAuth, useRequireRole } from './auth-context';

// Authentication service
export {
  login,
  loginAsRole,
  logout,
  getSession,
  getCurrentUser,
  isAuthenticated,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  getTenantScope,
  getUserById,
  getUsersBySchool,
  getUsersByRoleInSchool,
  getStudentsForTeacher,
  getTeacherForStudent,
  validateSession,
  canBootOS,
  mockUsers,
  type LoginResult,
} from './auth-service';

// RBAC and route protection
export {
  isProtectedRoute,
  getRouteConfig,
  canAccessRoute,
  requireAuth,
  requireRole,
  requirePermission,
  canAccessTenant,
  filterByTenant,
  canAccessSubmission,
  canUpdateSubmissionStatus,
  getDashboardForRole,
  redirectToDashboard,
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
  type RouteConfig,
} from './rbac';
