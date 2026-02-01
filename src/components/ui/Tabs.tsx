"use client";

import { useState, createContext, useContext } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// =============================================================================
// TABS CONTEXT
// =============================================================================

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab components must be used within a Tabs component");
  }
  return context;
}

// =============================================================================
// TABS ROOT
// =============================================================================

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value ?? internalValue;

  const setActiveTab = (tab: string) => {
    if (value === undefined) {
      setInternalValue(tab);
    }
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// =============================================================================
// TABS LIST
// =============================================================================

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export function TabsList({ children, className, variant = "default" }: TabsListProps) {
  const variantStyles = {
    default: "bg-[var(--dark-gray)] p-1 rounded-lg",
    pills: "gap-2",
    underline: "border-b border-white/10 gap-4",
  };

  return (
    <div
      className={cn(
        "flex items-center",
        variantStyles[variant],
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

// =============================================================================
// TABS TRIGGER
// =============================================================================

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function TabsTrigger({
  value,
  children,
  className,
  disabled = false,
  icon,
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        "relative px-4 py-2 text-sm font-medium rounded-md transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-blue)]",
        "flex items-center gap-2",
        isActive
          ? "text-white"
          : "text-[var(--light-gray)] hover:text-white",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-tab"
          className="absolute inset-0 bg-[var(--neon-blue)]/20 rounded-md"
          transition={{ type: "spring", duration: 0.3 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
}

// =============================================================================
// TABS CONTENT
// =============================================================================

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabs();

  if (activeTab !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      role="tabpanel"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// =============================================================================
// SIMPLE TABS (All-in-one)
// =============================================================================

interface SimpleTabsProps {
  tabs: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }>;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function SimpleTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
}: SimpleTabsProps) {
  const initialValue = defaultValue || tabs[0]?.value || "";

  return (
    <Tabs
      defaultValue={initialValue}
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      <TabsList className="mb-6">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} icon={tab.icon}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
