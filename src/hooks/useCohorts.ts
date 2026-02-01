"use client";

import { useState, useEffect, useCallback } from "react";
import {
  cohortsStore,
  usersStore,
} from "@/lib/domain/store";
import type { Cohort, User } from "@/lib/domain/types";
import { useCurrentUser } from "./useUser";

// =============================================================================
// USE COHORTS
// =============================================================================

interface UseCohortssOptions {
  orgId?: string;
}

interface UseCohortssReturn {
  cohorts: Cohort[];
  isLoading: boolean;
  getById: (id: string) => Cohort | null;
  getByCode: (code: string) => Cohort | undefined;
  refresh: () => void;
}

export function useCohorts(options?: UseCohortssOptions): UseCohortssReturn {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCohorts = useCallback(() => {
    setIsLoading(true);
    let result = cohortsStore.getAll();
    
    if (options?.orgId) {
      result = result.filter(c => c.orgId === options.orgId);
    }
    
    setCohorts(result);
    setIsLoading(false);
  }, [options?.orgId]);

  useEffect(() => {
    loadCohorts();
  }, [loadCohorts]);

  const getById = useCallback((id: string) => {
    return cohortsStore.getById(id);
  }, []);

  const getByCode = useCallback((code: string) => {
    return cohortsStore.getByCode(code);
  }, []);

  return {
    cohorts,
    isLoading,
    getById,
    getByCode,
    refresh: loadCohorts,
  };
}

// =============================================================================
// USE MY COHORTS
// =============================================================================

interface EnrichedCohort extends Cohort {
  students: User[];
  teachers: User[];
}

interface UseMyCohortssReturn {
  cohorts: EnrichedCohort[];
  isLoading: boolean;
  refresh: () => void;
}

export function useMyCohorts(): UseMyCohortssReturn {
  const { user } = useCurrentUser();
  const [cohorts, setCohorts] = useState<EnrichedCohort[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCohorts = useCallback(() => {
    if (!user) {
      setCohorts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    let userCohorts: Cohort[] = [];
    
    if (user.role === "teacher" || user.role === "facilitator") {
      // Teachers see cohorts they're assigned to
      userCohorts = cohortsStore.getAll().filter(c => 
        c.teacherIds.includes(user.id) || c.facilitatorIds?.includes(user.id)
      );
    } else if (user.role === "admin") {
      // Admins see all org cohorts
      userCohorts = cohortsStore.getByOrg(user.orgId);
    } else {
      // Students see their cohorts
      userCohorts = user.cohortIds
        .map(id => cohortsStore.getById(id))
        .filter((c): c is Cohort => c !== null);
    }

    // Enrich with member data
    const enriched: EnrichedCohort[] = userCohorts.map(cohort => ({
      ...cohort,
      students: usersStore.getByCohort(cohort.id).filter(u => u.role === "student"),
      teachers: cohort.teacherIds
        .map(id => usersStore.getById(id))
        .filter((u): u is User => u !== null),
    }));

    setCohorts(enriched);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadCohorts();
  }, [loadCohorts]);

  return {
    cohorts,
    isLoading,
    refresh: loadCohorts,
  };
}

// =============================================================================
// USE COHORT DETAILS
// =============================================================================

interface UseCohortReturn {
  cohort: EnrichedCohort | null;
  isLoading: boolean;
  refresh: () => void;
}

export function useCohort(cohortId: string | null): UseCohortReturn {
  const [cohort, setCohort] = useState<EnrichedCohort | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCohort = useCallback(() => {
    if (!cohortId) {
      setCohort(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const found = cohortsStore.getById(cohortId);
    
    if (found) {
      setCohort({
        ...found,
        students: usersStore.getByCohort(found.id).filter(u => u.role === "student"),
        teachers: found.teacherIds
          .map(id => usersStore.getById(id))
          .filter((u): u is User => u !== null),
      });
    } else {
      setCohort(null);
    }
    
    setIsLoading(false);
  }, [cohortId]);

  useEffect(() => {
    loadCohort();
  }, [loadCohort]);

  return {
    cohort,
    isLoading,
    refresh: loadCohort,
  };
}
