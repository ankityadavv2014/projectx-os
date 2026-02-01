"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  missionsStore,
  assignmentsStore,
  submissionsStore,
  rubricsStore,
} from "@/lib/domain/store";
import type { Mission, Assignment, Submission, Rubric } from "@/lib/domain/types";
import { useCurrentUser } from "./useUser";

// =============================================================================
// USE MISSIONS
// =============================================================================

interface UseMissionsOptions {
  status?: "draft" | "published" | "archived";
  trackId?: string;
}

interface UseMissionsReturn {
  missions: Mission[];
  isLoading: boolean;
  getById: (id: string) => Mission | null;
  getByTrack: (trackId: string) => Mission[];
  refresh: () => void;
}

export function useMissions(options?: UseMissionsOptions): UseMissionsReturn {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMissions = useCallback(() => {
    setIsLoading(true);
    let result = missionsStore.getAll();
    
    if (options?.status) {
      result = result.filter(m => m.status === options.status);
    }
    
    if (options?.trackId) {
      result = result.filter(m => m.trackId === options.trackId);
    }
    
    setMissions(result);
    setIsLoading(false);
  }, [options?.status, options?.trackId]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const getById = useCallback((id: string) => {
    return missionsStore.getById(id);
  }, []);

  const getByTrack = useCallback((trackId: string) => {
    return missions.filter(m => m.trackId === trackId);
  }, [missions]);

  return {
    missions,
    isLoading,
    getById,
    getByTrack,
    refresh: loadMissions,
  };
}

// =============================================================================
// USE MISSION DETAILS
// =============================================================================

interface UseMissionReturn {
  mission: Mission | null;
  rubric: Rubric | null;
  isLoading: boolean;
}

export function useMission(missionId: string | null): UseMissionReturn {
  const [mission, setMission] = useState<Mission | null>(null);
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!missionId) {
      setMission(null);
      setRubric(null);
      setIsLoading(false);
      return;
    }

    const found = missionsStore.getById(missionId);
    setMission(found);
    
    if (found?.rubricId) {
      const foundRubric = rubricsStore.getById(found.rubricId);
      setRubric(foundRubric);
    }
    
    setIsLoading(false);
  }, [missionId]);

  return { mission, rubric, isLoading };
}

// =============================================================================
// USE ASSIGNMENTS
// =============================================================================

interface UseAssignmentsOptions {
  cohortId?: string;
}

interface UseAssignmentsReturn {
  assignments: Assignment[];
  isLoading: boolean;
  getById: (id: string) => Assignment | null;
  getForMission: (missionId: string) => Assignment[];
  refresh: () => void;
}

export function useAssignments(options?: UseAssignmentsOptions): UseAssignmentsReturn {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAssignments = useCallback(() => {
    setIsLoading(true);
    let result = assignmentsStore.getAll();
    
    if (options?.cohortId) {
      result = result.filter(a => a.cohortId === options.cohortId);
    }
    
    setAssignments(result);
    setIsLoading(false);
  }, [options?.cohortId]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const getById = useCallback((id: string) => {
    return assignmentsStore.getById(id);
  }, []);

  const getForMission = useCallback((missionId: string) => {
    return assignments.filter(a => a.missionId === missionId);
  }, [assignments]);

  return {
    assignments,
    isLoading,
    getById,
    getForMission,
    refresh: loadAssignments,
  };
}

// =============================================================================
// USE MY MISSIONS (Student View)
// =============================================================================

type MissionProgressStatus = "locked" | "available" | "in_progress" | "submitted" | "completed";

interface MissionWithStatus extends Omit<Mission, "status"> {
  assignmentId?: string;
  submission?: Submission;
  missionStatus: Mission["status"]; // Original mission status
  progressStatus: MissionProgressStatus; // User's progress status
  progress: number;
}

interface UseMyMissionsReturn {
  missions: MissionWithStatus[];
  available: MissionWithStatus[];
  inProgress: MissionWithStatus[];
  completed: MissionWithStatus[];
  isLoading: boolean;
  refresh: () => void;
}

export function useMyMissions(): UseMyMissionsReturn {
  const { user } = useCurrentUser();
  const [missions, setMissions] = useState<MissionWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMissions = useCallback(() => {
    if (!user) {
      setMissions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Get all published missions
    const allMissions = missionsStore.getPublished();
    
    // Get user's submissions
    const mySubmissions = submissionsStore.getByStudent(user.id);
    
    // Get assignments for user's cohorts
    const myAssignments = user.cohortIds.flatMap(cohortId => 
      assignmentsStore.getByCohort(cohortId)
    );

    // Combine into enriched missions
    const enriched: MissionWithStatus[] = allMissions.map(mission => {
      const assignment = myAssignments.find(a => a.missionId === mission.id);
      const submission = mySubmissions.find(s => s.missionId === mission.id);
      
      let progressStatus: MissionProgressStatus = "available";
      let progress = 0;

      if (submission) {
        if (submission.status === "approved") {
          progressStatus = "completed";
          progress = 100;
        } else if (submission.status === "submitted" || submission.status === "in_review") {
          progressStatus = "submitted";
          progress = 80;
        } else if (submission.status === "draft") {
          progressStatus = "in_progress";
          progress = 50;
        } else if (submission.status === "revision_requested") {
          progressStatus = "in_progress";
          progress = 60;
        }
      } else if (mission.requiredLevel && user.level < mission.requiredLevel) {
        progressStatus = "locked";
      }

      return {
        ...mission,
        assignmentId: assignment?.id,
        submission,
        missionStatus: mission.status,
        progressStatus,
        progress,
      };
    });

    setMissions(enriched);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const available = useMemo(() => 
    missions.filter(m => m.progressStatus === "available"), 
    [missions]
  );

  const inProgress = useMemo(() => 
    missions.filter(m => m.progressStatus === "in_progress" || m.progressStatus === "submitted"), 
    [missions]
  );

  const completed = useMemo(() => 
    missions.filter(m => m.progressStatus === "completed"), 
    [missions]
  );

  return {
    missions,
    available,
    inProgress,
    completed,
    isLoading,
    refresh: loadMissions,
  };
}
