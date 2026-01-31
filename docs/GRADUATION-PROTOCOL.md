# PROJECTX GRADUATION PROTOCOL + UNLOCK RULES
## The Progression Engine of The ProjectX Co.
Version: 1.0 (North Star Spec)

---

ProjectX is not a flat platform.
It is a **human evolution ladder**.

Users do not "use features."
They **graduate through phases**:

1. **Project eXperience** — LEARN  
2. **Project eXperiment** — WORK  
3. **Project eXcel** — EARN  
4. **Project eXpand** — INVENT  

This document defines:
- When users unlock the next phase
- What must be proven
- What each phase guarantees
- What the system must enforce

---

## 0️⃣ Core Philosophy

### The future is not access.
### The future is progression.

ProjectX is designed so that:
- **Curiosity** becomes **capability**
- **Capability** becomes **contribution**
- **Contribution** becomes **earning**
- **Earning** becomes **invention and expansion**

**No skipping. No shortcuts. Only graduation.**

---

## 1️⃣ Phase 1 — Project eXperience (LEARN)

> *"Give humans a chance to experience the future today."*

### Purpose
Give learners, teachers, parents, schools the chance to experience the future.

### Entry
**Open to all.**

### What Happens Here
- Missions
- Kits
- First builds
- XP + exploration
- Portfolio begins
- Wonder is activated

### Allowed Actions
- Complete beginner missions
- Upload artifacts (proof of build)
- Earn XP + starter badges
- Join cohorts

### Not Allowed Yet
- ❌ Monetization
- ❌ Opportunity marketplace
- ❌ Advanced labs
- ❌ Public credential claims

---

### Graduation Requirements: eXperience → eXperiment

A learner graduates when they demonstrate:

| Requirement | Description | Target |
|------------|-------------|--------|
| **Minimum Proof of Build** | Complete missions | 5 missions |
| **Portfolio Artifacts** | Submit proof of work | 3 artifacts |
| **Explorer Badge** | Earn starter badge | 1 badge |
| **Learning Reflection** | "What did I build? Learn? What's next?" | 1 reflection |
| **Consistency Signal** | Active sessions | 3 sessions OR 7 days |

### Unlock Event
```
phase.unlocked.experiment
```

### Graduation Ceremony UI
A cinematic OS unlock:

> *"You have experienced the future.*  
> *Now you may experiment inside it."*

**Unlocks:**
- Sandbox Lab Access
- Collaboration Missions
- Work Simulation Tracks

---

## 2️⃣ Phase 2 — Project eXperiment (WORK)

> *"Let humans experiment, collaborate, and simulate real work."*

### Purpose
Turn learning into real-world work simulation.

### What Happens Here
- Team challenges
- Lab simulations
- Advanced kits
- Peer review
- AI mentor deeper mode

### Allowed Actions
- Join project teams
- Run experiments
- Build real prototypes
- Contribute to community tasks

### Not Allowed Yet
- ❌ Direct earning payouts
- ❌ Employer marketplace access
- ❌ Verified credentials beyond internal badges

---

### Graduation Requirements: eXperiment → eXcel

| Requirement | Description | Target |
|------------|-------------|--------|
| **Outcome Depth** | Complete work-grade projects | 3 projects |
| **Collaboration Proof** | Team simulation participation | 1 team |
| **Skill Verification** | Pass assessment/rubric check | 1 assessment |
| **Reputation Signal** | Maintain trust score baseline | 70+ score |

### Unlock Event
```
phase.unlocked.excel
```

### Graduation UI Moment
> *"You are no longer just learning.*  
> *You can now create value."*

**Unlocks:**
- Verified Credentials
- Opportunity Matching
- Earning Pathways

---

## 3️⃣ Phase 3 — Project eXcel (EARN)

> *"Turn capability into value."*

### Purpose
Convert capability into real-world value.

### What Happens Here
- Opportunity board (internships/gigs)
- Credential verification
- Portfolio becomes public-facing
- Schools/employers trust outcomes

### Allowed Actions
- Apply for opportunities
- Offer services/projects
- Earn rewards or payments (future)
- Gain verified badges

### System Enforcement
Everything must be:
- ✅ Auditable
- ✅ Permissioned
- ✅ Reputation-aware

---

### Graduation Requirements: eXcel → eXpand

| Requirement | Description | Target |
|------------|-------------|--------|
| **Real Impact** | Complete real opportunity | 1 opportunity |
| **Mentorship Signal** | Help junior learners | 1 mentee |
| **Leadership Proof** | Launch micro-initiative | 1 initiative |
| **Expansion Readiness** | Pass Partner Mode Review | Admin approval |

### Unlock Event
```
phase.unlocked.expand
```

### Graduation UI Moment
> *"You have earned.*  
> *Now you may invent and expand civilization."*

**Unlocks:**
- Partner Toolkit
- Territory Rollout Missions
- Innovation Grants (future)
- Creator-level authority

---

## 4️⃣ Phase 4 — Project eXpand (INVENT)

> *"Multiply impact across regions, cultures, and systems."*

### Purpose
Scale ProjectX through invention, partnerships, and global deployment.

**This is not for everyone. This is for builders of builders.**

### What Happens Here
- Launch hubs in new regions
- Create new kits and tracks
- Partner with institutions
- Build new economies

### Allowed Actions
- Become certified facilitator
- Deploy ProjectX locally
- Create new missions and kits
- Lead expansion projects

### This phase creates the next generation.

---

## 5️⃣ Graduation Controls (Platform Enforcement)

Agents must implement:

### Phase Locking
Users cannot access future-tier features without unlock event.

### Persona Filtering
Each persona sees only phase-appropriate UI.

### Graduation Dashboard
Every user has:
- Current phase
- Progress to next unlock
- Requirements checklist
- Ceremony unlock moment

### Admin Overrides
Admins can:
- Fast-track exceptional learners
- Lock accounts for misuse
- Approve partner-level expansion

---

## 6️⃣ UX Requirements (Make It Addictive)

Graduation must feel like:
- 🎮 Leveling up in a game
- 🌍 Earning entry into a new world
- 🎬 Cinematic OS unlock
- 💫 Meaningful, not just "feature access"

**Every phase transition is a ritual.**

---

## 7️⃣ Event Schema

Agents must implement events:

| Event | Description |
|-------|-------------|
| `phase.progress.updated` | Progress changed |
| `phase.unlocked.experiment` | Graduated to Experiment |
| `phase.unlocked.excel` | Graduated to Excel |
| `phase.unlocked.expand` | Graduated to Expand |
| `graduation.ceremony.viewed` | User saw unlock animation |
| `trust.score.updated` | Trust score changed |

---

## 8️⃣ Baseline Compliance

Before any feature implementation, validate:

```typescript
interface BaselineCheck {
  layer: Phase;
  persona: UserRole;
  complianceStatus: 'compliant' | 'violation' | 'exception';
  risksIfViolated: string[];
}
```

---

## 9️⃣ Final Truth

ProjectX is not an LMS.
It is not a course platform.

It is a **civilization ladder**:

```
Experience → Experiment → Excel → Expand
```

The platform must always ask:

> **"What does the user become next?"**

---

## Phase Permissions Matrix

| Feature | eXperience | eXperiment | eXcel | eXpand |
|---------|------------|------------|-------|--------|
| Basic Missions | ✅ | ✅ | ✅ | ✅ |
| XP & Badges | ✅ | ✅ | ✅ | ✅ |
| Sandbox Labs | ❌ | ✅ | ✅ | ✅ |
| Team Projects | ❌ | ✅ | ✅ | ✅ |
| Verified Credentials | ❌ | ❌ | ✅ | ✅ |
| Opportunity Matching | ❌ | ❌ | ✅ | ✅ |
| Partner Toolkit | ❌ | ❌ | ❌ | ✅ |
| Territory Rollout | ❌ | ❌ | ❌ | ✅ |
| Create Missions | ❌ | ❌ | ❌ | ✅ |

---

*END OF GRADUATION PROTOCOL*
