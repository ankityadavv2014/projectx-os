"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = 
  | "default" 
  | "success" 
  | "warning" 
  | "error" 
  | "info" 
  | "orange" 
  | "blue" 
  | "gold"
  | "outline";

type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  icon?: React.ReactNode;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-[var(--light-gray)]",
  success: "bg-green-500/20 text-green-400",
  warning: "bg-yellow-500/20 text-yellow-400",
  error: "bg-red-500/20 text-red-400",
  info: "bg-blue-500/20 text-blue-400",
  orange: "bg-[var(--molten-orange)]/20 text-[var(--molten-orange)]",
  blue: "bg-[var(--neon-blue)]/20 text-[var(--neon-blue)]",
  gold: "bg-[var(--sacred-gold)]/20 text-[var(--sacred-gold)]",
  outline: "bg-transparent border border-white/20 text-[var(--light-gray)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
  icon,
  dot,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {icon}
      {children}
    </span>
  );
}

// =============================================================================
// PHASE BADGE
// =============================================================================

import type { Phase } from "@/lib/domain/types";

const phaseStyles: Record<Phase, { bg: string; text: string; label: string }> = {
  experience: { 
    bg: "bg-blue-500/20", 
    text: "text-blue-400",
    label: "Experience" 
  },
  experiment: { 
    bg: "bg-purple-500/20", 
    text: "text-purple-400",
    label: "Experiment" 
  },
  excel: { 
    bg: "bg-[var(--sacred-gold)]/20", 
    text: "text-[var(--sacred-gold)]",
    label: "Excel" 
  },
  expand: { 
    bg: "bg-[var(--molten-orange)]/20", 
    text: "text-[var(--molten-orange)]",
    label: "Expand" 
  },
};

interface PhaseBadgeProps {
  phase: Phase;
  size?: BadgeSize;
  className?: string;
  showIcon?: boolean;
}

export function PhaseBadge({ phase, size = "md", className, showIcon = true }: PhaseBadgeProps) {
  const { bg, text, label } = phaseStyles[phase];
  
  const phaseIcons: Record<Phase, string> = {
    experience: "🌱",
    experiment: "🧪",
    excel: "⚡",
    expand: "🚀",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        bg,
        text,
        sizeStyles[size],
        className
      )}
    >
      {showIcon && <span>{phaseIcons[phase]}</span>}
      {label}
    </span>
  );
}

// =============================================================================
// STATUS BADGE
// =============================================================================

type StatusType = 
  | "pending" 
  | "active" 
  | "completed" 
  | "approved" 
  | "rejected" 
  | "draft"
  | "in_review"
  | "revision_requested"
  | "submitted";

interface StatusBadgeProps {
  status: StatusType;
  size?: BadgeSize;
  className?: string;
}

const statusConfig: Record<StatusType, { variant: BadgeVariant; label: string }> = {
  pending: { variant: "warning", label: "Pending" },
  active: { variant: "success", label: "Active" },
  completed: { variant: "success", label: "Completed" },
  approved: { variant: "success", label: "Approved" },
  rejected: { variant: "error", label: "Rejected" },
  draft: { variant: "default", label: "Draft" },
  in_review: { variant: "info", label: "In Review" },
  revision_requested: { variant: "warning", label: "Revision Requested" },
  submitted: { variant: "blue", label: "Submitted" },
};

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const config = statusConfig[status] || { variant: "default", label: status };
  
  return (
    <Badge variant={config.variant} size={size} className={className} dot>
      {config.label}
    </Badge>
  );
}
