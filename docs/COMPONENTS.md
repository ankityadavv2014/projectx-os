# ProjectX OS — Component Library

> **Version**: 1.0.0  
> **Last Updated**: January 30, 2026

## Overview

This document catalogs all UI components in ProjectX OS, their props, variants, and usage guidelines.

---

## 1. Design Tokens

### Colors
```typescript
const colors = {
  // Brand
  deepSpace: '#0a0a0f',      // Primary background
  moltenOrange: '#ff6b35',   // Primary accent
  neonBlue: '#00d4ff',       // Secondary accent
  sacredGold: '#ffd700',     // Achievement/XP
  
  // Semantic
  success: '#00ff88',
  warning: '#ffaa00',
  error: '#ff4444',
  
  // Neutrals
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  }
}
```

### Typography
```typescript
const typography = {
  fontFamily: {
    display: 'Orbitron, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  }
}
```

### Spacing
```typescript
const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
}
```

---

## 2. Core Components

### Button

**Location**: `src/components/ui/Button.tsx`

**Variants**:
- `primary` - Molten orange, main CTA
- `secondary` - Outlined, subtle actions
- `ghost` - Text only, minimal
- `danger` - Red, destructive actions

**Sizes**:
- `sm` - 32px height
- `md` - 40px height (default)
- `lg` - 48px height

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Usage**:
```tsx
<Button variant="primary" size="lg" leftIcon={<RocketIcon />}>
  Launch Mission
</Button>
```

---

### Card

**Location**: `src/components/ui/Card.tsx`

**Variants**:
- `default` - Standard card with border
- `elevated` - With shadow/glow
- `interactive` - Hover effects

**Props**:
```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Usage**:
```tsx
<Card variant="interactive" padding="md" onClick={handleClick}>
  <h3>Mission Title</h3>
  <p>Description...</p>
</Card>
```

---

### GlowText

**Location**: `src/components/ui/GlowText.tsx`

**Purpose**: Animated glowing text for emphasis

**Props**:
```typescript
interface GlowTextProps {
  children: React.ReactNode;
  color?: 'orange' | 'blue' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}
```

**Usage**:
```tsx
<GlowText color="orange" size="xl">
  LEVEL UP!
</GlowText>
```

---

### ParticleField

**Location**: `src/components/ui/ParticleField.tsx`

**Purpose**: Background particle animation

**Props**:
```typescript
interface ParticleFieldProps {
  density?: 'low' | 'medium' | 'high';
  color?: string;
  speed?: number;
  interactive?: boolean;
}
```

**Usage**:
```tsx
<ParticleField density="medium" color="#ff6b35" interactive />
```

---

## 3. Layout Components

### TopBar

**Location**: `src/components/os/TopBar.tsx`

**Purpose**: OS top navigation bar

**Props**:
```typescript
interface TopBarProps {
  showXP?: boolean;
  showSettings?: boolean;
  onOrbClick?: () => void;
}
```

---

### Dock

**Location**: `src/components/os/Dock.tsx`

**Purpose**: macOS-style application dock

**Props**:
```typescript
interface DockProps {
  apps: DockApp[];
  position?: 'bottom' | 'left' | 'right';
}

interface DockApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  badge?: number;
  onClick: () => void;
}
```

---

### Window

**Location**: `src/components/os/Window.tsx`

**Purpose**: Draggable, resizable window container

**Props**:
```typescript
interface WindowProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  resizable?: boolean;
  minimizable?: boolean;
  maximizable?: boolean;
  closable?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}
```

---

## 4. Domain Components

### MissionCard

**Location**: `src/components/missions/MissionCard.tsx`

**Purpose**: Display mission summary

**Props**:
```typescript
interface MissionCardProps {
  mission: Mission;
  progress?: number;
  onClick?: () => void;
}
```

---

### XPBar

**Location**: `src/components/xp/XPBar.tsx`

**Purpose**: Display XP progress

**Props**:
```typescript
interface XPBarProps {
  current: number;
  required: number;
  level: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}
```

---

### BadgeDisplay

**Location**: `src/components/badges/BadgeDisplay.tsx`

**Purpose**: Show unlocked badges

**Props**:
```typescript
interface BadgeDisplayProps {
  badges: Badge[];
  layout?: 'grid' | 'list';
  onBadgeClick?: (badge: Badge) => void;
}
```

---

### SubmissionForm

**Location**: `src/components/submissions/SubmissionForm.tsx`

**Purpose**: Artifact submission interface

**Props**:
```typescript
interface SubmissionFormProps {
  missionId: string;
  onSubmit: (data: SubmissionData) => void;
  onCancel: () => void;
}
```

---

### RubricScorer

**Location**: `src/components/review/RubricScorer.tsx`

**Purpose**: Teacher scoring interface

**Props**:
```typescript
interface RubricScorerProps {
  rubric: Rubric;
  submission: Submission;
  onScore: (scores: RubricScores) => void;
  onApprove: () => void;
  onRequestRevision: () => void;
}
```

---

## 5. Orb Components

### Orb

**Location**: `src/components/orb/Orb.tsx`

**Purpose**: AI assistant floating orb

**Props**:
```typescript
interface OrbProps {
  state?: 'idle' | 'listening' | 'thinking' | 'speaking';
  minimized?: boolean;
  onClick?: () => void;
}
```

---

### OrbPanel

**Location**: `src/components/orb/OrbPanel.tsx`

**Purpose**: Expanded orb conversation panel

**Props**:
```typescript
interface OrbPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: OrbMessage[];
  onSend: (message: string) => void;
}
```

---

## 6. Landing Components

### Hero

**Location**: `src/components/landing/Hero.tsx`

**Purpose**: Landing page hero section

---

### Manifesto

**Location**: `src/components/landing/Manifesto.tsx`

**Purpose**: Vision statement section

---

### Trailer

**Location**: `src/components/landing/Trailer.tsx`

**Purpose**: Video/animation showcase

---

### EnterOS

**Location**: `src/components/landing/EnterOS.tsx`

**Purpose**: CTA to enter OS mode

---

## 7. Dashboard Components

### StatCard

**Location**: `src/components/dashboard/StatCard.tsx`

**Props**:
```typescript
interface StatCardProps {
  label: string;
  value: number | string;
  change?: number;
  icon?: React.ReactNode;
}
```

---

### ActivityFeed

**Location**: `src/components/dashboard/ActivityFeed.tsx`

**Props**:
```typescript
interface ActivityFeedProps {
  activities: Activity[];
  limit?: number;
}
```

---

### ProgressChart

**Location**: `src/components/dashboard/ProgressChart.tsx`

**Props**:
```typescript
interface ProgressChartProps {
  data: ProgressData[];
  type?: 'line' | 'bar' | 'area';
}
```

---

## 8. Form Components

### Input

**Location**: `src/components/forms/Input.tsx`

**Variants**: text, email, password, number

---

### TextArea

**Location**: `src/components/forms/TextArea.tsx`

---

### Select

**Location**: `src/components/forms/Select.tsx`

---

### FileUpload

**Location**: `src/components/forms/FileUpload.tsx`

---

### Toggle

**Location**: `src/components/forms/Toggle.tsx`

---

## 9. Feedback Components

### Toast

**Location**: `src/components/feedback/Toast.tsx`

**Usage**: Via `useToast()` hook

---

### Modal

**Location**: `src/components/feedback/Modal.tsx`

---

### Tooltip

**Location**: `src/components/feedback/Tooltip.tsx`

---

### Skeleton

**Location**: `src/components/feedback/Skeleton.tsx`

---

## 10. Animation Patterns

### Boot Sequence
- Duration: 2-3 seconds
- Elements: Logo pulse → particles → desktop fade in

### Level Up Celebration
- Duration: 1.5 seconds
- Elements: XP burst → badge reveal → confetti

### Window Transitions
- Open: scale 0.95 → 1, opacity 0 → 1
- Close: scale 1 → 0.95, opacity 1 → 0

### Mission Card Hover
- Scale: 1 → 1.02
- Shadow: Glow intensity increases
- Duration: 150ms

---

## 11. Accessibility Requirements

### All Components Must:
- Have visible focus states
- Support keyboard navigation
- Include ARIA labels where needed
- Respect reduced motion preferences
- Meet WCAG 2.1 AA contrast ratios

---

## 12. Testing Guidelines

### Each Component Needs:
- Unit tests for logic
- Snapshot tests for rendering
- Accessibility tests (axe)
- Visual regression tests (optional)

---

*This component library is the foundation of ProjectX OS UI. Maintain consistency across all features.*
