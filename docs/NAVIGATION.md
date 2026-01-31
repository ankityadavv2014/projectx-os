# ProjectX OS Navigation System

> **Zero Dead Ends.** Every page provides: Back, Home, Next, Close, and Command Palette.

## Navigation Contract

All pages in ProjectX OS must follow these rules:

1. **Back Button** - Always available (routes to parent or browser history)
2. **Home/Hub Access** - Logo always links to `/`, keyboard `H` goes home
3. **Next Recommendation** - Every page suggests a logical next step
4. **Close to OS** - X button and `Esc` key always return to `/os`
5. **Command Palette** - `Cmd/Ctrl+K` opens global navigation anywhere

## Route Map

| Path | Label | Parent | Next | Close |
|------|-------|--------|------|-------|
| `/` | Home | - | `/os` | No |
| `/os` | Experience OS | `/` | `/student` | No |
| `/student` | Student Dashboard | `/os` | `/mission/1` | Yes |
| `/teacher` | Teacher Dashboard | `/os` | `/review` | Yes |
| `/parent` | Parent Dashboard | `/os` | `/student` | Yes |
| `/admin` | Admin Panel | `/os` | `/teacher` | Yes |
| `/review` | Review Submissions | `/teacher` | `/teacher` | Yes |
| `/desktop` | Desktop View | `/os` | `/os` | Yes |
| `/mission/[id]` | Mission (dynamic) | `/student` | `/student` | Yes |

## Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Esc` | Return to `/os` | Any page except Home/OS |
| `Cmd/Ctrl+K` | Open Command Palette | Global |
| `Alt+←` | Go Back | Global |
| `E` | Enter OS | Home page only |
| `H` | Go Home | Global (not in inputs) |

## Component Architecture

### AppShell (`/components/shell/AppShell.tsx`)
Wraps all pages. Provides:
- TopBar component
- Command Palette portal
- Return to OS FAB
- Keyboard shortcut listeners
- Recent route tracking

### TopBar (`/components/shell/TopBar.tsx`)
Fixed header with:
- Logo → Home link
- Breadcrumb trail (desktop)
- Current page label (mobile)
- Back button (if parent exists)
- Next button with label
- Command Palette trigger
- Close button (X to `/os`)

### Command Palette (`/components/command/CommandPalette.tsx`)
Modal with:
- Search input
- Recent routes section
- Quick actions (Enter OS, Back, Home)
- All navigable routes
- Keyboard navigation (↑↓ Enter Esc)

### Return to OS FAB (`/components/nav/ReturnToOSFab.tsx`)
Floating button (bottom-right):
- Visible on all pages except Home and OS
- Pulsing orb animation
- Shows `Esc` shortcut hint

## Adding a New Page

When adding a new page to ProjectX OS:

### 1. Add to Route Map
Edit `/lib/nav/routeMap.ts`:

```typescript
'/your-page': {
  path: '/your-page',
  label: 'Your Page',
  parent: '/os',           // Where back goes
  next: '/next-page',      // Suggested next
  nextLabel: 'Next Action',
  showClose: true,         // Show X button
  showInPalette: true,     // Include in Cmd+K
  icon: '🎯',              // Emoji for palette
},
```

### 2. No Extra Work Needed
The page automatically gets:
- ✅ TopBar with all navigation
- ✅ Breadcrumbs based on parent chain
- ✅ Keyboard shortcuts
- ✅ Command Palette access
- ✅ Return to OS FAB
- ✅ Recent route tracking

### 3. Dynamic Routes
For routes with parameters like `/mission/[id]`, add pattern handling in `getRouteConfig()`:

```typescript
if (pathname.startsWith('/your-pattern/')) {
  const param = pathname.split('/')[2];
  return {
    path: pathname,
    label: `Your Page ${param}`,
    parent: '/parent-page',
    next: '/parent-page',
    // ... rest
  };
}
```

## Accessibility

- Skip link available for keyboard users
- All buttons have proper titles
- Reduced motion preference respected
- Focus management in Command Palette
- ARIA labels on interactive elements

## Mobile Considerations

- TopBar collapses breadcrumbs on mobile
- FAB doesn't block bottom navigation areas
- Command Palette is touch-friendly
- Responsive padding and sizing

## Testing Requirements

New pages must verify:
1. TopBar appears with correct breadcrumbs
2. Back button routes to parent
3. Close button routes to `/os`
4. `Esc` key returns to `/os`
5. `Cmd+K` opens Command Palette
6. Page appears in palette search results
