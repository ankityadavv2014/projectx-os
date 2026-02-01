# ProjectX Experience Portal Sitemap

> Full sitemap for the Project eXperience portal

## Route Structure

```
/
├── Company Pages (www.theprojectx.co)
│   ├── / (Homepage)
│   ├── /about
│   ├── /manifesto
│   ├── /vision
│   ├── /partners
│   ├── /careers
│   ├── /contact
│   ├── /legal
│   └── /school
│
├── Experience Portal (/os ecosystem)
│   ├── /os (Main OS Desktop)
│   │
│   ├── Student Routes
│   │   ├── /student (Dashboard)
│   │   ├── /student/onboarding
│   │   ├── /student/missions
│   │   ├── /student/portfolio
│   │   ├── /student/xp
│   │   ├── /student/graduation
│   │   └── /mission/[id] (Mission Detail)
│   │
│   ├── Teacher Routes
│   │   ├── /teacher (Dashboard)
│   │   ├── /teacher/cohorts
│   │   ├── /teacher/assignments
│   │   ├── /teacher/analytics
│   │   ├── /teacher/resources
│   │   └── /review (Submission Review)
│   │
│   ├── Parent Routes
│   │   ├── /parent (Dashboard)
│   │   ├── /parent/progress
│   │   ├── /parent/artifacts
│   │   ├── /parent/achievements
│   │   └── /parent/link
│   │
│   └── Admin Routes
│       ├── /admin (Dashboard)
│       ├── /admin/teachers
│       ├── /admin/cohorts
│       ├── /admin/analytics
│       └── /admin/reports
│
├── Portal Gateways (Locked)
│   ├── /experiment (eXperiment - Phase 2)
│   ├── /excel (eXcel - Phase 3)
│   └── /expand (eXpand - Phase 4)
│
└── System Pages
    ├── /404 (Not Found)
    ├── /access-denied
    └── /unlock-required
```

## Page Details

### Homepage (`/`)
- Hero section with tagline
- Manifesto teaser
- Phase journey visualization
- Persona pathway cards
- Social proof / stats
- Final CTA

### OS Desktop (`/os`)
- Main hub for all personas
- App grid / dock
- Quick actions
- Status indicators
- Command palette trigger

### Student Dashboard (`/student`)
- Current mission card
- XP progress bar
- Badge collection
- Next recommended action
- Quick links to portfolio, missions

### Mission Detail (`/mission/[id]`)
- Mission objectives
- Requirements list
- Resource links
- Artifact submission form
- Progress tracker
- AI Mentor integration

### Teacher Dashboard (`/teacher`)
- Cohort overview cards
- Pending reviews count
- Recent submissions feed
- Quick analytics
- Assignment tools

### Review Page (`/review`)
- Submission queue
- Rubric scoring interface
- Feedback form
- Approval/revision actions
- Batch operations

### Parent Dashboard (`/parent`)
- Child progress overview
- Recent achievements
- Mission timeline
- Notification center
- Support resources

### Admin Dashboard (`/admin`)
- School metrics
- Teacher management
- Cohort controls
- Analytics widgets
- Report generation

## Navigation Patterns

### Global Navigation (TopBar)
- Present on all pages except `/`
- Logo → Home
- Breadcrumbs → Parent chain
- Back → Parent route
- Next → Recommended action
- Close → Return to `/os`

### Persona-Specific Nav
- Student: Missions, Portfolio, XP, Graduation
- Teacher: Cohorts, Assignments, Review, Resources
- Parent: Progress, Artifacts, Achievements, Link
- Admin: Dashboard, Teachers, Cohorts, Reports

### Cross-Portal Links
- Portal switcher in header
- Graduation status shows next portal
- Locked portals show requirements
