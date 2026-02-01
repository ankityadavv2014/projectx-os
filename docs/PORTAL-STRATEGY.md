# ProjectX Portal Strategy

> Subdomain architecture for the ProjectX ecosystem

## Overview

ProjectX operates as a multi-portal ecosystem, with each portal representing a phase in the human evolution journey. The company umbrella site serves as the gateway.

## Domain Architecture

### 🌐 Company Umbrella: `www.theprojectx.co`

The main company site containing brand, story, trust, and portal gateway content.

**Purpose:**
- Establish brand identity and trust
- Tell the ProjectX story
- Provide entry points to all portals
- Host company information (about, careers, legal)

**Pages:**
| Route | Purpose |
|-------|---------|
| `/` | Homepage - hero, manifesto teaser, persona pathways |
| `/about` | Company story, team, mission |
| `/manifesto` | Full manifesto - why we exist |
| `/vision` | Roadmap and future plans |
| `/partners` | Partnership opportunities |
| `/careers` | Job openings |
| `/contact` | Contact form |
| `/legal` | Privacy policy, terms of service |

---

### 🧠 Project eXperience: `experience.theprojectx.co` (Currently: `/os`, `/student`, `/teacher`, etc.)

The first user-facing product - the learning phase.

**Purpose:**
- Primary learning experience
- Mission-based skill building
- AI mentorship
- Portfolio development

**Target Users:**
- Students (learners)
- Teachers (facilitators)
- Parents (supporters)
- Schools (administrators)

**Pages:**
| Route | Purpose |
|-------|---------|
| `/os` | Main OS desktop interface |
| `/student` | Student dashboard |
| `/teacher` | Teacher cohort management |
| `/parent` | Parent progress tracking |
| `/admin` | School/admin dashboard |
| `/mission/[id]` | Individual mission pages |
| `/review` | Submission review interface |

---

### 🧪 Project eXperiment: `experiment.theprojectx.co` (Currently: `/experiment`)

The work phase - applying skills to real projects.

**Status:** 🔒 LOCKED (Phase 2)

**Unlock Requirements:**
- Complete 10 missions in eXperience
- Earn 5,000 XP
- Build portfolio with 5+ artifacts
- Receive mentor approval

**Future Pages:**
- Project marketplace
- Team collaboration
- Mentor matching
- Portfolio builder

---

### 💰 Project eXcel: `excel.theprojectx.co` (Currently: `/excel`)

The earn phase - monetizing skills.

**Status:** 🔒 LOCKED (Phase 3)

**Unlock Requirements:**
- Graduate from eXperiment
- Verified skill portfolio
- Industry endorsements
- Skill assessments passed

**Future Pages:**
- Freelance opportunities
- Job board
- Income tracking
- Career guidance

---

### 🚀 Project eXpand: `expand.theprojectx.co` (Currently: `/expand`)

The invent phase - leading and scaling.

**Status:** 🔒 LOCKED (Phase 4)

**Unlock Requirements:**
- Sustainable income from eXcel
- Mentored 5+ learners
- Leadership track completion
- Community contribution

**Future Pages:**
- Startup incubator
- Facilitator certification
- Community chapters
- Global programs

---

## Migration Path

Currently, all content is served from a single Next.js app at `www.theprojectx.co`. The subdomain strategy can be implemented gradually:

### Phase 1 (Current)
- All content on main domain
- Routes prefixed as needed (`/os`, `/student`, etc.)
- Placeholder pages for future portals

### Phase 2 (Q2 2026)
- Deploy eXperience as subdomain
- Redirect `/os`, `/student`, etc. to `experience.theprojectx.co`
- Main site becomes pure company portal

### Phase 3 (Q3 2026)
- Deploy eXperiment subdomain as features are built
- Graduation flow connects portals

### Phase 4+ (2027)
- eXcel and eXpand subdomains
- Full portal ecosystem

---

## Technical Considerations

### Authentication
- Shared auth across all subdomains
- Single sign-on (SSO) with session cookies
- JWT tokens valid across `*.theprojectx.co`

### Navigation
- Each portal has its own navigation
- "Portal switcher" in header for cross-portal navigation
- Deep links work across subdomains

### Data
- Shared user database
- Phase progress stored centrally
- Portal-specific data isolated

### Analytics
- Unified analytics across all portals
- Funnel tracking for phase progression
- Cohort analysis by graduation status
