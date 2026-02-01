"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  reviewsStore,
  submissionsStore,
  usersStore,
  missionsStore,
} from "@/lib/domain/store";
import type { Review, Submission, User, Mission } from "@/lib/domain/types";
import { useCurrentUser } from "./useUser";

// =============================================================================
// USE REVIEWS
// =============================================================================

interface EnrichedReview extends Review {
  submission?: Submission;
  student?: User;
  reviewer?: User;
  mission?: Mission;
}

interface UseReviewsOptions {
  reviewerId?: string;
  submissionId?: string;
}

interface UseReviewsReturn {
  reviews: EnrichedReview[];
  isLoading: boolean;
  getById: (id: string) => Review | null;
  refresh: () => void;
}

export function useReviews(options?: UseReviewsOptions): UseReviewsReturn {
  const [reviews, setReviews] = useState<EnrichedReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = useCallback(() => {
    setIsLoading(true);
    let result = reviewsStore.getAll();
    
    if (options?.reviewerId) {
      result = result.filter(r => r.reviewerId === options.reviewerId);
    }
    
    if (options?.submissionId) {
      result = result.filter(r => r.submissionId === options.submissionId);
    }

    // Enrich with related data
    const enriched = result.map(review => {
      const submission = submissionsStore.getById(review.submissionId);
      return {
        ...review,
        submission: submission || undefined,
        student: submission ? usersStore.getById(submission.studentId) || undefined : undefined,
        reviewer: usersStore.getById(review.reviewerId) || undefined,
        mission: submission ? missionsStore.getById(submission.missionId) || undefined : undefined,
      };
    });
    
    setReviews(enriched);
    setIsLoading(false);
  }, [options?.reviewerId, options?.submissionId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const getById = useCallback((id: string) => {
    return reviewsStore.getById(id);
  }, []);

  return {
    reviews,
    isLoading,
    getById,
    refresh: loadReviews,
  };
}

// =============================================================================
// USE MY REVIEWS (Teacher's completed reviews)
// =============================================================================

export function useMyReviews() {
  const { user } = useCurrentUser();
  return useReviews({ reviewerId: user?.id });
}

// =============================================================================
// USE REVIEW ACTIONS
// =============================================================================

import type { ReviewScore } from "@/lib/domain/types";

interface ReviewActions {
  createReview: (submissionId: string, data: {
    scores: ReviewScore[];
    feedback: string;
    outcome: "approved" | "revision_requested";
  }) => Review | null;
}

export function useReviewActions(): ReviewActions {
  const { user } = useCurrentUser();

  const createReview = useCallback((
    submissionId: string,
    data: {
      scores: ReviewScore[];
      feedback: string;
      outcome: "approved" | "revision_requested";
    }
  ) => {
    if (!user) return null;
    
    const now = new Date().toISOString();
    
    // Calculate total score
    const totalScore = data.scores.reduce((sum, score) => sum + score.score, 0);
    
    // Get submission to find rubric
    const submission = submissionsStore.getById(submissionId);
    const mission = submission ? missionsStore.getById(submission.missionId) : null;
    
    const review: Review = {
      id: `rev_${Date.now()}`,
      submissionId,
      reviewerId: user.id,
      reviewerRole: user.role as "teacher" | "admin" | "facilitator",
      rubricId: mission?.rubricId || "",
      scores: data.scores,
      totalScore,
      feedback: data.feedback,
      decision: data.outcome,
      createdAt: now,
    };
    
    // Create review
    const createdReview = reviewsStore.create(review);
    
    // Update submission status
    submissionsStore.update(submissionId, {
      status: data.outcome,
      reviewId: review.id,
      updatedAt: now,
      ...(data.outcome === "approved" ? { approvedAt: now } : {}),
    });
    
    return createdReview;
  }, [user]);

  return {
    createReview,
  };
}
