# ProjectX OS - Architecture Document

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        ProjectX OS                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐     ┌─────────────────┐                    │
│  │  Landing World  │────▶│    OS World     │                    │
│  │  (Scroll Site)  │     │   (Desktop)     │                    │
│  └─────────────────┘     └─────────────────┘                    │
│           │                       │                              │
│           ▼                       ▼                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Shared Services                           ││
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        ││
│  │  │   XP    │  │  State  │  │   AI    │  │ Easter  │        ││
│  │  │ System  │  │ (Zustand)│ │   Orb   │  │  Eggs   │        ││
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘        ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── app/
│   ├── (landing)/           # Landing World routes
│   │   ├── page.tsx         # Hero + Manifesto + Trailer
│   │   └── layout.tsx
│   ├── (os)/                # OS World routes
│   │   ├── desktop/
│   │   │   └── page.tsx     # Desktop experience
│   │   └── layout.tsx
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── GlowText.tsx
│   │   └── ParticleField.tsx
│   ├── landing/             # Landing page components
│   │   ├── Hero.tsx
│   │   ├── Manifesto.tsx
│   │   ├── Trailer.tsx
│   │   └── EnterOS.tsx
│   ├── os/                  # OS components
│   │   ├── Desktop.tsx
│   │   ├── Dock.tsx
│   │   ├── StartMenu.tsx
│   │   ├── Window.tsx
│   │   └── Taskbar.tsx
│   ├── orb/                 # AI Orb components
│   │   ├── Orb.tsx
│   │   ├── OrbOverlay.tsx
│   │   └── OrbSearch.tsx
│   └── xp/                  # XP system components
│       ├── XPBar.tsx
│       ├── XPPopup.tsx
│       └── LevelBadge.tsx
├── stores/                  # Zustand stores
│   ├── xp-store.ts
│   ├── os-store.ts
│   └── orb-store.ts
├── hooks/                   # Custom hooks
│   ├── useXP.ts
│   ├── useEasterEggs.ts
│   └── useKeyboardShortcuts.ts
├── lib/                     # Utilities
│   ├── constants.ts
│   ├── animations.ts
│   └── utils.ts
└── providers/               # LLM provider stubs
    ├── llm-stub.ts
    └── orb-provider.ts

agents/                      # Agent system (outside src)
├── factory/
│   └── agent-factory.ts     # Agent Factory CLI
├── prompts/
│   ├── pmo.md
│   ├── product-manager.md
│   ├── creative-director.md
│   ├── ux-architect.md
│   ├── frontend-lead.md
│   ├── backend-lead.md
│   ├── ai-agent-engineer.md
│   ├── security-engineer.md
│   ├── qa-engineer.md
│   └── devops.md
└── templates/
    └── agent-template.md

docs/
├── PRD.md
├── ARCHITECTURE.md
├── UX_SPEC.md
└── SECURITY.md

tests/
├── e2e/
│   ├── landing.spec.ts
│   ├── os-mode.spec.ts
│   └── xp-system.spec.ts
└── playwright.config.ts
```

## Data Flow

### XP System Flow
```
User Action → XP Store → localStorage → UI Update → Level Check → Reward
```

### OS Window Management
```
Window Open → Window Store → Z-index Update → Render Stack → Focus Handler
```

### AI Orb Flow
```
User Input → Orb Store → LLM Stub → Response → Animation → Display
```

## State Management

Using Zustand for lightweight, performant state:

1. **XP Store**: User XP, level, missions completed
2. **OS Store**: Windows, dock items, desktop state
3. **Orb Store**: Orb visibility, conversation history

## Performance Considerations

- Route prefetching for OS Mode
- Image optimization with next/image
- Dynamic imports for heavy components
- CSS containment for animations
- Virtual scrolling for lists

---

*Document maintained by AI/Agent Engineer*
