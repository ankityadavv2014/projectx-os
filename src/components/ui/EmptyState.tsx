"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4",
        className
      )}
    >
      {icon && (
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-4xl mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-[var(--light-gray)]/70 max-w-md mb-6">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex gap-3">
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}
    </motion.div>
  );
}

// =============================================================================
// PRESET EMPTY STATES
// =============================================================================

interface PresetEmptyStateProps {
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function NoMissionsState({ action, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon="🎯"
      title="No Missions Available"
      description="New missions will appear here as your teacher assigns them."
      action={action}
      className={className}
    />
  );
}

export function NoSubmissionsState({ action, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon="📦"
      title="No Submissions Yet"
      description="Complete a mission and submit your work to see it here."
      action={action}
      className={className}
    />
  );
}

export function NoReviewsState({ action, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon="📝"
      title="No Reviews to Show"
      description="Submissions pending review will appear here."
      action={action}
      className={className}
    />
  );
}

export function NoStudentsState({ action, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon="👥"
      title="No Students Yet"
      description="Share your cohort code to invite students to join."
      action={action}
      className={className}
    />
  );
}

export function NoBadgesState({ action, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon="🏆"
      title="No Badges Earned"
      description="Complete missions to earn badges and showcase your skills."
      action={action}
      className={className}
    />
  );
}

export function NoResultsState({ query, className }: { query?: string; className?: string }) {
  return (
    <EmptyState
      icon="🔍"
      title="No Results Found"
      description={query ? `No results found for "${query}". Try a different search term.` : "Try adjusting your filters or search criteria."}
      className={className}
    />
  );
}

export function LoadingState({ message, className }: { message?: string; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col items-center justify-center py-16",
        className
      )}
    >
      <div className="w-12 h-12 border-3 border-[var(--neon-blue)] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-[var(--light-gray)]">{message || "Loading..."}</p>
    </motion.div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  action,
  className,
}: {
  title?: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <EmptyState
      icon="⚠️"
      title={title}
      description={message || "An unexpected error occurred. Please try again."}
      action={action || { label: "Retry", onClick: () => window.location.reload() }}
      className={className}
    />
  );
}
