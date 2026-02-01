"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  submissionsStore,
  artifactsStore,
  reviewsStore,
  missionsStore,
  usersStore,
} from "@/lib/domain/store";
import type { 
  Submission, 
  Artifact, 
  Review, 
  Mission, 
  User,
  SubmissionStatus 
} from "@/lib/domain/types";
import { useCurrentUser } from "./useUser";

// =============================================================================
// USE SUBMISSIONS
// =============================================================================

interface UseSubmissionsOptions {
  studentId?: string;
  cohortId?: string;
  status?: SubmissionStatus;
}

interface EnrichedSubmission extends Submission {
  mission?: Mission;
  student?: User;
  artifacts: Artifact[];
  review?: Review;
}

interface UseSubmissionsReturn {
  submissions: EnrichedSubmission[];
  isLoading: boolean;
  getById: (id: string) => Submission | null;
  refresh: () => void;
}

export function useSubmissions(options?: UseSubmissionsOptions): UseSubmissionsReturn {
  const [submissions, setSubmissions] = useState<EnrichedSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubmissions = useCallback(() => {
    setIsLoading(true);
    let result = submissionsStore.getAll();
    
    if (options?.studentId) {
      result = result.filter(s => s.studentId === options.studentId);
    }
    
    if (options?.cohortId) {
      result = result.filter(s => s.cohortId === options.cohortId);
    }
    
    if (options?.status) {
      result = result.filter(s => s.status === options.status);
    }

    // Enrich with related data
    const enriched = result.map(submission => ({
      ...submission,
      mission: missionsStore.getById(submission.missionId) || undefined,
      student: usersStore.getById(submission.studentId) || undefined,
      artifacts: artifactsStore.getBySubmission(submission.id),
      review: reviewsStore.getBySubmission(submission.id),
    }));
    
    setSubmissions(enriched);
    setIsLoading(false);
  }, [options?.studentId, options?.cohortId, options?.status]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const getById = useCallback((id: string) => {
    return submissionsStore.getById(id);
  }, []);

  return {
    submissions,
    isLoading,
    getById,
    refresh: loadSubmissions,
  };
}

// =============================================================================
// USE MY SUBMISSIONS (Student View)
// =============================================================================

interface UseMySubmissionsReturn {
  submissions: EnrichedSubmission[];
  pending: EnrichedSubmission[];
  approved: EnrichedSubmission[];
  needsRevision: EnrichedSubmission[];
  isLoading: boolean;
  refresh: () => void;
}

export function useMySubmissions(): UseMySubmissionsReturn {
  const { user } = useCurrentUser();
  const { submissions, isLoading, refresh } = useSubmissions({
    studentId: user?.id,
  });

  const pending = useMemo(() => 
    submissions.filter(s => s.status === "submitted" || s.status === "in_review"),
    [submissions]
  );

  const approved = useMemo(() => 
    submissions.filter(s => s.status === "approved"),
    [submissions]
  );

  const needsRevision = useMemo(() => 
    submissions.filter(s => s.status === "revision_requested"),
    [submissions]
  );

  return {
    submissions,
    pending,
    approved,
    needsRevision,
    isLoading,
    refresh,
  };
}

// =============================================================================
// USE PENDING REVIEWS (Teacher View)
// =============================================================================

interface UsePendingReviewsReturn {
  submissions: EnrichedSubmission[];
  count: number;
  isLoading: boolean;
  refresh: () => void;
}

export function usePendingReviews(cohortId?: string): UsePendingReviewsReturn {
  const { submissions, isLoading, refresh } = useSubmissions({
    cohortId,
    status: "submitted",
  });

  return {
    submissions,
    count: submissions.length,
    isLoading,
    refresh,
  };
}

// =============================================================================
// USE SUBMISSION DETAILS
// =============================================================================

interface UseSubmissionReturn {
  submission: EnrichedSubmission | null;
  isLoading: boolean;
  refresh: () => void;
}

export function useSubmission(submissionId: string | null): UseSubmissionReturn {
  const [submission, setSubmission] = useState<EnrichedSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubmission = useCallback(() => {
    if (!submissionId) {
      setSubmission(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const found = submissionsStore.getById(submissionId);
    
    if (found) {
      setSubmission({
        ...found,
        mission: missionsStore.getById(found.missionId) || undefined,
        student: usersStore.getById(found.studentId) || undefined,
        artifacts: artifactsStore.getBySubmission(found.id),
        review: reviewsStore.getBySubmission(found.id),
      });
    } else {
      setSubmission(null);
    }
    
    setIsLoading(false);
  }, [submissionId]);

  useEffect(() => {
    loadSubmission();
  }, [loadSubmission]);

  return { 
    submission, 
    isLoading,
    refresh: loadSubmission,
  };
}

// =============================================================================
// USE SUBMISSION ACTIONS
// =============================================================================

interface SubmissionActions {
  createDraft: (missionId: string) => Submission | null;
  updateDraft: (submissionId: string, updates: Partial<Submission>) => Submission | null;
  submitForReview: (submissionId: string) => Submission | null;
  addArtifact: (submissionId: string, artifact: Omit<Artifact, "id" | "createdAt">) => Artifact;
}

export function useSubmissionActions(): SubmissionActions {
  const { user } = useCurrentUser();

  const createDraft = useCallback((missionId: string) => {
    if (!user) return null;
    
    const now = new Date().toISOString();
    const submission: Submission = {
      id: `sub_${Date.now()}`,
      studentId: user.id,
      missionId,
      cohortId: user.cohortIds[0] || "",
      artifactIds: [],
      reflection: "",
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
    
    return submissionsStore.create(submission);
  }, [user]);

  const updateDraft = useCallback((submissionId: string, updates: Partial<Submission>) => {
    return submissionsStore.update(submissionId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const submitForReview = useCallback((submissionId: string) => {
    return submissionsStore.update(submissionId, {
      status: "submitted",
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const addArtifact = useCallback((submissionId: string, artifact: Omit<Artifact, "id" | "createdAt">) => {
    const newArtifact: Artifact = {
      ...artifact,
      id: `art_${Date.now()}`,
      submissionId,
      createdAt: new Date().toISOString(),
    };
    
    // Add to artifacts store
    artifactsStore.create(newArtifact);
    
    // Update submission artifact IDs
    const submission = submissionsStore.getById(submissionId);
    if (submission) {
      submissionsStore.update(submissionId, {
        artifactIds: [...submission.artifactIds, newArtifact.id],
        updatedAt: new Date().toISOString(),
      });
    }
    
    return newArtifact;
  }, []);

  return {
    createDraft,
    updateDraft,
    submitForReview,
    addArtifact,
  };
}
