import { create } from "zustand";
import { persist } from "zustand/middleware";
import { calculateLevel, calculateXPProgress, getLevelTier } from "@/lib/utils";
import { STORAGE_KEYS, XP_CONFIG } from "@/lib/constants";

interface Mission {
  id: string;
  completed: boolean;
  completedAt?: number;
}

interface XPState {
  xp: number;
  missions: Mission[];
  visitedSections: string[];
  easterEggsFound: string[];
  
  // Computed (derived from xp)
  getLevel: () => number;
  getProgress: () => { current: number; required: number; percentage: number };
  getTier: () => string;
  
  // Actions
  addXP: (amount: number) => void;
  completeMission: (missionId: string) => void;
  isMissionCompleted: (missionId: string) => boolean;
  visitSection: (sectionId: string) => void;
  hasVisitedSection: (sectionId: string) => boolean;
  findEasterEgg: (eggId: string) => void;
  hasFoundEasterEgg: (eggId: string) => boolean;
  resetProgress: () => void;
}

const initialState = {
  xp: 0,
  missions: [] as Mission[],
  visitedSections: [] as string[],
  easterEggsFound: [] as string[],
};

export const useXPStore = create<XPState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Computed getters
      getLevel: () => calculateLevel(get().xp),
      getProgress: () => calculateXPProgress(get().xp),
      getTier: () => getLevelTier(calculateLevel(get().xp)),

      // Actions
      addXP: (amount: number) => {
        const currentLevel = calculateLevel(get().xp);
        set((state) => ({ xp: state.xp + amount }));
        const newLevel = calculateLevel(get().xp);
        
        // Check for level up
        if (newLevel > currentLevel) {
          // Could trigger a celebration animation here
          console.log(`🎉 Level up! Now level ${newLevel}`);
        }
      },

      completeMission: (missionId: string) => {
        const state = get();
        if (state.missions.some((m) => m.id === missionId && m.completed)) {
          return; // Already completed
        }

        set((state) => ({
          missions: [
            ...state.missions.filter((m) => m.id !== missionId),
            { id: missionId, completed: true, completedAt: Date.now() },
          ],
        }));

        // Award XP based on mission
        const missionXP = XP_CONFIG.actions[missionId as keyof typeof XP_CONFIG.actions];
        if (missionXP) {
          get().addXP(missionXP);
        }
      },

      isMissionCompleted: (missionId: string) => {
        return get().missions.some((m) => m.id === missionId && m.completed);
      },

      visitSection: (sectionId: string) => {
        const state = get();
        if (state.visitedSections.includes(sectionId)) {
          return; // Already visited
        }

        set((state) => ({
          visitedSections: [...state.visitedSections, sectionId],
        }));

        // Award XP for visiting new section
        get().addXP(XP_CONFIG.actions.visitSection);
      },

      hasVisitedSection: (sectionId: string) => {
        return get().visitedSections.includes(sectionId);
      },

      findEasterEgg: (eggId: string) => {
        const state = get();
        if (state.easterEggsFound.includes(eggId)) {
          return; // Already found
        }

        set((state) => ({
          easterEggsFound: [...state.easterEggsFound, eggId],
        }));

        // Award XP for finding easter egg
        get().addXP(XP_CONFIG.actions.discoverEasterEgg);
        
        // Complete secret finder mission if first egg
        if (get().easterEggsFound.length === 1) {
          get().completeMission("secret-finder");
        }
      },

      hasFoundEasterEgg: (eggId: string) => {
        return get().easterEggsFound.includes(eggId);
      },

      resetProgress: () => {
        set(initialState);
      },
    }),
    {
      name: STORAGE_KEYS.xp,
      partialize: (state) => ({
        xp: state.xp,
        missions: state.missions,
        visitedSections: state.visitedSections,
        easterEggsFound: state.easterEggsFound,
      }),
    }
  )
);
