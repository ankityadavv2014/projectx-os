# ProjectX OS - UX Specification

## User Flows

### Primary Flow: First-Time Visitor
```
Land on Hero → Scroll Manifesto → Watch Trailer → Enter OS Mode → Explore Desktop → Discover Features → Earn XP
```

### Secondary Flow: Returning Visitor
```
Land (XP Restored) → Quick Enter OS → Continue Missions → Level Up
```

## Interaction Patterns

### Landing World

#### Hero Section
- **Animation**: Cinematic fade-in with particle burst
- **CTA**: Glowing "Enter the Experience" button
- **Scroll indicator**: Animated chevron

#### Manifesto Section
- **Reveal**: Text reveals on scroll (staggered)
- **Highlight**: Key phrases glow on hover
- **Quote blocks**: Float with parallax effect

#### Trailer Section
- **Embed**: 16:9 video player
- **Fallback**: Static image with play overlay
- **Autoplay**: Only on user interaction

### OS World

#### Desktop
- **Grid**: 64px icon grid
- **Wallpaper**: Animated gradient/particles
- **Double-click**: Open application window

#### Dock
- **Position**: Bottom center
- **Animation**: Magnify on hover (macOS style)
- **Items**: About, Projects, Contact, AI Orb, Settings

#### Windows
- **Draggable**: Title bar drag
- **Resizable**: Corner/edge handles
- **Stack**: Z-index management
- **Animations**: Scale + fade open/close

#### Start Menu
- **Trigger**: Click start button or keyboard shortcut
- **Search**: Filter applications
- **Recent**: Show recently opened

### AI Orb

#### Resting State
- **Position**: Fixed bottom-right
- **Animation**: Gentle pulse, particle orbit
- **Size**: 48px circle

#### Active State
- **Expansion**: Grows to search overlay
- **Input**: Text field with suggestions
- **Results**: Contextual responses

#### Interaction Cues
- **Hover**: Brighten + pulse faster
- **Click**: Expand with bounce
- **Dismiss**: Shrink with fade

## XP System UX

### XP Bar
- **Position**: Top-right corner
- **Fill animation**: Smooth progress
- **Overflow**: Level up celebration

### XP Popup
- **Trigger**: On XP gain
- **Animation**: Slide up + fade
- **Duration**: 2 seconds
- **Format**: "+50 XP - Discovered Easter Egg!"

### Level Badge
- **Display**: Next to username/XP bar
- **Tiers**: 
  - Level 1-5: Bronze
  - Level 6-10: Silver
  - Level 11-15: Gold
  - Level 16-20: Platinum
  - Level 21+: Diamond

## Missions

1. **Explorer**: Visit all sections (100 XP)
2. **Trailer Watcher**: Complete trailer (75 XP)
3. **OS Pioneer**: Enter OS Mode first time (150 XP)
4. **Secret Finder**: Discover easter egg (200 XP)

## Easter Eggs

### Konami Code
- **Trigger**: ↑↑↓↓←→←→BA
- **Effect**: Matrix rain + secret message
- **XP**: +200

### Console Message
- **Trigger**: Open DevTools
- **Effect**: ASCII art + recruitment message

### Hidden Click
- **Trigger**: Click logo 7 times
- **Effect**: Glitch animation + secret

## Responsive Breakpoints

```
Mobile:  < 640px  - Simplified, touch-optimized
Tablet:  640-1024px - Hybrid layout
Desktop: > 1024px - Full experience
```

## Accessibility

- **Focus indicators**: Visible on all interactive elements
- **Skip links**: Skip to main content
- **ARIA labels**: All icons and interactive elements
- **Color contrast**: WCAG AA minimum
- **Reduced motion**: Respect user preference
- **Keyboard nav**: Full keyboard accessibility

---

*Document maintained by UX Architect Agent*
