"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants = {
  primary: "bg-[var(--molten-orange)] text-[var(--deep-space)] hover:shadow-[0_8px_30px_rgba(255,107,53,0.4)]",
  secondary: "bg-transparent border-2 border-[var(--neon-blue)] text-[var(--neon-blue)] hover:bg-[var(--neon-blue)] hover:text-[var(--deep-space)]",
  ghost: "bg-transparent text-[var(--light-gray)] hover:bg-white/10",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--deep-space)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "hover:-translate-y-0.5 active:translate-y-0",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

// Motion button variant
export const MotionButton = motion.create(Button);

export function GlowButton({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={cn(
        "relative inline-flex items-center justify-center px-8 py-4 font-bold text-lg rounded-lg",
        "bg-[var(--molten-orange)] text-[var(--deep-space)]",
        "overflow-hidden group",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...(props as HTMLMotionProps<"button">)}
    >
      {/* Glow effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-[var(--molten-orange)] via-[var(--sacred-gold)] to-[var(--molten-orange)] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
      {/* Shine effect */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700" />
    </motion.button>
  );
}
