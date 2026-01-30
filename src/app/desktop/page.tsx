"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOSStore, WindowState } from "@/stores/os-store";
import { useXPStore } from "@/stores/xp-store";
import { DOCK_APPS } from "@/lib/constants";
import { dockIconHover, windowOpen } from "@/lib/animations";
import { XPBar } from "@/components/xp/XPBar";
import { Orb } from "@/components/orb/Orb";
import { useEasterEggs } from "@/hooks/useEasterEggs";
import { MissionsApp } from "@/components/os/MissionsApp";
import { cn } from "@/lib/utils";

// Desktop component
export default function DesktopPage() {
  const { windows, isStartMenuOpen, openWindow, toggleStartMenu, closeStartMenu } = useOSStore();
  const { completeMission, isMissionCompleted } = useXPStore();

  // Enable easter eggs
  useEasterEggs();

  // Award XP for first OS entry
  useEffect(() => {
    if (!isMissionCompleted("os-pioneer")) {
      completeMission("os-pioneer");
    }
  }, [completeMission, isMissionCompleted]);

  return (
    <div className="fixed inset-0 bg-[var(--deep-space)] overflow-hidden">
      {/* Animated wallpaper */}
      <Wallpaper />

      {/* Desktop icons */}
      <DesktopIcons />

      {/* Windows */}
      <AnimatePresence>
        {windows
          .filter((w) => !w.isMinimized)
          .map((window) => (
            <Window key={window.id} window={window} />
          ))}
      </AnimatePresence>

      {/* Start Menu */}
      <AnimatePresence>
        {isStartMenuOpen && <StartMenu onClose={closeStartMenu} />}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar />

      {/* Dock */}
      <Dock />

      {/* XP Bar */}
      <div className="fixed top-4 right-4 z-40">
        <XPBar />
      </div>

      {/* AI Orb Assistant */}
      <Orb />
    </div>
  );
}

// Wallpaper with animated gradient
function Wallpaper() {
  return (
    <div className="absolute inset-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--deep-space)] via-[var(--dark-gray)] to-[var(--deep-space)]" />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--molten-orange)]/5 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--neon-blue)]/5 blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}

// Desktop Icons
function DesktopIcons() {
  const { openWindow } = useOSStore();

  const icons = [
    { id: "about", name: "About", icon: "📄", x: 0, y: 0 },
    { id: "projects", name: "Projects", icon: "🚀", x: 0, y: 1 },
    { id: "missions", name: "Missions", icon: "⚔️", x: 0, y: 2 },
    { id: "terminal", name: "Terminal", icon: "💻", x: 0, y: 3 },
  ];

  return (
    <div className="absolute top-4 left-4 grid gap-4">
      {icons.map((icon) => (
        <motion.button
          key={icon.id}
          className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-white/10 transition-colors w-20"
          onDoubleClick={() => openWindow(icon.id, icon.name)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-4xl">{icon.icon}</span>
          <span className="text-xs text-white/80 truncate w-full text-center">{icon.name}</span>
        </motion.button>
      ))}
    </div>
  );
}

// Window component
function Window({ window }: { window: WindowState }) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow } = useOSStore();

  return (
    <motion.div
      variants={windowOpen}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        "absolute rounded-xl overflow-hidden shadow-2xl",
        "border border-white/10 bg-[var(--dark-gray)]",
        window.isMaximized && "!inset-0 !w-full !h-full !rounded-none"
      )}
      style={{
        left: window.isMaximized ? 0 : window.x,
        top: window.isMaximized ? 0 : window.y,
        width: window.isMaximized ? "100%" : window.width,
        height: window.isMaximized ? "100%" : window.height,
        zIndex: window.zIndex,
      }}
      onMouseDown={() => focusWindow(window.id)}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--deep-space)] cursor-move">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button
              onClick={() => closeWindow(window.id)}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
            />
            <button
              onClick={() => minimizeWindow(window.id)}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
            />
            <button
              onClick={() => maximizeWindow(window.id)}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
            />
          </div>
          <span className="text-sm font-medium text-white/80 ml-2">{window.title}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 h-[calc(100%-48px)] overflow-auto">
        <WindowContent appId={window.appId} />
      </div>
    </motion.div>
  );
}

// Window content based on app
function WindowContent({ appId }: { appId: string }) {
  switch (appId) {
    case "about":
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--molten-orange)]">About ProjectX OS</h2>
          <p className="text-[var(--light-gray)]">
            ProjectX OS is an immersive experience platform designed to upgrade human potential.
          </p>
          <p className="text-[var(--light-gray)]/70">
            Version 1.0.0 • Built with Next.js, TypeScript, and 🔥
          </p>
        </div>
      );
    case "projects":
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--neon-blue)]">Projects</h2>
          <p className="text-[var(--light-gray)]">
            Explore our portfolio of human-centric innovations.
          </p>
          <div className="grid gap-4 mt-4">
            {["Project Alpha", "Project Beta", "Project Gamma"].map((project) => (
              <div key={project} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                <h3 className="font-medium text-white">{project}</h3>
                <p className="text-sm text-[var(--light-gray)]/60">Coming soon...</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "terminal":
      return (
        <div className="font-mono text-sm">
          <div className="text-[var(--matrix-green)]">ProjectX OS Terminal v1.0.0</div>
          <div className="text-[var(--light-gray)]/60 mb-4">Type &apos;help&apos; for available commands.</div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--molten-orange)]">→</span>
            <span className="text-white">_</span>
          </div>
        </div>
      );
    case "missions":
      return <MissionsApp />;
    default:
      return (
        <div className="text-center text-[var(--light-gray)]/60">
          Content coming soon...
        </div>
      );
  }
}

// Dock
function Dock() {
  const { openWindow, windows } = useOSStore();

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-end gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
        {DOCK_APPS.map((app) => {
          const isOpen = windows.some((w) => w.appId === app.id);
          
          return (
            <motion.button
              key={app.id}
              variants={dockIconHover}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onClick={() => openWindow(app.id, app.name)}
              className="relative flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--dark-gray)] flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-shadow">
                {app.icon}
              </div>
              {isOpen && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white" />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// Taskbar (minimal version)
function Taskbar() {
  const { toggleStartMenu } = useOSStore();

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2 bg-[var(--deep-space)]/80 backdrop-blur-sm border-b border-white/10">
      {/* Start button */}
      <button
        onClick={toggleStartMenu}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
      >
        <span className="text-lg">🔥</span>
        <span className="text-sm font-medium text-white">ProjectX</span>
      </button>

      {/* Clock */}
      <div className="text-sm text-white/60 font-mono">
        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}

// Start Menu
function StartMenu({ onClose }: { onClose: () => void }) {
  const { openWindow } = useOSStore();

  const handleAppClick = (appId: string, name: string) => {
    openWindow(appId, name);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed top-14 left-4 z-50 w-72 p-4 rounded-xl bg-[var(--dark-gray)] border border-white/10 shadow-2xl"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--neon-blue)]"
          />
        </div>

        <div className="space-y-1">
          {DOCK_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id, app.name)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
            >
              <span className="text-xl">{app.icon}</span>
              <span className="text-sm text-white">{app.name}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}
