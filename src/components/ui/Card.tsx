"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "orange" | "blue" | "none";
  onClick?: () => void;
}

const glowStyles = {
  orange: "hover:shadow-[0_0_30px_rgba(255,107,53,0.3)] hover:border-[var(--molten-orange)]",
  blue: "hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:border-[var(--neon-blue)]",
  none: "",
};

export function Card({
  children,
  className,
  hover = true,
  glow = "blue",
  onClick,
}: CardProps) {
  return (
    <motion.div
      className={cn(
        "bg-[var(--dark-gray)] rounded-2xl p-6",
        "border border-white/10",
        "transition-all duration-300",
        hover && "hover:-translate-y-1",
        glowStyles[glow],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      whileHover={hover ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
    >
      {children}
    </motion.div>
  );
}

// Glass card variant
interface GlassCardProps extends CardProps {
  blur?: "sm" | "md" | "lg";
}

export function GlassCard({
  children,
  className,
  blur = "md",
  ...props
}: GlassCardProps) {
  const blurStyles = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };

  return (
    <Card
      className={cn(
        "bg-white/5",
        blurStyles[blur],
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

// Feature card with icon
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <Card className={cn("text-center", className)}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--molten-orange)]/10 flex items-center justify-center text-3xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-[var(--light-gray)]/70">{description}</p>
    </Card>
  );
}
