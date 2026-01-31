/**
 * Keyboard Shortcuts for ProjectX OS Navigation
 * Global shortcuts for navigating the OS
 */

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

// Hook to manage keyboard shortcuts
export function useKeyboardShortcuts(
  onOpenPalette: () => void,
  enabled: boolean = true
) {
  const router = useRouter();
  const pathname = usePathname();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Esc → Return to OS (unless on home or OS)
      if (event.key === 'Escape' && pathname !== '/' && pathname !== '/os') {
        event.preventDefault();
        router.push('/os');
        return;
      }

      // Cmd/Ctrl + K → Open command palette
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        onOpenPalette();
        return;
      }

      // Alt + ArrowLeft → Go back
      if (event.altKey && event.key === 'ArrowLeft') {
        event.preventDefault();
        router.back();
        return;
      }

      // E key → Enter OS (from landing page)
      if (event.key === 'e' || event.key === 'E') {
        if (pathname === '/') {
          event.preventDefault();
          router.push('/os');
          return;
        }
      }

      // H key → Home
      if (event.key === 'h' || event.key === 'H') {
        if (!event.metaKey && !event.ctrlKey) {
          event.preventDefault();
          router.push('/');
          return;
        }
      }
    },
    [router, pathname, onOpenPalette, enabled]
  );

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Still enable shortcuts, but could disable animations if needed
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

// Shortcut display helpers
export const SHORTCUT_LABELS: Record<string, { key: string; display: string }> = {
  escape: { key: 'Escape', display: 'Esc' },
  cmdK: { key: 'Cmd/Ctrl+K', display: '⌘K' },
  altLeft: { key: 'Alt+←', display: '⌥←' },
  enter: { key: 'E', display: 'E' },
  home: { key: 'H', display: 'H' },
};

// Get platform-specific modifier key
export function getModifierKey(): 'Cmd' | 'Ctrl' {
  if (typeof window === 'undefined') return 'Cmd';
  return navigator.platform.toLowerCase().includes('mac') ? 'Cmd' : 'Ctrl';
}

// Format shortcut for display
export function formatShortcut(shortcut: string): string {
  const isMac = getModifierKey() === 'Cmd';
  return shortcut
    .replace('Cmd/Ctrl', isMac ? '⌘' : 'Ctrl')
    .replace('Alt', isMac ? '⌥' : 'Alt')
    .replace('Shift', isMac ? '⇧' : 'Shift');
}
