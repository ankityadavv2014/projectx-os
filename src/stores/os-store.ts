import { create } from "zustand";
import { generateId } from "@/lib/utils";

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface OSState {
  windows: WindowState[];
  activeWindowId: string | null;
  isStartMenuOpen: boolean;
  highestZIndex: number;
  
  // Actions
  openWindow: (appId: string, title: string) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  moveWindow: (windowId: string, x: number, y: number) => void;
  resizeWindow: (windowId: string, width: number, height: number) => void;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
}

const DEFAULT_WINDOW_SIZE = { width: 600, height: 400 };
const WINDOW_OFFSET = 30;

export const useOSStore = create<OSState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  isStartMenuOpen: false,
  highestZIndex: 0,

  openWindow: (appId: string, title: string) => {
    const existingWindow = get().windows.find((w) => w.appId === appId);
    
    if (existingWindow) {
      // Focus existing window
      get().focusWindow(existingWindow.id);
      if (existingWindow.isMinimized) {
        get().restoreWindow(existingWindow.id);
      }
      return;
    }

    const windowCount = get().windows.length;
    const newZIndex = get().highestZIndex + 1;
    
    const newWindow: WindowState = {
      id: generateId(),
      appId,
      title,
      x: 100 + windowCount * WINDOW_OFFSET,
      y: 100 + windowCount * WINDOW_OFFSET,
      ...DEFAULT_WINDOW_SIZE,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZIndex,
    };

    set((state) => ({
      windows: [...state.windows, newWindow],
      activeWindowId: newWindow.id,
      highestZIndex: newZIndex,
    }));
  },

  closeWindow: (windowId: string) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== windowId),
      activeWindowId: state.activeWindowId === windowId 
        ? state.windows[state.windows.length - 2]?.id || null 
        : state.activeWindowId,
    }));
  },

  focusWindow: (windowId: string) => {
    const newZIndex = get().highestZIndex + 1;
    
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, zIndex: newZIndex } : w
      ),
      activeWindowId: windowId,
      highestZIndex: newZIndex,
    }));
  },

  minimizeWindow: (windowId: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: state.activeWindowId === windowId 
        ? null 
        : state.activeWindowId,
    }));
  },

  maximizeWindow: (windowId: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, isMaximized: true } : w
      ),
    }));
  },

  restoreWindow: (windowId: string) => {
    const newZIndex = get().highestZIndex + 1;
    
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId 
          ? { ...w, isMinimized: false, isMaximized: false, zIndex: newZIndex } 
          : w
      ),
      activeWindowId: windowId,
      highestZIndex: newZIndex,
    }));
  },

  moveWindow: (windowId: string, x: number, y: number) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, x, y, isMaximized: false } : w
      ),
    }));
  },

  resizeWindow: (windowId: string, width: number, height: number) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, width, height, isMaximized: false } : w
      ),
    }));
  },

  toggleStartMenu: () => {
    set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen }));
  },

  closeStartMenu: () => {
    set({ isStartMenuOpen: false });
  },
}));
