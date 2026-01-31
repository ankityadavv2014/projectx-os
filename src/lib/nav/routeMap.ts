/**
 * Route Map for ProjectX OS Navigation
 * Defines navigation relationships for every route
 */

export interface RouteConfig {
  path: string;
  label: string;
  parent: string | null;
  next: string | null;
  nextLabel?: string;
  showClose: boolean;
  showInPalette: boolean;
  icon?: string;
}

export const ROUTE_MAP: Record<string, RouteConfig> = {
  '/': {
    path: '/',
    label: 'Home',
    parent: null,
    next: '/os',
    nextLabel: 'Enter OS',
    showClose: false,
    showInPalette: true,
    icon: '🏠',
  },
  '/os': {
    path: '/os',
    label: 'Experience OS',
    parent: '/',
    next: '/student',
    nextLabel: 'Student Dashboard',
    showClose: false,
    showInPalette: true,
    icon: '🖥️',
  },
  '/student': {
    path: '/student',
    label: 'Student Dashboard',
    parent: '/os',
    next: '/mission/1',
    nextLabel: 'Start Mission',
    showClose: true,
    showInPalette: true,
    icon: '🎓',
  },
  '/teacher': {
    path: '/teacher',
    label: 'Teacher Dashboard',
    parent: '/os',
    next: '/review',
    nextLabel: 'Review Submissions',
    showClose: true,
    showInPalette: true,
    icon: '👨‍🏫',
  },
  '/parent': {
    path: '/parent',
    label: 'Parent Dashboard',
    parent: '/os',
    next: '/student',
    nextLabel: 'View Student',
    showClose: true,
    showInPalette: true,
    icon: '👨‍👩‍👧',
  },
  '/admin': {
    path: '/admin',
    label: 'Admin Panel',
    parent: '/os',
    next: '/teacher',
    nextLabel: 'Teacher View',
    showClose: true,
    showInPalette: true,
    icon: '⚙️',
  },
  '/review': {
    path: '/review',
    label: 'Review Submissions',
    parent: '/teacher',
    next: '/teacher',
    nextLabel: 'Back to Dashboard',
    showClose: true,
    showInPalette: true,
    icon: '📝',
  },
  '/desktop': {
    path: '/desktop',
    label: 'Desktop View',
    parent: '/os',
    next: '/os',
    nextLabel: 'OS Hub',
    showClose: true,
    showInPalette: true,
    icon: '🖥️',
  },
};

// Dynamic route pattern matching
export function getRouteConfig(pathname: string): RouteConfig {
  // Check for exact match first
  if (ROUTE_MAP[pathname]) {
    return ROUTE_MAP[pathname];
  }

  // Handle dynamic routes like /mission/[id]
  if (pathname.startsWith('/mission/')) {
    const missionId = pathname.split('/')[2];
    return {
      path: pathname,
      label: `Mission ${missionId}`,
      parent: '/student',
      next: '/student',
      nextLabel: 'Back to Dashboard',
      showClose: true,
      showInPalette: false,
      icon: '🎯',
    };
  }

  // Default fallback - never a dead end
  return {
    path: pathname,
    label: 'Page',
    parent: '/os',
    next: '/os',
    nextLabel: 'Return to OS',
    showClose: true,
    showInPalette: false,
    icon: '📄',
  };
}

// Get breadcrumb trail for a route
export function getBreadcrumbs(pathname: string): RouteConfig[] {
  const crumbs: RouteConfig[] = [];
  let current = getRouteConfig(pathname);
  
  // Build breadcrumb trail from current to root
  while (current) {
    crumbs.unshift(current);
    if (current.parent) {
      current = getRouteConfig(current.parent);
    } else {
      break;
    }
  }
  
  return crumbs;
}

// Quick actions for command palette
export const QUICK_ACTIONS = [
  { id: 'enter-os', label: 'Enter OS', path: '/os', icon: '🖥️', shortcut: 'E' },
  { id: 'back', label: 'Go Back', action: 'back', icon: '←', shortcut: '⌥←' },
  { id: 'home', label: 'Home', path: '/', icon: '🏠', shortcut: 'H' },
  { id: 'student', label: 'Student Dashboard', path: '/student', icon: '🎓' },
  { id: 'teacher', label: 'Teacher Dashboard', path: '/teacher', icon: '👨‍🏫' },
  { id: 'parent', label: 'Parent Dashboard', path: '/parent', icon: '👨‍👩‍👧' },
  { id: 'admin', label: 'Admin Panel', path: '/admin', icon: '⚙️' },
];

// Recent routes storage key
export const RECENT_ROUTES_KEY = 'projectx-recent-routes';
export const MAX_RECENT_ROUTES = 5;

export function getRecentRoutes(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_ROUTES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentRoute(path: string): void {
  if (typeof window === 'undefined') return;
  try {
    const recent = getRecentRoutes().filter(r => r !== path);
    recent.unshift(path);
    localStorage.setItem(
      RECENT_ROUTES_KEY,
      JSON.stringify(recent.slice(0, MAX_RECENT_ROUTES))
    );
  } catch {
    // Ignore storage errors
  }
}
