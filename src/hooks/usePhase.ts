"use client";

import { useMemo } from "react";
import type { Phase, PhaseRequirement } from "@/lib/domain/types";
import { useCurrentUser } from "./useUser";

// =============================================================================
// PHASE REQUIREMENTS
// =============================================================================

const PHASE_REQUIREMENTS: Record<Phase, PhaseRequirement[]> = {
  experience: [
    {
      id: "exp_missions",
      label: "Complete 5 Learning Missions",
      description: "Complete foundational missions to understand how ProjectX works",
      type: "missions",
      target: 5,
    },
    {
      id: "exp_artifacts",
      label: "Submit 3 Artifacts",
      description: "Share your creative work through photos, videos, or documents",
      type: "artifacts",
      target: 3,
    },
    {
      id: "exp_reflection",
      label: "Write 2 Reflections",
      description: "Reflect on your learning journey",
      type: "reflection",
      target: 2,
    },
  ],
  experiment: [
    {
      id: "expm_projects",
      label: "Complete 3 Projects",
      description: "Work on self-directed projects to apply your skills",
      type: "projects",
      target: 3,
    },
    {
      id: "expm_team",
      label: "Participate in 2 Team Projects",
      description: "Collaborate with peers on team challenges",
      type: "team",
      target: 2,
    },
    {
      id: "expm_badge",
      label: "Earn Your First Skill Badge",
      description: "Demonstrate mastery in a specific skill area",
      type: "badge",
      target: 1,
    },
    {
      id: "expm_sessions",
      label: "Attend 10 Sessions",
      description: "Consistent participation builds habits",
      type: "sessions",
      target: 10,
    },
  ],
  excel: [
    {
      id: "exc_trust",
      label: "Reach Trust Score of 80",
      description: "Build trust through consistent quality work",
      type: "trust",
      target: 80,
    },
    {
      id: "exc_mentorship",
      label: "Mentor 3 Peers",
      description: "Help others succeed on their journey",
      type: "mentorship",
      target: 3,
    },
    {
      id: "exc_assessment",
      label: "Pass a Skill Assessment",
      description: "Validate your expertise through formal assessment",
      type: "assessment",
      target: 1,
    },
    {
      id: "exc_opportunity",
      label: "Complete a Real-World Opportunity",
      description: "Apply your skills in a real context",
      type: "opportunity",
      target: 1,
    },
  ],
  expand: [
    {
      id: "expd_partner",
      label: "Receive Partner Review",
      description: "Get feedback from industry partners",
      type: "partner_review",
      target: 1,
    },
    {
      id: "expd_initiative",
      label: "Launch Your Own Initiative",
      description: "Create something new that impacts others",
      type: "initiative",
      target: 1,
    },
    {
      id: "expd_opportunities",
      label: "Complete 3 Earning Opportunities",
      description: "Successfully deliver on paid opportunities",
      type: "opportunity",
      target: 3,
    },
  ],
};

// =============================================================================
// USE PHASE
// =============================================================================

interface UsePhaseReturn {
  currentPhase: Phase;
  phaseIndex: number;
  requirements: PhaseRequirement[];
  completedRequirements: string[];
  progress: number;
  isPhaseComplete: boolean;
  canUnlockNextPhase: boolean;
  nextPhase: Phase | null;
  allPhases: Phase[];
  getPhaseLabel: (phase: Phase) => string;
  getPhaseIcon: (phase: Phase) => string;
  getPhaseColor: (phase: Phase) => string;
}

const PHASES: Phase[] = ["experience", "experiment", "excel", "expand"];

const PHASE_LABELS: Record<Phase, string> = {
  experience: "Experience",
  experiment: "Experiment",
  excel: "Excel",
  expand: "Expand",
};

const PHASE_ICONS: Record<Phase, string> = {
  experience: "🌱",
  experiment: "🧪",
  excel: "⚡",
  expand: "🚀",
};

const PHASE_COLORS: Record<Phase, string> = {
  experience: "#3B82F6", // blue
  experiment: "#8B5CF6", // purple
  excel: "#F59E0B", // gold
  expand: "#FF6B35", // orange
};

export function usePhase(): UsePhaseReturn {
  const { user } = useCurrentUser();
  
  const currentPhase = user?.currentPhase || "experience";
  const phaseIndex = PHASES.indexOf(currentPhase);
  const phaseProgress = user?.phaseProgress;
  
  const requirements = useMemo(() => {
    const reqs = PHASE_REQUIREMENTS[currentPhase] || [];
    
    // Merge with user's progress data if available
    if (phaseProgress?.requirements) {
      return phaseProgress.requirements.map(req => ({
        ...req,
        current: req.current || 0,
        completed: req.completed || false,
      }));
    }
    
    return reqs.map(req => ({
      ...req,
      current: 0,
      completed: false,
    }));
  }, [currentPhase, phaseProgress]);

  const completedRequirements = useMemo(() => 
    phaseProgress?.completedRequirements || [],
    [phaseProgress]
  );

  const progress = useMemo(() => {
    if (requirements.length === 0) return 0;
    const completed = requirements.filter(r => r.completed).length;
    return (completed / requirements.length) * 100;
  }, [requirements]);

  const isPhaseComplete = progress === 100;
  
  const nextPhase = phaseIndex < PHASES.length - 1 ? PHASES[phaseIndex + 1] : null;
  
  const canUnlockNextPhase = isPhaseComplete && nextPhase !== null;

  const getPhaseLabel = (phase: Phase) => PHASE_LABELS[phase];
  const getPhaseIcon = (phase: Phase) => PHASE_ICONS[phase];
  const getPhaseColor = (phase: Phase) => PHASE_COLORS[phase];

  return {
    currentPhase,
    phaseIndex,
    requirements,
    completedRequirements,
    progress,
    isPhaseComplete,
    canUnlockNextPhase,
    nextPhase,
    allPhases: PHASES,
    getPhaseLabel,
    getPhaseIcon,
    getPhaseColor,
  };
}

// =============================================================================
// USE PHASE UNLOCK
// =============================================================================

interface UsePhaseUnlockReturn {
  unlockNextPhase: () => boolean;
  isUnlocking: boolean;
}

export function usePhaseUnlock(): UsePhaseUnlockReturn {
  const { user, updateProfile } = useCurrentUser();
  const { canUnlockNextPhase, nextPhase, currentPhase } = usePhase();

  const unlockNextPhase = () => {
    if (!user || !canUnlockNextPhase || !nextPhase) return false;

    const now = new Date().toISOString();
    
    const currentPhaseUnlocks = user.phaseProgress?.phaseUnlockedAt || {
      experience: now,
      experiment: null,
      excel: null,
      expand: null,
    };
    
    updateProfile({
      currentPhase: nextPhase,
      phaseProgress: {
        ...user.phaseProgress!,
        currentPhase: nextPhase,
        phaseUnlockedAt: {
          ...currentPhaseUnlocks,
          [nextPhase]: now,
        } as Record<Phase, string | null>,
        requirements: PHASE_REQUIREMENTS[nextPhase].map(req => ({
          ...req,
          current: 0,
          completed: false,
        })),
        completedRequirements: [],
      },
    });

    return true;
  };

  return {
    unlockNextPhase,
    isUnlocking: false,
  };
}
