/**
 * ProjectX OS — Authentication Service
 *
 * Mock authentication for development.
 * In production, replace with Clerk, Auth.js, or your preferred auth provider.
 *
 * Reference: /docs/GO-LIVE-SPEC.md Section 1
 */

import type {
  AuthSession,
  GoLiveRole,
  GoLiveUser,
  ROLE_PERMISSIONS,
} from '@/types/go-live';

// ============================================
// MOCK USER DATABASE
// ============================================

/**
 * Mock users for development
 * In production: Replace with database queries
 */
const MOCK_USERS: GoLiveUser[] = [
  {
    id: 'student-001',
    email: 'alex@projectx.school',
    displayName: 'Alex Chen',
    role: 'student',
    regionId: 'region-mumbai',
    schoolId: 'school-projectx-hq',
    assignedTeacherId: 'teacher-001',
    cohortIds: ['cohort-alpha'],
    xp: 2450,
    level: 5,
    status: 'active',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-31'),
  },
  {
    id: 'student-002',
    email: 'priya@projectx.school',
    displayName: 'Priya Sharma',
    role: 'student',
    regionId: 'region-mumbai',
    schoolId: 'school-projectx-hq',
    assignedTeacherId: 'teacher-001',
    cohortIds: ['cohort-alpha'],
    xp: 1800,
    level: 4,
    status: 'active',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-30'),
  },
  {
    id: 'teacher-001',
    email: 'ms.patel@projectx.school',
    displayName: 'Ms. Patel',
    role: 'teacher',
    regionId: 'region-mumbai',
    schoolId: 'school-projectx-hq',
    cohortIds: ['cohort-alpha', 'cohort-beta'],
    xp: 0,
    level: 0,
    status: 'active',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-01-31'),
  },
  {
    id: 'teacher-002',
    email: 'mr.singh@projectx.school',
    displayName: 'Mr. Singh',
    role: 'teacher',
    regionId: 'region-mumbai',
    schoolId: 'school-projectx-hq',
    cohortIds: ['cohort-beta'],
    xp: 0,
    level: 0,
    status: 'active',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2025-01-31'),
  },
  {
    id: 'admin-001',
    email: 'admin@projectx.school',
    displayName: 'Admin User',
    role: 'school_admin',
    regionId: 'region-mumbai',
    schoolId: 'school-projectx-hq',
    cohortIds: [],
    xp: 0,
    level: 0,
    status: 'active',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2025-01-31'),
  },
  {
    id: 'regional-001',
    email: 'regional@projectx.org',
    displayName: 'Regional Admin',
    role: 'regional_admin',
    regionId: 'region-mumbai',
    schoolId: 'school-projectx-hq',
    cohortIds: [],
    xp: 0,
    level: 0,
    status: 'active',
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2025-01-31'),
  },
  {
    id: 'super-001',
    email: 'super@projectx.org',
    displayName: 'Super Admin',
    role: 'super_admin',
    regionId: 'region-global',
    schoolId: 'school-global',
    cohortIds: [],
    xp: 0,
    level: 0,
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-31'),
  },
];

// ============================================
// SESSION MANAGEMENT
// ============================================

const SESSION_KEY = 'projectx_session';
const SESSION_EXPIRY_HOURS = 24;

/**
 * Get role permissions
 */
function getRolePermissions(role: GoLiveRole): string[] {
  const permissions: Record<GoLiveRole, string[]> = {
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

  return permissions[role] || [];
}

/**
 * Create a session for a user
 */
function createSession(user: GoLiveUser): AuthSession {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);

  return {
    userId: user.id,
    role: user.role,
    regionId: user.regionId,
    schoolId: user.schoolId,
    permissions: getRolePermissions(user.role),
    expiresAt,
  };
}

/**
 * Store session in localStorage (client-side)
 */
function storeSession(session: AuthSession): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

/**
 * Get current session from localStorage
 */
function getStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored) as AuthSession;
    session.expiresAt = new Date(session.expiresAt);

    // Check expiry
    if (session.expiresAt < new Date()) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

/**
 * Clear session
 */
function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

// ============================================
// AUTH API
// ============================================

export interface LoginResult {
  success: boolean;
  session?: AuthSession;
  user?: GoLiveUser;
  error?: string;
}

/**
 * Login with email (mock implementation)
 * In production: Integrate with auth provider
 */
export async function login(email: string): Promise<LoginResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    return {
      success: false,
      error: 'User not found. Try: alex@projectx.school, ms.patel@projectx.school, or admin@projectx.school',
    };
  }

  if (user.status !== 'active') {
    return {
      success: false,
      error: 'Account is not active. Contact your administrator.',
    };
  }

  const session = createSession(user);
  storeSession(session);

  return {
    success: true,
    session,
    user,
  };
}

/**
 * Login with role (for demo/testing)
 */
export async function loginAsRole(role: GoLiveRole): Promise<LoginResult> {
  const user = MOCK_USERS.find((u) => u.role === role);

  if (!user) {
    return {
      success: false,
      error: `No mock user found for role: ${role}`,
    };
  }

  const session = createSession(user);
  storeSession(session);

  return {
    success: true,
    session,
    user,
  };
}

/**
 * Logout current user
 */
export function logout(): void {
  clearSession();
}

/**
 * Get current session
 */
export function getSession(): AuthSession | null {
  return getStoredSession();
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<GoLiveUser | null> {
  const session = getSession();
  if (!session) return null;

  // In production: Fetch from database
  return MOCK_USERS.find((u) => u.id === session.userId) || null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/**
 * Check if user has specific permission
 */
export function hasPermission(permission: string): boolean {
  const session = getSession();
  if (!session) return false;

  // Super admin has all permissions
  if (session.role === 'super_admin') return true;

  // Check for wildcard permissions (e.g., 'mission:*')
  const [resource] = permission.split(':');
  if (session.permissions.includes(`${resource}:*`)) return true;

  return session.permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(permissions: string[]): boolean {
  return permissions.some((p) => hasPermission(p));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(permissions: string[]): boolean {
  return permissions.every((p) => hasPermission(p));
}

/**
 * Check if user has specific role
 */
export function hasRole(role: GoLiveRole): boolean {
  const session = getSession();
  if (!session) return false;
  return session.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(roles: GoLiveRole[]): boolean {
  const session = getSession();
  if (!session) return false;
  return roles.includes(session.role);
}

/**
 * Get user's tenant scope
 */
export function getTenantScope(): { regionId: string; schoolId: string } | null {
  const session = getSession();
  if (!session) return null;
  return {
    regionId: session.regionId,
    schoolId: session.schoolId,
  };
}

// ============================================
// MOCK DATA QUERIES (Replace with DB queries)
// ============================================

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<GoLiveUser | null> {
  return MOCK_USERS.find((u) => u.id === userId) || null;
}

/**
 * Get users by school
 */
export async function getUsersBySchool(schoolId: string): Promise<GoLiveUser[]> {
  return MOCK_USERS.filter((u) => u.schoolId === schoolId);
}

/**
 * Get users by role in school
 */
export async function getUsersByRoleInSchool(
  schoolId: string,
  role: GoLiveRole
): Promise<GoLiveUser[]> {
  return MOCK_USERS.filter((u) => u.schoolId === schoolId && u.role === role);
}

/**
 * Get students assigned to teacher
 */
export async function getStudentsForTeacher(
  teacherId: string
): Promise<GoLiveUser[]> {
  return MOCK_USERS.filter(
    (u) => u.role === 'student' && u.assignedTeacherId === teacherId
  );
}

/**
 * Get teacher for student
 */
export async function getTeacherForStudent(
  studentId: string
): Promise<GoLiveUser | null> {
  const student = MOCK_USERS.find((u) => u.id === studentId);
  if (!student?.assignedTeacherId) return null;
  return MOCK_USERS.find((u) => u.id === student.assignedTeacherId) || null;
}

// ============================================
// EXPORT ALL MOCK USERS (for testing)
// ============================================

export const mockUsers = MOCK_USERS;
