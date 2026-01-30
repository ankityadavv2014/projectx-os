# ProjectX OS — Development Backlog

> Tracked items for building ProjectX from Stage 0 to Global Platform.
> Reference: `/docs/NORTH-STAR.md` for ideal state.

**Last Updated:** 2026-01-30  
**Current Stage:** Stage 0 (Cyberpunk OS Website)

---

## Legend
- 🔴 **Critical** — Blocks ship
- 🟡 **High** — Important for engagement
- 🟢 **Medium** — Nice to have
- ⚪ **Low** — Future consideration

---

## Stage 0: Cyberpunk OS Website (CURRENT)

### 🔴 Critical — Must Ship

| ID | Task | Status | Assignee |
|----|------|--------|----------|
| S0-001 | Landing page with Hero, Manifesto, Trailer, Enter OS | ✅ Done | — |
| S0-002 | Desktop OS mode with window management | ✅ Done | — |
| S0-003 | XP/Level system with persistence | ✅ Done | — |
| S0-004 | Missions app with tracking | ✅ Done | — |
| S0-005 | AI Orb component (stub) | ✅ Done | — |
| S0-006 | Easter eggs (Konami code) | ✅ Done | — |
| S0-007 | Security headers configured | ✅ Done | — |
| S0-008 | Responsive mobile experience | 🔲 Todo | pilot |
| S0-009 | Waitlist/demo signup form | 🔲 Todo | pilot |
| S0-010 | SEO metadata + Open Graph | 🔲 Todo | pilot |

### 🟡 High — Engagement

| ID | Task | Status | Assignee |
|----|------|--------|----------|
| S0-011 | Start menu with app search | 🔲 Todo | pilot |
| S0-012 | Mission completion flow (submit artifact) | 🔲 Todo | pilot |
| S0-013 | Level up celebration animation | 🔲 Todo | pilot |
| S0-014 | Sound effects (toggle) | 🔲 Todo | pilot |
| S0-015 | Keyboard shortcuts (Cmd+K for Orb) | 🔲 Todo | pilot |
| S0-016 | Projects app with sample portfolio | 🔲 Todo | pilot |
| S0-017 | Settings app (theme, sound, reset XP) | 🔲 Todo | pilot |
| S0-018 | Terminal app with commands | 🔲 Todo | pilot |

### 🟢 Medium — Polish

| ID | Task | Status | Assignee |
|----|------|--------|----------|
| S0-019 | Window drag and resize | 🔲 Todo | pilot |
| S0-020 | Particle field optimization | 🔲 Todo | pilot |
| S0-021 | Loading skeleton screens | 🔲 Todo | pilot |
| S0-022 | 404 page with cyberpunk theme | 🔲 Todo | pilot |
| S0-023 | Global map widget placeholder | 🔲 Todo | pilot |

---

## Stage 1: MVP Portal (Single Tenant)

### Platform Foundation

| ID | Task | Status | Priority |
|----|------|--------|----------|
| S1-001 | TypeScript entity types for all core entities | 🔲 Todo | 🔴 |
| S1-002 | Zustand stores for User, Organization, Cohort | 🔲 Todo | 🔴 |
| S1-003 | Role-based routing (/learner, /educator, /admin) | 🔲 Todo | 🔴 |
| S1-004 | JSON content system for missions/kits | 🔲 Todo | 🔴 |
| S1-005 | Artifact upload component (local/mock) | 🔲 Todo | 🟡 |
| S1-006 | Portfolio page with artifacts | 🔲 Todo | 🟡 |

### Admin Panel

| ID | Task | Status | Priority |
|----|------|--------|----------|
| S1-007 | Admin layout + navigation | 🔲 Todo | 🔴 |
| S1-008 | Mission editor (CRUD) | 🔲 Todo | 🔴 |
| S1-009 | Kit editor (CRUD) | 🔲 Todo | 🟡 |
| S1-010 | User management table | 🔲 Todo | 🟡 |
| S1-011 | Cohort management | 🔲 Todo | 🟡 |

---

## Stage 2: Multi-Role + Cohorts

| ID | Task | Status | Priority |
|----|------|--------|----------|
| S2-001 | RBAC permission system | 🔲 Todo | 🔴 |
| S2-002 | Educator dashboard | 🔲 Todo | 🔴 |
| S2-003 | Facilitator assignment flow | 🔲 Todo | 🟡 |
| S2-004 | Rubric builder | 🔲 Todo | 🟡 |
| S2-005 | Submission review workflow | 🔲 Todo | 🔴 |
| S2-006 | Cohort progress dashboard | 🔲 Todo | 🟡 |
| S2-007 | Parent dashboard | 🔲 Todo | 🟢 |

---

## Stage 3: Multi-Tenant Global

| ID | Task | Status | Priority |
|----|------|--------|----------|
| S3-001 | Database setup (Postgres + Prisma) | 🔲 Todo | 🔴 |
| S3-002 | Multi-tenant data isolation | 🔲 Todo | 🔴 |
| S3-003 | Organization onboarding flow | 🔲 Todo | 🔴 |
| S3-004 | Regional deployment config | 🔲 Todo | 🟡 |
| S3-005 | Analytics dashboard | 🔲 Todo | 🟡 |
| S3-006 | Billing/procurement integration | 🔲 Todo | 🟢 |

---

## Stage 4: Earn Layer (Project eXcel)

| ID | Task | Status | Priority |
|----|------|--------|----------|
| S4-001 | Opportunity entity + API | 🔲 Todo | 🔴 |
| S4-002 | Opportunity marketplace UI | 🔲 Todo | 🔴 |
| S4-003 | Match algorithm | 🔲 Todo | 🟡 |
| S4-004 | Verified credentials export | 🔲 Todo | 🟡 |
| S4-005 | Work simulation framework | 🔲 Todo | 🟢 |

---

## Stage 5: eXpand (Global Scaling)

| ID | Task | Status | Priority |
|----|------|--------|----------|
| S5-001 | Territory rollout playbook | 🔲 Todo | 🟡 |
| S5-002 | Partner onboarding portal | 🔲 Todo | 🟡 |
| S5-003 | Facilitator training content | 🔲 Todo | 🟢 |
| S5-004 | QA audit system | 🔲 Todo | 🟢 |
| S5-005 | Localization framework | 🔲 Todo | 🟢 |

---

## Technical Debt & Infrastructure

| ID | Task | Status | Priority |
|----|------|--------|----------|
| TD-001 | E2E tests with Playwright | 🔲 Todo | 🟡 |
| TD-002 | CI/CD pipeline (GitHub Actions) | 🔲 Todo | 🔴 |
| TD-003 | Error boundary components | 🔲 Todo | 🟡 |
| TD-004 | Performance monitoring | 🔲 Todo | 🟢 |
| TD-005 | Content Security Policy | 🔲 Todo | 🟡 |
| TD-006 | Audit logging design | 🔲 Todo | 🟢 |
| TD-007 | Upload sanitization | 🔲 Todo | 🟡 |

---

## Analytics & Events

| ID | Task | Status | Priority |
|----|------|--------|----------|
| AN-001 | Event schema definition | 🔲 Todo | 🟡 |
| AN-002 | XP event tracking | 🔲 Todo | 🟡 |
| AN-003 | Mission completion events | 🔲 Todo | 🟡 |
| AN-004 | Conversion tracking | 🔲 Todo | 🟡 |
| AN-005 | Analytics dashboard v1 | 🔲 Todo | 🟢 |

---

## How to Add Items

1. Create a new row in the appropriate stage section
2. Use format: `S{stage}-{number}` for ID
3. Set status: `🔲 Todo`, `🔄 In Progress`, `✅ Done`
4. Assign to `pilot` for autonomous work

---

## Pilot Integration

Issues labeled `pilot` in GitHub will be automatically picked up.
To assign work to Pilot:
1. Create GitHub issue with `pilot` label
2. Reference backlog ID in issue title
3. Pilot will create branch, implement, and open PR

**Current Pilot Config:** `abhishekyadav2000/projectx-os`
