'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import CommandPalette from '@/components/command/CommandPalette';
import ReturnToOSFab from '@/components/nav/ReturnToOSFab';
import { useKeyboardShortcuts } from '@/lib/nav/shortcuts';
import { addRecentRoute } from '@/lib/nav/routeMap';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Track route visits
  useEffect(() => {
    addRecentRoute(pathname);
  }, [pathname]);

  // Keyboard shortcuts
  useKeyboardShortcuts(() => setIsPaletteOpen(true), !isPaletteOpen);

  // Show different layouts for landing page vs app pages
  const isLandingPage = pathname === '/';

  return (
    <>
      {/* Top Navigation Bar */}
      <TopBar onOpenPalette={() => setIsPaletteOpen(true)} />

      {/* Main Content */}
      <main className={isLandingPage ? '' : 'pt-14'}>
        {children}
      </main>

      {/* Return to OS FAB */}
      <ReturnToOSFab />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />
    </>
  );
}
