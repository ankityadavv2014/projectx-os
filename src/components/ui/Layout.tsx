"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "./Badge";

// =============================================================================
// PAGE HEADER
// =============================================================================

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  badge?: {
    label: string;
    variant?: "default" | "success" | "warning" | "error" | "info" | "orange" | "blue" | "gold";
  };
  actions?: React.ReactNode;
  backHref?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  badge,
  actions,
  backHref,
  className,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("mb-8", className)}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-[var(--light-gray)]/60 mb-4">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <button
                  onClick={() => router.push(crumb.href!)}
                  className="hover:text-white transition-colors"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-white">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {backHref && (
              <button
                onClick={() => router.push(backHref)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[var(--light-gray)] hover:text-white"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
            {badge && (
              <Badge variant={badge.variant || "default"}>
                {badge.label}
              </Badge>
            )}
          </div>
          {description && (
            <p className="mt-2 text-[var(--light-gray)]/70 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </motion.header>
  );
}

// =============================================================================
// SECTION
// =============================================================================

interface SectionProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function Section({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <section className={cn("mb-8", className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-white">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-[var(--light-gray)]/60">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}

// =============================================================================
// GRID
// =============================================================================

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const colStyles = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const gapStyles = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

export function Grid({ children, cols = 3, gap = "md", className }: GridProps) {
  return (
    <div className={cn("grid", colStyles[cols], gapStyles[gap], className)}>
      {children}
    </div>
  );
}

// =============================================================================
// STAT CARD
// =============================================================================

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    label?: string;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "bg-[var(--dark-gray)] rounded-xl p-6",
        "border border-white/10",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--light-gray)]/60 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {trend && (
                <span
                  className={cn(
                    "text-sm",
                    trend === "up" && "text-green-400",
                    trend === "down" && "text-red-400",
                    trend === "neutral" && "text-[var(--light-gray)]"
                  )}
                >
                  {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
                </span>
              )}
              <span
                className={cn(
                  "text-sm",
                  change.positive ? "text-green-400" : "text-red-400"
                )}
              >
                {change.positive && "+"}
                {change.value}%
              </span>
              {change.label && (
                <span className="text-sm text-[var(--light-gray)]/60">
                  {change.label}
                </span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// =============================================================================
// DASHBOARD LAYOUT
// =============================================================================

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

export function DashboardLayout({
  children,
  sidebar,
  header,
  className,
}: DashboardLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-[var(--deep-space)]", className)}>
      {header}
      <div className="flex">
        {sidebar && (
          <aside className="w-64 flex-shrink-0 border-r border-white/10 min-h-[calc(100vh-64px)]">
            {sidebar}
          </aside>
        )}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

// =============================================================================
// CONTAINER
// =============================================================================

interface ContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const containerSizes = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export function Container({ children, size = "xl", className }: ContainerProps) {
  return (
    <div className={cn("mx-auto px-4 md:px-6 lg:px-8", containerSizes[size], className)}>
      {children}
    </div>
  );
}

// =============================================================================
// DIVIDER
// =============================================================================

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-4 my-6", className)}>
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-sm text-[var(--light-gray)]/60">{label}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>
    );
  }

  return <hr className={cn("border-0 h-px bg-white/10 my-6", className)} />;
}
