// ProjectX OS - Mock Data Store
// localStorage-based persistence for MVP

import type {
  User,
  Organization,
  Cohort,
  Mission,
  Submission,
  Review,
  XPEvent,
  Badge,
  UserBadge,
  Rubric,
  Artifact,
  Assignment,
} from './types';

// =============================================================================
// STORAGE KEYS
// =============================================================================

const STORE_KEYS = {
  users: 'projectx_users',
  organizations: 'projectx_orgs',
  cohorts: 'projectx_cohorts',
  missions: 'projectx_missions',
  rubrics: 'projectx_rubrics',
  assignments: 'projectx_assignments',
  submissions: 'projectx_submissions',
  artifacts: 'projectx_artifacts',
  reviews: 'projectx_reviews',
  xpEvents: 'projectx_xp_events',
  badges: 'projectx_badges',
  userBadges: 'projectx_user_badges',
  currentUser: 'projectx_current_user',
  events: 'projectx_events',
} as const;

// =============================================================================
// GENERIC STORE OPERATIONS
// =============================================================================

function getStore<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setStore<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function getById<T extends { id: string }>(key: string, id: string): T | null {
  const items = getStore<T>(key);
  return items.find(item => item.id === id) || null;
}

function create<T extends { id: string }>(key: string, item: T): T {
  const items = getStore<T>(key);
  items.push(item);
  setStore(key, items);
  return item;
}

function update<T extends { id: string }>(key: string, id: string, updates: Partial<T>): T | null {
  const items = getStore<T>(key);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  items[index] = { ...items[index], ...updates };
  setStore(key, items);
  return items[index];
}

function remove<T extends { id: string }>(key: string, id: string): boolean {
  const items = getStore<T>(key);
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;
  
  setStore(key, filtered);
  return true;
}

// =============================================================================
// DOMAIN-SPECIFIC STORES
// =============================================================================

// Users
export const usersStore = {
  getAll: () => getStore<User>(STORE_KEYS.users),
  getById: (id: string) => getById<User>(STORE_KEYS.users, id),
  getByRole: (role: User['role']) => getStore<User>(STORE_KEYS.users).filter(u => u.role === role),
  getByCohort: (cohortId: string) => getStore<User>(STORE_KEYS.users).filter(u => u.cohortIds.includes(cohortId)),
  create: (user: User) => create(STORE_KEYS.users, user),
  update: (id: string, updates: Partial<User>) => update(STORE_KEYS.users, id, updates),
  delete: (id: string) => remove<User>(STORE_KEYS.users, id),
};

// Organizations
export const orgsStore = {
  getAll: () => getStore<Organization>(STORE_KEYS.organizations),
  getById: (id: string) => getById<Organization>(STORE_KEYS.organizations, id),
  create: (org: Organization) => create(STORE_KEYS.organizations, org),
  update: (id: string, updates: Partial<Organization>) => update(STORE_KEYS.organizations, id, updates),
};

// Cohorts
export const cohortsStore = {
  getAll: () => getStore<Cohort>(STORE_KEYS.cohorts),
  getById: (id: string) => getById<Cohort>(STORE_KEYS.cohorts, id),
  getByOrg: (orgId: string) => getStore<Cohort>(STORE_KEYS.cohorts).filter(c => c.orgId === orgId),
  getByCode: (code: string) => getStore<Cohort>(STORE_KEYS.cohorts).find(c => c.code === code),
  create: (cohort: Cohort) => create(STORE_KEYS.cohorts, cohort),
  update: (id: string, updates: Partial<Cohort>) => update(STORE_KEYS.cohorts, id, updates),
};

// Missions
export const missionsStore = {
  getAll: () => getStore<Mission>(STORE_KEYS.missions),
  getById: (id: string) => getById<Mission>(STORE_KEYS.missions, id),
  getPublished: () => getStore<Mission>(STORE_KEYS.missions).filter(m => m.status === 'published'),
  create: (mission: Mission) => create(STORE_KEYS.missions, mission),
  update: (id: string, updates: Partial<Mission>) => update(STORE_KEYS.missions, id, updates),
};

// Rubrics
export const rubricsStore = {
  getAll: () => getStore<Rubric>(STORE_KEYS.rubrics),
  getById: (id: string) => getById<Rubric>(STORE_KEYS.rubrics, id),
  create: (rubric: Rubric) => create(STORE_KEYS.rubrics, rubric),
};

// Assignments
export const assignmentsStore = {
  getAll: () => getStore<Assignment>(STORE_KEYS.assignments),
  getById: (id: string) => getById<Assignment>(STORE_KEYS.assignments, id),
  getByCohort: (cohortId: string) => getStore<Assignment>(STORE_KEYS.assignments).filter(a => a.cohortId === cohortId),
  getByStudent: (studentId: string) => getStore<Assignment>(STORE_KEYS.assignments).filter(a => 
    a.studentIds?.includes(studentId) || true // If no studentIds, assume cohort-wide
  ),
  create: (assignment: Assignment) => create(STORE_KEYS.assignments, assignment),
  update: (id: string, updates: Partial<Assignment>) => update(STORE_KEYS.assignments, id, updates),
};

// Submissions
export const submissionsStore = {
  getAll: () => getStore<Submission>(STORE_KEYS.submissions),
  getById: (id: string) => getById<Submission>(STORE_KEYS.submissions, id),
  getByStudent: (studentId: string) => getStore<Submission>(STORE_KEYS.submissions).filter(s => s.studentId === studentId),
  getByCohort: (cohortId: string) => getStore<Submission>(STORE_KEYS.submissions).filter(s => s.cohortId === cohortId),
  getPending: () => getStore<Submission>(STORE_KEYS.submissions).filter(s => s.status === 'submitted'),
  create: (submission: Submission) => create(STORE_KEYS.submissions, submission),
  update: (id: string, updates: Partial<Submission>) => update(STORE_KEYS.submissions, id, updates),
};

// Artifacts
export const artifactsStore = {
  getAll: () => getStore<Artifact>(STORE_KEYS.artifacts),
  getById: (id: string) => getById<Artifact>(STORE_KEYS.artifacts, id),
  getBySubmission: (submissionId: string) => getStore<Artifact>(STORE_KEYS.artifacts).filter(a => a.submissionId === submissionId),
  create: (artifact: Artifact) => create(STORE_KEYS.artifacts, artifact),
};

// Reviews
export const reviewsStore = {
  getAll: () => getStore<Review>(STORE_KEYS.reviews),
  getById: (id: string) => getById<Review>(STORE_KEYS.reviews, id),
  getBySubmission: (submissionId: string) => getStore<Review>(STORE_KEYS.reviews).find(r => r.submissionId === submissionId),
  create: (review: Review) => create(STORE_KEYS.reviews, review),
};

// XP Events
export const xpEventsStore = {
  getAll: () => getStore<XPEvent>(STORE_KEYS.xpEvents),
  getByUser: (userId: string) => getStore<XPEvent>(STORE_KEYS.xpEvents).filter(e => e.userId === userId),
  create: (event: XPEvent) => create(STORE_KEYS.xpEvents, event),
};

// Badges
export const badgesStore = {
  getAll: () => getStore<Badge>(STORE_KEYS.badges),
  getById: (id: string) => getById<Badge>(STORE_KEYS.badges, id),
  create: (badge: Badge) => create(STORE_KEYS.badges, badge),
};

// User Badges
export const userBadgesStore = {
  getAll: () => getStore<UserBadge>(STORE_KEYS.userBadges),
  getByUser: (userId: string) => getStore<UserBadge>(STORE_KEYS.userBadges).filter(b => b.userId === userId),
  create: (userBadge: UserBadge) => create(STORE_KEYS.userBadges, userBadge),
};

// =============================================================================
// CURRENT USER
// =============================================================================

export const currentUserStore = {
  get: (): User | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORE_KEYS.currentUser);
    return data ? JSON.parse(data) : null;
  },
  set: (user: User | null): void => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORE_KEYS.currentUser, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORE_KEYS.currentUser);
    }
  },
};

// =============================================================================
// INITIALIZATION
// =============================================================================

export function initializeMockData(): void {
  if (typeof window === 'undefined') return;
  
  // Only initialize if empty
  if (localStorage.getItem(STORE_KEYS.users)) return;
  
  // Import seed data
  import('./seed-data').then(({ seedDatabase }) => {
    seedDatabase();
  });
}

// =============================================================================
// CLEAR DATA (for testing)
// =============================================================================

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  
  Object.values(STORE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
