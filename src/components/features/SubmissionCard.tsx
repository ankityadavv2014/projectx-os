"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import { StatusBadge } from "../ui/Badge";
import type { Submission, Mission, User, Artifact } from "@/lib/domain/types";

// =============================================================================
// SUBMISSION CARD
// =============================================================================

interface SubmissionCardProps {
  submission: Submission;
  mission?: Mission;
  student?: User;
  artifacts?: Artifact[];
  onClick?: () => void;
  showStudent?: boolean;
  className?: string;
}

export function SubmissionCard({
  submission,
  mission,
  student,
  artifacts = [],
  onClick,
  showStudent = true,
  className,
}: SubmissionCardProps) {
  const submittedAt = submission.submittedAt
    ? new Date(submission.submittedAt).toLocaleDateString()
    : null;

  return (
    <Card hover onClick={onClick} className={className}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-lg">
            {mission?.title || "Mission"}
          </h3>
          {showStudent && student && (
            <div className="flex items-center gap-2 mt-2">
              <Avatar src={student.avatarUrl} name={student.displayName} size="sm" />
              <span className="text-sm text-[var(--light-gray)]">{student.displayName}</span>
            </div>
          )}
        </div>
        <StatusBadge status={submission.status} />
      </div>

      {/* Reflection Preview */}
      {submission.reflection && (
        <p className="text-sm text-[var(--light-gray)]/70 line-clamp-2 mb-4">
          "{submission.reflection}"
        </p>
      )}

      {/* Artifacts Preview */}
      {artifacts.length > 0 && (
        <div className="flex gap-2 mb-4">
          {artifacts.slice(0, 4).map((artifact, index) => (
            <div
              key={artifact.id}
              className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center"
            >
              {artifact.type === "image" && artifact.thumbnailUrl ? (
                <img
                  src={artifact.thumbnailUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">
                  {artifact.type === "video" ? "🎬" :
                   artifact.type === "link" ? "🔗" :
                   artifact.type === "file" ? "📄" : "📎"}
                </span>
              )}
            </div>
          ))}
          {artifacts.length > 4 && (
            <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center text-sm text-[var(--light-gray)]">
              +{artifacts.length - 4}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm text-[var(--light-gray)]/60">
        <span>{artifacts.length} artifact{artifacts.length !== 1 ? "s" : ""}</span>
        {submittedAt && <span>Submitted {submittedAt}</span>}
      </div>
    </Card>
  );
}

// =============================================================================
// SUBMISSION LIST ITEM (Compact)
// =============================================================================

interface SubmissionListItemProps {
  submission: Submission;
  mission?: Mission;
  student?: User;
  onClick?: () => void;
  className?: string;
}

export function SubmissionListItem({
  submission,
  mission,
  student,
  onClick,
  className,
}: SubmissionListItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl text-left",
        "bg-[var(--dark-gray)] border border-white/10",
        "hover:bg-white/5 transition-all",
        "flex items-center gap-4",
        className
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Student Avatar */}
      {student && (
        <Avatar src={student.avatarUrl} name={student.displayName} size="md" />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white truncate">
          {mission?.title || "Mission"}
        </h4>
        <p className="text-sm text-[var(--light-gray)]/60 truncate">
          {student?.displayName || "Student"}
        </p>
      </div>

      {/* Status */}
      <StatusBadge status={submission.status} size="sm" />
    </motion.button>
  );
}

// =============================================================================
// PENDING REVIEW CARD
// =============================================================================

interface PendingReviewCardProps {
  submission: Submission;
  mission?: Mission;
  student?: User;
  onReview?: () => void;
  className?: string;
}

export function PendingReviewCard({
  submission,
  mission,
  student,
  onReview,
  className,
}: PendingReviewCardProps) {
  const waitTime = submission.submittedAt
    ? Math.floor((Date.now() - new Date(submission.submittedAt).getTime()) / (1000 * 60 * 60))
    : 0;

  return (
    <Card className={className}>
      <div className="flex items-start gap-4">
        {student && (
          <Avatar src={student.avatarUrl} name={student.displayName} size="lg" />
        )}
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-white">{mission?.title || "Mission"}</h3>
              <p className="text-sm text-[var(--light-gray)]">{student?.displayName}</p>
            </div>
            <span className="text-xs text-[var(--light-gray)]/60">
              {waitTime}h ago
            </span>
          </div>
          
          {submission.reflection && (
            <p className="mt-3 text-sm text-[var(--light-gray)]/70 line-clamp-2 italic">
              "{submission.reflection}"
            </p>
          )}

          <button
            onClick={onReview}
            className="mt-4 px-4 py-2 bg-[var(--neon-blue)] text-[var(--deep-space)] rounded-lg text-sm font-medium hover:bg-[var(--neon-blue)]/80 transition-colors"
          >
            Review Submission
          </button>
        </div>
      </div>
    </Card>
  );
}
