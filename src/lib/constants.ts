/**
 * Brand and design system constants
 */

// Colors
export const COLORS = {
  deepSpace: "#0a0a0f",
  moltenOrange: "#ff6b35",
  neonBlue: "#00d4ff",
  sacredGold: "#ffd700",
  matrixGreen: "#00ff41",
  cosmicPurple: "#9d4edd",
  darkGray: "#1a1a2e",
  mediumGray: "#2d2d44",
  lightGray: "#e0e0e0",
} as const;

// Brand
export const BRAND = {
  name: "ProjectX OS",
  tagline: "The Human Upgrade",
  manifesto: "In the Age of Machines, We Build Humans",
  author: "ProjectX Team",
} as const;

// XP System
export const XP_CONFIG = {
  actions: {
    visitSection: 25,
    watchTrailer: 75,
    enterOSMode: 150,
    discoverEasterEgg: 200,
    completeExplorer: 100,
    completeOSPioneer: 150,
    completeSecretFinder: 200,
  },
  levelMultiplier: 100, // XP per level = level * multiplier
  maxLevel: 99,
} as const;

// Missions
export const MISSIONS = [
  {
    id: "explorer",
    title: "Explorer",
    description: "Visit all sections of the landing page",
    xpReward: 100,
    icon: "🧭",
  },
  {
    id: "trailer-watcher",
    title: "Trailer Watcher",
    description: "Watch the complete trailer",
    xpReward: 75,
    icon: "🎬",
  },
  {
    id: "os-pioneer",
    title: "OS Pioneer",
    description: "Enter OS Mode for the first time",
    xpReward: 150,
    icon: "🖥️",
  },
  {
    id: "secret-finder",
    title: "Secret Finder",
    description: "Discover a hidden easter egg",
    xpReward: 200,
    icon: "🔮",
  },
] as const;

// Easter Eggs
export const EASTER_EGGS = {
  konamiCode: ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"],
  logoClicks: 7,
  secretPhrases: ["wake up neo", "follow the white rabbit", "there is no spoon"],
} as const;

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
} as const;

// Dock Apps (for OS Mode)
export const DOCK_APPS = [
  { id: "about", name: "About", icon: "📄" },
  { id: "projects", name: "Projects", icon: "🚀" },
  { id: "missions", name: "Missions", icon: "⚔️" },
  { id: "services", name: "Services", icon: "⚙️" },
  { id: "contact", name: "Contact", icon: "📧" },
  { id: "terminal", name: "Terminal", icon: "💻" },
  { id: "settings", name: "Settings", icon: "🔧" },
] as const;

// Keyboard shortcuts
export const SHORTCUTS = {
  openOrb: ["Meta", "KeyK"],
  closeWindow: ["Escape"],
  toggleStartMenu: ["Meta"],
} as const;

// Storage keys
export const STORAGE_KEYS = {
  xp: "projectx-xp",
  missions: "projectx-missions",
  settings: "projectx-settings",
  visited: "projectx-visited",
} as const;

// API endpoints (future)
export const API = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
} as const;
