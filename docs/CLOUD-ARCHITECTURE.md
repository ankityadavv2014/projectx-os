# PROJECTX CLOUD ARCHITECTURE
## A Hybrid, Intentional, Tiered Multi-Cloud Strategy

Version: 1.0

---

> *Different clouds for different **human phases**.*

---

## 1️⃣ Architecture Philosophy

ProjectX is not a monolithic SaaS platform.
It is a **phase-aware civilization OS** that maps cloud infrastructure to human evolution stages.

### Core Principle
Each ProjectX phase has different:
- Security requirements
- Scalability needs
- Compliance obligations
- User experience expectations

**Therefore, each phase may live on different cloud infrastructure.**

---

## 2️⃣ The ProjectX Co. (Parent Brand) — SPINE CLOUD

> 🟠 **Purpose:** Governance, trust, continuity, standards

### Cloud Posture
- Conservative
- Stable
- Enterprise-grade

### Use This Layer For
- Identity & Authentication
- Policy & Permissions
- Compliance & Audit
- Brand-critical services

### Recommended Home Cloud (Choose One)
| Provider | Strength |
|----------|----------|
| **Microsoft Azure** | Education + identity strength |
| **Amazon Web Services** | Maximum maturity |

**This is the SPINE CLOUD.**

### Services on Spine
```
┌─────────────────────────────────────┐
│         THE PROJECTX CO.            │
│            SPINE CLOUD              │
├─────────────────────────────────────┤
│  • Identity (Auth0 / Azure AD B2C)  │
│  • RBAC Policy Engine               │
│  • Audit Trail Storage              │
│  • Organization Registry            │
│  • Billing & Subscription           │
│  • Central Event Bus                │
└─────────────────────────────────────┘
```

---

## 3️⃣ Project eXperience (LEARN) — EDGE CLOUD

> 🟢 *"Give humans a chance to experience the future today."*

### Audience
Learners, teachers, parents, schools

### Nature
- Exploratory
- Safe
- Demo-heavy
- Delightful

### Characteristics
- No sensitive data initially
- High UX + interaction
- OS-like experience
- Can be offline / edge-cached
- Meant to be **experienced**, not administered

### Cloud Strategy
- Frontend-first
- Edge-native
- Fast iteration

### Best Fit

| Service | Purpose |
|---------|---------|
| **Vercel** | OS + UI hosting |
| **Cloudflare** | WAF, bot protection, edge caching, regional performance |

### Architecture
```
┌─────────────────────────────────────┐
│       PROJECT eXPERIENCE            │
│           EDGE CLOUD                │
├─────────────────────────────────────┤
│  • Next.js on Vercel Edge           │
│  • Cloudflare CDN                   │
│  • Static mission content           │
│  • Offline-first PWA                │
│  • Demo/sandbox data                │
│  • Analytics edge functions         │
└─────────────────────────────────────┘
         │
         │ Events only (no PII)
         ▼
┌─────────────────────────────────────┐
│           SPINE CLOUD               │
└─────────────────────────────────────┘
```

### Rules for Agents
✅ Content-driven  
✅ Event-logged  
✅ Persona-switched UI  
✅ Mock or sandbox data  
❌ **Never depend tightly on heavy backend logic**

---

## 4️⃣ Project eXperiment (WORK) — HYBRID CLOUD

> 🔵 *"Let humans experiment, collaborate, and simulate real work."*

### Audience
Advanced learners, facilitators, mentors

### Nature
- Hands-on
- Sandboxed
- Failure-tolerant

### Characteristics
- Experiments
- Sandboxes
- Simulations
- Versioned outcomes
- Agent collaboration
- AI tools

### Cloud Strategy
**This is where HYBRID shines.**

- Core APIs + data → Spine cloud (AWS/Azure)
- Compute-heavy / AI / sandbox → Secondary cloud

### Common Patterns

| Component | Cloud |
|-----------|-------|
| Primary backend | AWS/Azure (Spine) |
| AI/ML workloads | Google Cloud or Azure AI |
| Sandbox environments | Isolated containers |
| School on-prem | Local clusters |

### Architecture
```
┌─────────────────────────────────────┐
│       PROJECT eXPERIMENT            │
│          HYBRID CLOUD               │
├─────────────────────────────────────┤
│  • Core API (Spine Cloud)           │
│  • Sandbox Orchestrator             │
│  • AI/ML Inference (GCP optional)   │
│  • Experiment Storage (versioned)   │
│  • Team Collaboration Engine        │
│  • Assessment Service               │
└─────────────────────────────────────┘
         │
         │ Authenticated + Sandboxed
         ▼
┌─────────────────────────────────────┐
│           SPINE CLOUD               │
│    (Identity + Policy + Audit)      │
└─────────────────────────────────────┘
```

### Key Idea
> **Experiments must be isolated by design.**

### Rules for Agents
✅ Sandbox per cohort  
✅ Expire experiments  
✅ Version all outcomes  
❌ **Never contaminate production learning data**

---

## 5️⃣ Project eXcel (EARN) — ENTERPRISE CLOUD

> 🟣 *"Turn capability into value."*

### Audience
Graduates, partners, employers

### Nature
- Transactional
- Reputation-based
- Auditable

### Characteristics
- Portfolios
- Credentials
- Matching to opportunities
- Verification
- Monetization (future)

### Cloud Strategy
**Enterprise-grade and auditable.**

- Centralized identity
- Strong RBAC
- Event trails
- Secure storage

### Recommendation
- Keep eXcel **tightly coupled to SPINE CLOUD**
- Avoid spreading across clouds initially
- Add regional replicas later for compliance

### Architecture
```
┌─────────────────────────────────────┐
│         PROJECT eXCEL               │
│        ENTERPRISE CLOUD             │
├─────────────────────────────────────┤
│  • Credential Verification API      │
│  • Portfolio Service                │
│  • Opportunity Matching Engine      │
│  • Employer Integration Gateway     │
│  • Payment Processing (future)      │
│  • Compliance Audit Logs            │
└─────────────────────────────────────┘
         │
         │ Fully authenticated + audited
         ▼
┌─────────────────────────────────────┐
│           SPINE CLOUD               │
│  (Identity + Policy + Compliance)   │
└─────────────────────────────────────┘
```

### Rules for Agents
✅ Every action auditable  
✅ Strong permission checks  
✅ Reputation-aware decisions  
❌ **Never expose unverified credentials**

---

## 6️⃣ Project eXpand (INVENT) — FEDERATED CLOUD

> 🔴 *"Multiply impact across regions, cultures, and systems."*

### Audience
Partners, NGOs, governments, institutions

### Nature
- Distributed
- Federated
- Customizable

### Characteristics
- Territory rollout
- Partner deployments
- Local adaptations
- Vendor ecosystems

### Cloud Strategy
**Federation matters here.**

- Core standards + identity from Spine
- Local deployments can run on:
  - National clouds
  - Private clouds
  - Partner infrastructure

### Architecture
```
┌─────────────────────────────────────┐
│        PROJECT eXPAND               │
│        FEDERATED CLOUD              │
├─────────────────────────────────────┤
│  • Partner Hub Registry             │
│  • Territory Configuration          │
│  • Local Content Delivery           │
│  • Regional Data Residency          │
│  • Custom Track Builder             │
│  • Federation Protocol              │
└─────────────────────────────────────┘
         │
         │ Standards + Identity
         ▼
┌─────────────────────────────────────┐
│           SPINE CLOUD               │
│    (Central Authority + Protocol)   │
└─────────────────────────────────────┘
         │
    ┌────┴────┬────────┐
    ▼         ▼        ▼
┌───────┐ ┌───────┐ ┌───────┐
│ AWS   │ │ Azure │ │ Local │
│India  │ │Africa │ │School │
└───────┘ └───────┘ └───────┘
```

### Key Transformation
> ProjectX becomes a **Protocol + OS**, not just a hosted app.

---

## 7️⃣ Complete Architecture Diagram

```
                    ┌─────────────────────────────────────┐
                    │         THE PROJECTX CO.            │
                    │            SPINE CLOUD              │
                    │   (AWS or Azure - Enterprise Grade) │
                    ├─────────────────────────────────────┤
                    │  • Identity Provider                │
                    │  • Policy Engine                    │
                    │  • Audit Trail                      │
                    │  • Event Bus                        │
                    │  • Organization Registry            │
                    └──────────────┬──────────────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│  eXPERIENCE (LEARN) │ │  eXPERIMENT (WORK)  │ │   eXCEL (EARN)      │
│     EDGE CLOUD      │ │    HYBRID CLOUD     │ │  ENTERPRISE CLOUD   │
├─────────────────────┤ ├─────────────────────┤ ├─────────────────────┤
│ • Vercel Edge       │ │ • Core API (Spine)  │ │ • Credentials API   │
│ • Cloudflare CDN    │ │ • AI/ML (GCP opt)   │ │ • Portfolio Service │
│ • Static Content    │ │ • Sandboxes         │ │ • Opportunity Match │
│ • PWA / Offline     │ │ • Collaboration     │ │ • Employer Gateway  │
│ • Demo Data         │ │ • Experiments       │ │ • Audit Logs        │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
                                   │
                                   │
                    ┌──────────────┴──────────────┐
                    │      eXPAND (INVENT)        │
                    │      FEDERATED CLOUD        │
                    ├─────────────────────────────┤
                    │ • Partner Hub Registry      │
                    │ • Territory Config          │
                    │ • Regional Deployments      │
                    │ • Federation Protocol       │
                    └─────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              ┌─────────┐   ┌─────────┐   ┌─────────┐
              │ Region  │   │ Region  │   │ On-Prem │
              │   A     │   │   B     │   │ Schools │
              └─────────┘   └─────────┘   └─────────┘
```

---

## 8️⃣ Cloud Provider Selection Matrix

| Phase | Primary | Secondary | CDN/Edge |
|-------|---------|-----------|----------|
| **Spine** | AWS or Azure | — | — |
| **eXperience** | Vercel | — | Cloudflare |
| **eXperiment** | Spine Cloud | GCP (AI) | Cloudflare |
| **eXcel** | Spine Cloud | — | Regional CDN |
| **eXpand** | Spine Cloud | Partner Clouds | Regional |

---

## 9️⃣ Data Residency Rules

| Data Type | Location | Rationale |
|-----------|----------|-----------|
| Identity | Spine Cloud | Single source of truth |
| Mission Content | Edge/CDN | Performance |
| Submissions | Spine Cloud | Audit required |
| Experiments | Isolated Sandboxes | Contamination prevention |
| Credentials | Spine Cloud | Verification |
| Partner Data | Regional | Compliance |

---

## 🔟 Agent Implementation Rules

### Before proposing infrastructure:

1. **Identify the phase**
2. **Check cloud assignment**
3. **Verify data residency**
4. **Confirm isolation requirements**

### Never:
- ❌ Mix eXperience data with eXcel data
- ❌ Store experiments in production databases
- ❌ Deploy eXpand features on edge-only infrastructure
- ❌ Skip spine cloud for identity/auth

---

*END OF CLOUD ARCHITECTURE*
