"use client";

import { motion } from "framer-motion";
import { useXPStore } from "@/stores/xp-store";
import { XP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MissionDef {
  id: string;
  name: string;
  description: string;
  xp: number;
  icon: string;
  category: string;
}

interface MissionsAppProps {
  className?: string;
}

export function MissionsApp({ className }: MissionsAppProps) {
  const { xp, missions: completedMissionsList, isMissionCompleted, getLevel } = useXPStore();
  const level = getLevel();
  const completedCount = completedMissionsList.filter(m => m.completed).length;

  // All available missions
  const missionDefinitions: MissionDef[] = [
    {
      id: "first-visit",
      name: "First Contact",
      description: "Visit ProjectX OS for the first time",
      xp: XP_CONFIG.actions.visitSection,
      icon: "👁️",
      category: "Onboarding",
    },
    {
      id: "scroll-manifesto",
      name: "The Awakening",
      description: "Read the ProjectX Manifesto",
      xp: XP_CONFIG.actions.visitSection,
      icon: "📜",
      category: "Onboarding",
    },
    {
      id: "watch-trailer",
      name: "Witness The Vision",
      description: "Watch the ProjectX trailer",
      xp: XP_CONFIG.actions.watchTrailer,
      icon: "🎬",
      category: "Onboarding",
    },
    {
      id: "os-pioneer",
      name: "Pioneer",
      description: "Enter the ProjectX OS for the first time",
      xp: XP_CONFIG.actions.enterOSMode,
      icon: "🚀",
      category: "Explorer",
    },
    {
      id: "window-master",
      name: "Window Master",
      description: "Open 3 different applications",
      xp: 75,
      icon: "🪟",
      category: "Explorer",
    },
    {
      id: "konami-discoverer",
      name: "Secret Seeker",
      description: "Discover a hidden easter egg",
      xp: XP_CONFIG.actions.discoverEasterEgg,
      icon: "🎮",
      category: "Secret",
    },
    {
      id: "orb-conversation",
      name: "The Orb Whispers",
      description: "Have your first conversation with the AI Orb",
      xp: 100,
      icon: "🔮",
      category: "AI",
    },
    {
      id: "level-up",
      name: "Ascension",
      description: "Reach Level 2",
      xp: 200,
      icon: "⬆️",
      category: "Progress",
    },
    {
      id: "share-link",
      name: "Ambassador",
      description: "Share ProjectX with others",
      xp: 75,
      icon: "🔗",
      category: "Social",
    },
    {
      id: "night-explorer",
      name: "Night Owl",
      description: "Visit ProjectX after midnight",
      xp: 50,
      icon: "🦉",
      category: "Secret",
    },
  ];

  const categories = ["Onboarding", "Explorer", "AI", "Progress", "Social", "Secret"];

  return (
    <div className={cn("h-full flex flex-col bg-[var(--deep-space)]/95 text-white", className)}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold mb-2">
          <span className="text-[var(--molten-orange)]">⚔️</span> Missions
        </h2>
        <p className="text-gray-400 text-sm">
          Complete missions to earn XP and unlock achievements
        </p>
        
        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <div className="bg-white/5 rounded-lg px-4 py-2">
            <div className="text-sm text-gray-400">Total XP</div>
            <div className="text-xl font-bold text-[var(--sacred-gold)]">{xp}</div>
          </div>
          <div className="bg-white/5 rounded-lg px-4 py-2">
            <div className="text-sm text-gray-400">Level</div>
            <div className="text-xl font-bold text-[var(--neon-blue)]">{level}</div>
          </div>
          <div className="bg-white/5 rounded-lg px-4 py-2">
            <div className="text-sm text-gray-400">Completed</div>
            <div className="text-xl font-bold text-[var(--molten-orange)]">
              {completedCount}/{missionDefinitions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Missions List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {categories.map((category) => {
          const categoryMissions = missionDefinitions.filter((m) => m.category === category);
          if (categoryMissions.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {categoryMissions.map((mission) => {
                  const completed = isMissionCompleted(mission.id);

                  return (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "relative p-4 rounded-lg border transition-all",
                        completed
                          ? "bg-[var(--sacred-gold)]/10 border-[var(--sacred-gold)]/30"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center text-2xl",
                            completed
                              ? "bg-[var(--sacred-gold)]/20"
                              : "bg-white/10"
                          )}
                        >
                          {mission.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4
                              className={cn(
                                "font-semibold",
                                completed && "text-[var(--sacred-gold)]"
                              )}
                            >
                              {mission.name}
                            </h4>
                            {completed && (
                              <span className="text-xs bg-[var(--sacred-gold)]/20 text-[var(--sacred-gold)] px-2 py-0.5 rounded-full">
                                ✓ Completed
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            {mission.description}
                          </p>
                        </div>

                        {/* XP Reward */}
                        <div
                          className={cn(
                            "text-right",
                            completed ? "text-[var(--sacred-gold)]" : "text-gray-400"
                          )}
                        >
                          <div className="text-lg font-bold">+{mission.xp}</div>
                          <div className="text-xs">XP</div>
                        </div>
                      </div>

                      {/* Progress indicator for locked missions */}
                      {!completed && mission.category === "Secret" && (
                        <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                          <span>🔒</span> Hidden mission - discover to unlock
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-center text-sm text-gray-500">
        More missions coming soon... 🚀
      </div>
    </div>
  );
}
