"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: TooltipProps) {
  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className={cn("relative inline-block group", className)}>
      {children}
      <div
        className={cn(
          "absolute z-50 px-3 py-1.5 text-sm rounded-lg",
          "bg-[var(--dark-gray)] border border-white/10 text-white",
          "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
          "transition-all duration-200",
          "whitespace-nowrap",
          positions[side]
        )}
      >
        {content}
      </div>
    </div>
  );
}

// =============================================================================
// SKELETON
// =============================================================================

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: number | string;
  height?: number | string;
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
}: SkeletonProps) {
  const variantStyles = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <motion.div
      className={cn(
        "bg-white/10 animate-pulse",
        variantStyles[variant],
        className
      )}
      style={{ width, height }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
    />
  );
}

// =============================================================================
// LOADING SKELETON PATTERNS
// =============================================================================

export function CardSkeleton() {
  return (
    <div className="bg-[var(--dark-gray)] rounded-xl p-6 border border-white/10">
      <Skeleton width="40%" height={24} className="mb-3" />
      <Skeleton width="100%" height={16} className="mb-2" />
      <Skeleton width="80%" height={16} className="mb-4" />
      <div className="flex gap-2">
        <Skeleton width={60} height={24} variant="rectangular" />
        <Skeleton width={80} height={24} variant="rectangular" />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-[var(--dark-gray)] rounded-lg border border-white/10">
          <Skeleton width={40} height={40} variant="circular" />
          <div className="flex-1">
            <Skeleton width="30%" height={18} className="mb-2" />
            <Skeleton width="60%" height={14} />
          </div>
          <Skeleton width={80} height={32} variant="rectangular" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-[var(--dark-gray)] border-b border-white/10">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width="25%" height={16} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b border-white/5 last:border-0">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} width="25%" height={14} />
          ))}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// KEYBOARD SHORTCUT
// =============================================================================

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center",
        "px-2 py-0.5 text-xs font-medium",
        "bg-white/10 border border-white/20 rounded",
        "text-[var(--light-gray)]",
        className
      )}
    >
      {children}
    </kbd>
  );
}

// =============================================================================
// ICON BUTTON
// =============================================================================

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "filled" | "outline";
}

export function IconButton({
  icon,
  label,
  size = "md",
  variant = "ghost",
  className,
  ...props
}: IconButtonProps) {
  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const variantStyles = {
    ghost: "hover:bg-white/10",
    filled: "bg-[var(--dark-gray)] hover:bg-white/10",
    outline: "border border-white/20 hover:bg-white/10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg",
        "text-[var(--light-gray)] hover:text-white",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-blue)]",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}

// =============================================================================
// COPY BUTTON
// =============================================================================

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <IconButton
      icon={
        copied ? (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )
      }
      label="Copy"
      size="sm"
      onClick={handleCopy}
      className={className}
    />
  );
}
