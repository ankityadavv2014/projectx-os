'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ROUTE_MAP,
  QUICK_ACTIONS,
  getRecentRoutes,
  addRecentRoute,
  getRouteConfig,
} from '@/lib/nav/routeMap';
import { formatShortcut } from '@/lib/nav/shortcuts';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  action?: string;
  shortcut?: string;
  category: 'recent' | 'quick' | 'routes';
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build command list
  const getCommands = useCallback((): CommandItem[] => {
    const commands: CommandItem[] = [];

    // Add recent routes
    const recentPaths = getRecentRoutes();
    if (recentPaths.length > 0 && !query) {
      recentPaths.forEach((path) => {
        const config = getRouteConfig(path);
        commands.push({
          id: `recent-${path}`,
          label: config.label,
          icon: config.icon,
          path: config.path,
          category: 'recent',
        });
      });
    }

    // Add quick actions
    QUICK_ACTIONS.forEach((action) => {
      commands.push({
        id: action.id,
        label: action.label,
        icon: action.icon,
        path: action.path,
        action: action.action,
        shortcut: action.shortcut,
        category: 'quick',
      });
    });

    // Add all routes from map
    Object.values(ROUTE_MAP)
      .filter((route) => route.showInPalette)
      .forEach((route) => {
        // Avoid duplicates with quick actions
        if (!commands.some((c) => c.path === route.path)) {
          commands.push({
            id: `route-${route.path}`,
            label: route.label,
            icon: route.icon,
            path: route.path,
            category: 'routes',
          });
        }
      });

    // Filter by query
    if (query) {
      return commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
      );
    }

    return commands;
  }, [query]);

  const commands = getCommands();

  // Reset selection when commands change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, commands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (commands[selectedIndex]) {
            executeCommand(commands[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, commands, selectedIndex, onClose]);

  const executeCommand = (cmd: CommandItem) => {
    if (cmd.action === 'back') {
      router.back();
    } else if (cmd.path) {
      addRecentRoute(cmd.path);
      router.push(cmd.path);
    }
    onClose();
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'recent':
        return 'Recent';
      case 'quick':
        return 'Quick Actions';
      case 'routes':
        return 'Navigate';
      default:
        return '';
    }
  };

  // Group commands by category
  const groupedCommands = commands.reduce(
    (acc, cmd) => {
      if (!acc[cmd.category]) acc[cmd.category] = [];
      acc[cmd.category].push(cmd);
      return acc;
    },
    {} as Record<string, CommandItem[]>
  );

  let flatIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-lg"
          >
            <div className="mx-4 bg-[var(--deep-space)] border border-white/20 rounded-xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <svg
                  className="w-5 h-5 text-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-sm"
                />
                <kbd className="hidden sm:block px-2 py-0.5 rounded bg-white/10 text-white/40 text-xs">
                  esc
                </kbd>
              </div>

              {/* Command List */}
              <div className="max-h-80 overflow-y-auto py-2">
                {commands.length === 0 ? (
                  <div className="px-4 py-8 text-center text-white/40 text-sm">
                    No results found
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(([category, items]) => (
                    <div key={category}>
                      <div className="px-4 py-1.5 text-xs text-white/40 uppercase tracking-wider">
                        {getCategoryLabel(category)}
                      </div>
                      {items.map((cmd) => {
                        const currentIndex = flatIndex++;
                        const isSelected = currentIndex === selectedIndex;

                        return (
                          <button
                            key={cmd.id}
                            onClick={() => executeCommand(cmd)}
                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                            className={`
                              w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                              ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}
                            `}
                          >
                            {cmd.icon && (
                              <span className="text-lg">{cmd.icon}</span>
                            )}
                            <span
                              className={`flex-1 text-sm ${isSelected ? 'text-white' : 'text-white/70'}`}
                            >
                              {cmd.label}
                            </span>
                            {cmd.shortcut && (
                              <kbd className="px-2 py-0.5 rounded bg-white/10 text-white/40 text-xs">
                                {formatShortcut(cmd.shortcut)}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 text-xs text-white/40">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10">↑</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10">↓</kbd>
                    <span className="ml-1">navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10">↵</kbd>
                    <span className="ml-1">select</span>
                  </span>
                </div>
                <span>ProjectX OS</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
