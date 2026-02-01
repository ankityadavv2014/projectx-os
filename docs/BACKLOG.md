# ProjectX OS — Development Backlog

> Tracked items for building ProjectX from Stage 0 to Global Platform.
> Reference: `/docs/NORTH-STAR.md` for ideal state.
> Reference: `/docs/INTEGRATION-STRATEGY.md` for open-source integrations.
> Reference: `/docs/GO-LIVE-SPEC.md` for Go-Live acceptance criteria.

**Last Updated:** 2026-01-31  
**Current Stage:** Go-Live Sprint (Mission Spine)

---

## Legend
- 🔴 **Critical** — Blocks ship
- 🟡 **High** — Important for engagement
- 🟢 **Medium** — Nice to have
- ⚪ **Low** — Future consideration

---

## 🚀 GO-LIVE SPRINT (Active)

> **Goal:** QR Scan → Mission → Submission → Teacher Review → Feedback/Approval → Student Progress
> **Timeline:** 3 weeks (Week 1: Spine, Week 2: Portals, Week 3: Scale)

### Week 1: Spine ✅ COMPLETE

| ID | Task | Status | Notes |
|----|------|--------|-------|
| GL-001 | Auth + RBAC + Tenant Scoping | ✅ Done | `/src/lib/auth/auth-service.ts`, `/src/lib/auth/rbac.ts` |
| GL-002 | Teacher Assignment System | ✅ Done | `TeacherAssignment` type, routing functions |
| GL-003 | Mission + QR Resolution | ✅ Done | `/src/lib/domain/mission-service.ts` |
| GL-004 | Submission Status Engine | ✅ Done | 7-state machine in `/src/lib/domain/submission-service.ts` |

### Week 2: Portals 🔄 IN PROGRESS

| ID | Task | Status | Notes |
|----|------|--------|-------|
| GL-005 | Student OS Portal | ✅ Done | `/src/app/student/page.tsx` - Teacher card, mission cards, status |
| GL-006 | Teacher Review Portal | ✅ Done | `/src/app/teacher/page.tsx` - Queue, students, actions |
| GL-007 | Secure Upload Vault | 🔄 WIP | Mock artifacts in place, need signed URL API |

### Week 3: Scale

| ID | Task | Status | Notes |
|----|------|--------|-------|
| GL-008 | Admin CSV Import | 🔲 Todo | Bulk user onboarding |
| GL-009 | Mission QR Generator | 🔲 Todo | QR code library integration |
| GL-010 | Audit Logging | 🔲 Todo | `SubmissionEvent` system ready, need API |
| GL-011 | Performance Testing | 🔲 Todo | 500 concurrent logins target |
| GL-012 | Deployment Hardening | 🔲 Todo | Rate limiting, error logging |

---

## Go-Live Data Model ✅ COMPLETE

**New Files Created:**
- `/src/types/go-live.ts` — Complete type definitions
- `/src/lib/auth/auth-service.ts` — Authentication with mock users
- `/src/lib/auth/rbac.ts` — Role-based access control
- `/src/lib/domain/submission-service.ts` — 7-state submission engine
- `/src/lib/domain/mission-service.ts` — Mission CRUD + QR support
- `/docs/GO-LIVE-SPEC.md` — CEO acceptance criteria

---

## Stage 0: Cyberpunk OS Website ✅ COMPLETE

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
| S0-008 | Responsive mobile experience | ✅ Done | — |
| S0-009 | AI Assistant with Ollama integration | ✅ Done | — |
| S0-010 | Mission step-by-step executor | ✅ Done | — |
| S0-011 | Auto-guided tour (non-overlapping) | ✅ Done | — |
| S0-012 | TV/Large display optimization | ✅ Done | — |
| S0-013 | Waitlist/demo signup form | 🔲 Todo | pilot |
| S0-014 | SEO metadata + Open Graph | 🔲 Todo | pilot |

### 🟡 High — Engagement

| ID | Task | Status | Assignee |
|----|------|--------|----------|
| S0-015 | Live AI responses (Ollama backend) | � WIP | pilot |
| S0-016 | Mission completion flow (submit artifact) | ✅ Done | — |
| S0-017 | Start menu with app search | 🔲 Todo | pilot |
| S0-018 | Level up celebration animation | 🔲 Todo | pilot |
| S0-019 | Sound effects (toggle) | 🔲 Todo | pilot |
| S0-020 | Keyboard shortcuts (Cmd+K for Orb) | 🔲 Todo | pilot |
| S0-021 | Projects app with sample portfolio | 🔲 Todo | pilot |
| S0-022 | Settings app (theme, sound, reset XP) | 🔲 Todo | pilot |
| S0-023 | Terminal app with commands | 🔲 Todo | pilot |

### 🟢 Medium — Polish

| ID | Task | Status | Assignee |
|----|------|--------|----------|
| S0-024 | Window drag and resize | 🔲 Todo | pilot |
| S0-025 | Particle field optimization | 🔲 Todo | pilot |
| S0-026 | Loading skeleton screens | 🔲 Todo | pilot |
| S0-027 | 404 page with cyberpunk theme | 🔲 Todo | pilot |
| S0-028 | Global map widget placeholder | 🔲 Todo | pilot |

---

## Stage 1: Integration Layer (NEXT)

### Open Source Integrations

| ID | System | Tool | Status | Priority |
|----|--------|------|--------|----------|
| I-001 | CMS | Strapi | 🔲 Todo | 🔴 Critical |
| I-002 | LLM | Ollama (local) | 🔄 WIP | 🔴 Critical |
| I-003 | LMS | Moodle/Open edX | 🔲 Todo | 🟡 High |
| I-004 | KMS | Outline/Wiki.js | 🔲 Todo | 🟢 Medium |
| I-005 | Analytics | Plausible/PostHog | 🔲 Todo | 🟡 High |
| I-006 | Notifications | Novu | 🔲 Todo | 🟢 Medium |
| I-007 | Community | Discourse | 🔲 Todo | 🟢 Medium |

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
