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
    icon: 'home',
  },
  '/os': {
    path: '/os',
    label: 'Experience OS',
    parent: '/',
    next: '/student',
    nextLabel: 'Student Dashboard',
    showClose: false,
    showInPalette: true,
    icon: 'monitor',
  },
  '/student': {
    path: '/student',
    label: 'Student Dashboard',
    parent: '/os',
    next: '/mission/1',
    nextLabel: 'Start Mission',
    showClose: true,
    showInPalette: true,
    icon: 'graduation-cap',
  },
  '/teacher': {
    path: '/teacher',
    label: 'Teacher Dashboard',
    parent: '/os',
    next: '/review',
    nextLabel: 'Review Submissions',
    showClose: true,
    showInPalette: true,
    icon: 'user-check',
  },
  '/parent': {
    path: '/parent',
    label: 'Parent Dashboard',
    parent: '/os',
    next: '/student',
    nextLabel: 'View Student',
    showClose: true,
    showInPalette: true,
    icon: 'users',
  },
  '/admin': {
    path: '/admin',
    label: 'Admin Panel',
    parent: '/os',
    next: '/teacher',
    nextLabel: 'Teacher View',
    showClose: true,
    showInPalette: true,
    icon: 'settings',
  },
  '/review': {
    path: '/review',
    label: 'Review Submissions',
    parent: '/teacher',
    next: '/teacher',
    nextLabel: 'Back to Dashboard',
    showClose: true,
    showInPalette: true,
    icon: 'file-edit',
  },
  '/desktop': {
    path: '/desktop',
    label: 'Desktop View',
    parent: '/os',
    next: '/os',
    nextLabel: 'OS Hub',
    showClose: true,
    showInPalette: true,
    icon: 'monitor',
  },
  // Company Pages
  '/about': {
    path: '/about',
    label: 'About',
    parent: '/',
    next: '/manifesto',
    nextLabel: 'Read Manifesto',
    showClose: true,
    showInPalette: true,
    icon: 'building-2',
  },
  '/manifesto': {
    path: '/manifesto',
    label: 'Manifesto',
    parent: '/',
    next: '/vision',
    nextLabel: 'See Vision',
    showClose: true,
    showInPalette: true,
    icon: 'scroll-text',
  },
  '/vision': {
    path: '/vision',
    label: 'Vision & Roadmap',
    parent: '/',
    next: '/os',
    nextLabel: 'Enter OS',
    showClose: true,
    showInPalette: true,
    icon: 'telescope',
  },
  '/partners': {
    path: '/partners',
    label: 'Partners',
    parent: '/',
    next: '/contact',
    nextLabel: 'Get in Touch',
    showClose: true,
    showInPalette: true,
    icon: 'handshake',
  },
  '/careers': {
    path: '/careers',
    label: 'Careers',
    parent: '/',
    next: '/contact',
    nextLabel: 'Apply Now',
    showClose: true,
    showInPalette: true,
    icon: 'briefcase',
  },
  '/contact': {
    path: '/contact',
    label: 'Contact',
    parent: '/',
    next: '/os',
    nextLabel: 'Enter OS',
    showClose: true,
    showInPalette: true,
    icon: 'mail',
  },
  '/legal': {
    path: '/legal',
    label: 'Privacy & Terms',
    parent: '/',
    next: '/',
    nextLabel: 'Home',
    showClose: true,
    showInPalette: false,
    icon: 'clipboard-list',
  },
  '/school': {
    path: '/school',
    label: 'For Schools',
    parent: '/',
    next: '/contact',
    nextLabel: 'Schedule Demo',
    showClose: true,
    showInPalette: true,
    icon: 'building-2',
  },
  // Portal Pages (Locked)
  '/experiment': {
    path: '/experiment',
    label: 'Project eXperiment',
    parent: '/os',
    next: '/student',
    nextLabel: 'Continue in eXperience',
    showClose: true,
    showInPalette: true,
    icon: 'flask-conical',
  },
  '/excel': {
    path: '/excel',
    label: 'Project eXcel',
    parent: '/os',
    next: '/experiment',
    nextLabel: 'See eXperiment',
    showClose: true,
    showInPalette: true,
    icon: 'dollar-sign',
  },
  '/expand': {
    path: '/expand',
    label: 'Project eXpand',
    parent: '/os',
    next: '/excel',
    nextLabel: 'See eXcel',
    showClose: true,
    showInPalette: true,
    icon: 'rocket',
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
      icon: 'target',
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
    icon: 'file-text',
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
  { id: 'enter-os', label: 'Enter OS', path: '/os', icon: 'monitor', shortcut: 'E' },
  { id: 'back', label: 'Go Back', action: 'back', icon: 'arrow-left', shortcut: '⌥←' },
  { id: 'home', label: 'Home', path: '/', icon: 'home', shortcut: 'H' },
  { id: 'student', label: 'Student Dashboard', path: '/student', icon: 'graduation-cap' },
  { id: 'teacher', label: 'Teacher Dashboard', path: '/teacher', icon: 'user-check' },
  { id: 'parent', label: 'Parent Dashboard', path: '/parent', icon: 'users' },
  { id: 'admin', label: 'Admin Panel', path: '/admin', icon: 'settings' },
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
