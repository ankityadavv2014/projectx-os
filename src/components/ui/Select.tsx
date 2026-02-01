"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// =============================================================================
// SELECT
// =============================================================================

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("w-full", className)} ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "w-full px-4 py-3 rounded-lg text-left",
            "bg-[var(--dark-gray)] border border-white/10",
            "text-white",
            "focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)] focus:border-transparent",
            "transition-all duration-200",
            "flex items-center justify-between gap-2",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-red-500",
            !disabled && "cursor-pointer"
          )}
          disabled={disabled}
        >
          <span className={cn(!selectedOption && "text-[var(--light-gray)]/40")}>
            {selectedOption ? (
              <span className="flex items-center gap-2">
                {selectedOption.icon}
                {selectedOption.label}
              </span>
            ) : (
              placeholder
            )}
          </span>
          <svg
            className={cn(
              "w-5 h-5 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute z-50 w-full mt-2 rounded-lg overflow-hidden",
                "bg-[var(--dark-gray)] border border-white/10",
                "shadow-xl shadow-black/30",
                "max-h-60 overflow-y-auto"
              )}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    if (!option.disabled) {
                      onChange(option.value);
                      setIsOpen(false);
                    }
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-left",
                    "flex items-center gap-3",
                    "hover:bg-white/5 transition-colors",
                    option.value === value && "bg-[var(--neon-blue)]/10 text-[var(--neon-blue)]",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={option.disabled}
                >
                  {option.icon && <span>{option.icon}</span>}
                  <div className="flex-1">
                    <div className="text-white">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-[var(--light-gray)]/60">
                        {option.description}
                      </div>
                    )}
                  </div>
                  {option.value === value && (
                    <svg className="w-5 h-5 text-[var(--neon-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

// =============================================================================
// MULTI-SELECT
// =============================================================================

interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options",
  label,
  error,
  disabled = false,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedOptions = options.filter((o) => value.includes(o.value));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <div className={cn("w-full", className)} ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-[var(--light-gray)] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "w-full px-4 py-3 rounded-lg text-left min-h-[48px]",
            "bg-[var(--dark-gray)] border border-white/10",
            "text-white",
            "focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)] focus:border-transparent",
            "transition-all duration-200",
            "flex items-center justify-between gap-2 flex-wrap",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-red-500",
            !disabled && "cursor-pointer"
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1.5 flex-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--neon-blue)]/20 text-[var(--neon-blue)] rounded text-sm"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => removeOption(option.value, e)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-[var(--light-gray)]/40">{placeholder}</span>
            )}
          </div>
          <svg
            className={cn(
              "w-5 h-5 flex-shrink-0 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute z-50 w-full mt-2 rounded-lg overflow-hidden",
                "bg-[var(--dark-gray)] border border-white/10",
                "shadow-xl shadow-black/30",
                "max-h-60 overflow-y-auto"
              )}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && toggleOption(option.value)}
                  className={cn(
                    "w-full px-4 py-3 text-left",
                    "flex items-center gap-3",
                    "hover:bg-white/5 transition-colors",
                    value.includes(option.value) && "bg-[var(--neon-blue)]/10",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={option.disabled}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center",
                      value.includes(option.value)
                        ? "bg-[var(--neon-blue)] border-[var(--neon-blue)]"
                        : "border-white/30"
                    )}
                  >
                    {value.includes(option.value) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-[var(--light-gray)]/60">
                        {option.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
