"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
  showOnline?: boolean;
  isOnline?: boolean;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; indicator: string }> = {
  xs: { container: "w-6 h-6", text: "text-xs", indicator: "w-1.5 h-1.5" },
  sm: { container: "w-8 h-8", text: "text-sm", indicator: "w-2 h-2" },
  md: { container: "w-10 h-10", text: "text-base", indicator: "w-2.5 h-2.5" },
  lg: { container: "w-12 h-12", text: "text-lg", indicator: "w-3 h-3" },
  xl: { container: "w-16 h-16", text: "text-xl", indicator: "w-3.5 h-3.5" },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromName(name: string): string {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
  ];
  
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function Avatar({
  src,
  alt = "Avatar",
  name = "User",
  size = "md",
  className,
  showOnline = false,
  isOnline = false,
}: AvatarProps) {
  const { container, text, indicator } = sizeStyles[size];

  return (
    <div className={cn("relative inline-block", className)}>
      {src ? (
        <div className={cn(container, "rounded-full overflow-hidden")}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className={cn(
            container,
            "rounded-full flex items-center justify-center font-semibold text-white",
            getColorFromName(name)
          )}
        >
          <span className={text}>{getInitials(name)}</span>
        </div>
      )}
      
      {showOnline && (
        <span
          className={cn(
            indicator,
            "absolute bottom-0 right-0 rounded-full border-2 border-[var(--dark-gray)]",
            isOnline ? "bg-green-500" : "bg-gray-500"
          )}
        />
      )}
    </div>
  );
}

// =============================================================================
// AVATAR GROUP
// =============================================================================

interface AvatarGroupProps {
  avatars: Array<{
    src?: string | null;
    name: string;
  }>;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({ avatars, max = 4, size = "sm", className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;
  const { container, text } = sizeStyles[size];

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          size={size}
          className="ring-2 ring-[var(--dark-gray)]"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            container,
            "rounded-full flex items-center justify-center font-medium",
            "bg-[var(--deep-space)] text-[var(--light-gray)]",
            "ring-2 ring-[var(--dark-gray)]"
          )}
        >
          <span className={text}>+{remaining}</span>
        </div>
      )}
    </div>
  );
}
