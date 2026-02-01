/**
 * ProjectX OS — RBAC Middleware & Guards
 *
 * Route protection and permission enforcement.
 * Reference: /docs/GO-LIVE-SPEC.md Section 1
 */

import { redirect } from 'next/navigation';
import type { GoLiveRole } from '@/types/go-live';
import {
  getSession,
  hasPermission,
  hasAnyRole,
  isAuthenticated,
} from './auth-service';

// ============================================
// ROUTE DEFINITIONS
// ============================================

/**
 * Route access configuration
 */
export interface RouteConfig {
  path: string;
  requiredRoles?: GoLiveRole[];
  requiredPermissions?: string[];
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * Protected routes configuration
 */
export const PROTECTED_ROUTES: RouteConfig[] = [
  // Student routes
  {
    path: '/student',
    requiredRoles: ['student'],
    requireAuth: true,
  },
  {
    path: '/mission',
    requiredRoles: ['student', 'teacher', 'school_admin', 'regional_admin', 'super_admin'],
    requireAuth: true,
  },

  // Teacher routes
  {
    path: '/teacher',
    requiredRoles: ['teacher'],
    requireAuth: true,
  },
  {
    path: '/review',
    requiredRoles: ['teacher'],
    requireAuth: true,
  },

  // Admin routes
  {
    path: '/admin',
    requiredRoles: ['school_admin', 'regional_admin', 'super_admin'],
    requireAuth: true,
  },

  // OS routes (authenticated users)
  {
    path: '/os',
    requireAuth: true,
  },
];

/**
 * Public routes (no auth required)
 */
export const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/manifesto',
  '/vision',
  '/mission', // Note: mission details require auth, but landing is public
  '/careers',
  '/contact',
  '/legal',
  '/partners',
  '/login',
];

// ============================================
// GUARD FUNCTIONS
// ============================================

/**
 * Check if a route is protected
 */
export function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.some((route) => path.startsWith(route.path));
}

/**
 * Get route configuration
 */
export function getRouteConfig(path: string): RouteConfig | undefined {
  return PROTECTED_ROUTES.find((route) => path.startsWith(route.path));
}

/**
 * Check if current user can access route
 */
export function canAccessRoute(path: string): boolean {
  const config = getRouteConfig(path);

  // No config = public route
  if (!config) return true;

  // Check authentication
  if (config.requireAuth && !isAuthenticated()) {
    return false;
  }

  const session = getSession();
  if (!session) return !config.requireAuth;

  // Check roles
  if (config.requiredRoles && config.requiredRoles.length > 0) {
    if (!hasAnyRole(config.requiredRoles)) {
      return false;
    }
  }

  // Check permissions
  if (config.requiredPermissions && config.requiredPermissions.length > 0) {
    const hasAllPerms = config.requiredPermissions.every((p) =>
      hasPermission(p)
    );
    if (!hasAllPerms) return false;
  }

  return true;
}

/**
 * Require authentication - throws redirect if not authenticated
 * Use in Server Components
 */
export function requireAuth(): void {
  if (!isAuthenticated()) {
    redirect('/login');
  }
}

/**
 * Require specific role - throws redirect if not authorized
 * Use in Server Components
 */
export function requireRole(roles: GoLiveRole[]): void {
  requireAuth();

  if (!hasAnyRole(roles)) {
    redirect('/unauthorized');
  }
}

/**
 * Require specific permission - throws redirect if not authorized
 * Use in Server Components
 */
export function requirePermission(permission: string): void {
  requireAuth();

  if (!hasPermission(permission)) {
    redirect('/unauthorized');
  }
}

// ============================================
// TENANT ISOLATION
// ============================================

/**
 * Check if user can access resource in specific tenant
 */
export function canAccessTenant(
  resourceRegionId: string,
  resourceSchoolId: string
): boolean {
  const session = getSession();
  if (!session) return false;

  // Super admin can access all tenants
  if (session.role === 'super_admin') return true;

  // Regional admin can access all schools in their region
  if (session.role === 'regional_admin') {
    return session.regionId === resourceRegionId;
  }

  // Others can only access their own school
  return (
    session.regionId === resourceRegionId &&
    session.schoolId === resourceSchoolId
  );
}

/**
 * Filter entities by tenant scope
 */
export function filterByTenant<T extends { regionId: string; schoolId: string }>(
  entities: T[]
): T[] {
  const session = getSession();
  if (!session) return [];

  // Super admin sees all
  if (session.role === 'super_admin') return entities;

  // Regional admin sees their region
  if (session.role === 'regional_admin') {
    return entities.filter((e) => e.regionId === session.regionId);
  }

  // Others see their school only
  return entities.filter(
    (e) =>
      e.regionId === session.regionId && e.schoolId === session.schoolId
  );
}

// ============================================
// SUBMISSION ACCESS CONTROL
// ============================================

/**
 * Check if user can access a submission
 */
export function canAccessSubmission(submission: {
  userId: string;
  assignedTeacherId: string;
  regionId: string;
  schoolId: string;
}): boolean {
  const session = getSession();
  if (!session) return false;

  // Super admin can access all
  if (session.role === 'super_admin') return true;

  // Regional admin can access their region
  if (session.role === 'regional_admin') {
    return session.regionId === submission.regionId;
  }

  // School admin can access their school
  if (session.role === 'school_admin') {
    return (
      session.regionId === submission.regionId &&
      session.schoolId === submission.schoolId
    );
  }

  // Teacher can only access assigned submissions
  if (session.role === 'teacher') {
    return submission.assignedTeacherId === session.userId;
  }

  // Student can only access own submissions
  if (session.role === 'student') {
    return submission.userId === session.userId;
  }

  return false;
}

/**
 * Check if user can update submission status
 */
export function canUpdateSubmissionStatus(submission: {
  userId: string;
  assignedTeacherId: string;
  status: string;
}): { canUpdate: boolean; allowedStatuses: string[] } {
  const session = getSession();
  if (!session) return { canUpdate: false, allowedStatuses: [] };

  // Student can only submit their own draft or resubmit
  if (session.role === 'student') {
    if (submission.userId !== session.userId) {
      return { canUpdate: false, allowedStatuses: [] };
    }

    if (submission.status === 'DRAFT') {
      return { canUpdate: true, allowedStatuses: ['SUBMITTED'] };
    }
    if (submission.status === 'FEEDBACK_REQUESTED') {
      return { canUpdate: true, allowedStatuses: ['RESUBMITTED'] };
    }
    return { canUpdate: false, allowedStatuses: [] };
  }

  // Teacher can update assigned submissions through review workflow
  if (session.role === 'teacher') {
    if (submission.assignedTeacherId !== session.userId) {
      return { canUpdate: false, allowedStatuses: [] };
    }

    switch (submission.status) {
      case 'SUBMITTED':
        return { canUpdate: true, allowedStatuses: ['UNDER_REVIEW'] };
      case 'UNDER_REVIEW':
        return {
          canUpdate: true,
          allowedStatuses: ['FEEDBACK_REQUESTED', 'APPROVED', 'REJECTED'],
        };
      case 'RESUBMITTED':
        return { canUpdate: true, allowedStatuses: ['UNDER_REVIEW'] };
      default:
        return { canUpdate: false, allowedStatuses: [] };
    }
  }

  // Admin can update any submission in their scope
  if (hasAnyRole(['school_admin', 'regional_admin', 'super_admin'])) {
    return {
      canUpdate: true,
      allowedStatuses: [
        'DRAFT',
        'SUBMITTED',
        'UNDER_REVIEW',
        'FEEDBACK_REQUESTED',
        'RESUBMITTED',
        'APPROVED',
        'REJECTED',
      ],
    };
  }

  return { canUpdate: false, allowedStatuses: [] };
}

// ============================================
// ROLE-BASED REDIRECTS
// ============================================

/**
 * Get default dashboard for user's role
 */
export function getDashboardForRole(role: GoLiveRole): string {
  switch (role) {
    case 'student':
      return '/student';
    case 'teacher':
      return '/teacher';
    case 'school_admin':
    case 'regional_admin':
    case 'super_admin':
      return '/admin';
    default:
      return '/os';
  }
}

/**
 * Redirect to role-appropriate dashboard
 */
export function redirectToDashboard(): never {
  const session = getSession();
  if (!session) {
    redirect('/login');
  }
  redirect(getDashboardForRole(session.role));
}
