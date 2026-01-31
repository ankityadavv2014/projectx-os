'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { getRouteConfig, getBreadcrumbs } from '@/lib/nav/routeMap';
import { formatShortcut } from '@/lib/nav/shortcuts';

interface TopBarProps {
  onOpenPalette: () => void;
}

export default function TopBar({ onOpenPalette }: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const routeConfig = getRouteConfig(pathname);
  const breadcrumbs = getBreadcrumbs(pathname);

  // Don't show TopBar on landing page
  if (pathname === '/') {
    return null;
  }

  const handleBack = () => {
    if (routeConfig.parent) {
      router.push(routeConfig.parent);
    } else {
      router.back();
    }
  };

  const handleClose = () => {
    router.push('/os');
  };

  const handleNext = () => {
    if (routeConfig.next) {
      router.push(routeConfig.next);
    }
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 h-14 bg-[var(--deep-space)]/90 backdrop-blur-md border-b border-white/10"
    >
      <nav className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left: Logo + Breadcrumbs */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--molten-orange)] to-[var(--sacred-gold)] flex items-center justify-center">
              <span className="text-sm font-bold text-[var(--deep-space)]">X</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-white/80">
              ProjectX
            </span>
          </Link>

          {/* Breadcrumbs */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && (
                  <span className="text-white/30">/</span>
                )}
                <Link
                  href={crumb.path}
                  className={`
                    transition-colors
                    ${crumb.path === pathname 
                      ? 'text-white font-medium' 
                      : 'text-white/50 hover:text-white/80'
                    }
                  `}
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Center: Current Page (Mobile) */}
        <div className="md:hidden text-sm font-medium text-white truncate max-w-[120px]">
          {routeConfig.label}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Back Button */}
          {routeConfig.parent && (
            <button
              onClick={handleBack}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
              title={`Back (${formatShortcut('Alt+←')})`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {routeConfig.next && routeConfig.next !== pathname && (
            <button
              onClick={handleNext}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all"
              title={routeConfig.nextLabel}
            >
              <span>{routeConfig.nextLabel}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Command Palette Button */}
          <button
            onClick={onOpenPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            title={`Command Palette (${formatShortcut('Cmd/Ctrl+K')})`}
          >
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:block text-xs text-white/40">
              {formatShortcut('Cmd/Ctrl+K')}
            </span>
          </button>

          {/* Close Button */}
          {routeConfig.showClose && pathname !== '/os' && (
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-white/60 hover:text-[var(--molten-orange)] hover:bg-white/10 transition-all"
              title={`Return to OS (${formatShortcut('Escape')})`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
