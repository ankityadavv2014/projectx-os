# ProjectX OS — Go-Live Acceptance Spec

**Owner:** CEO, The ProjectX Co.  
**Version:** 1.0  
**Last Updated:** 2026-01-31  
**Launch Goal:** Multi-user, multi-region mission workflow that works at scale

---

## 🎯 Definition of Live

> **ProjectX OS is not live until this loop is unbreakable:**
>
> **QR Scan → Mission → Submission → Teacher Review → Feedback/Approval → Student Progress**

If any step fails or is unclear, we are NOT live.

---

## Go-Live Checklist

| # | Requirement | Status |
|---|-------------|--------|
| 1 | RBAC works on every route + API | 🔲 |
| 2 | Tenant isolation enforced (region/school) | 🔲 |
| 3 | Teacher assignment deterministic | 🔲 |
| 4 | QR scan resolves to mission correctly | 🔲 |
| 5 | Submission status machine works | 🔲 |
| 6 | Teacher review OS operational | 🔲 |
| 7 | Student journey is guided | 🔲 |
| 8 | Secure evidence upload system | 🔲 |
| 9 | Admin can onboard at scale | 🔲 |
| 10 | Event audit log exists | 🔲 |
| 11 | Performance: 500 logins, 200 uploads | 🔲 |

**All boxes checked = LAUNCH**

---

## Detailed Acceptance Criteria

### 1. Roles & Access (RBAC)

| Role | Access |
|------|--------|
| Student | Missions, Submissions, Uploads, Feedback |
| Teacher | Review Queue, Feedback, Status Updates |
| Admin (School) | User onboarding, teacher assignment, mission publishing |
| Regional Admin | Multi-school oversight |
| Super Admin | Global control |

**Pass Criteria:**
- Users only see tools for their role
- Server enforces permissions (not just UI hiding)
- No student can access another student's submission by URL manipulation

---

### 2. Multi-Tenant Scaling

**Hierarchy:** Region → School → Teacher Group → Students → Missions → Submissions

**Required fields on ALL core objects:**
- `regionId`
- `schoolId`

**Pass Criteria:**
- User in School A cannot see School B data
- Admin manages only their tenant unless super admin

---

### 3. Teacher Assignment System

**Rules:**
- Each student has ONE assigned teacher
- Assignment stored in DB (not derived)
- Submissions auto-route to assigned teacher

**Pass Criteria:**
- Student dashboard shows assigned teacher name
- Teacher dashboard shows assigned students list
- Submissions route correctly (no floating/unrouted)

---

### 4. Mission QR Scan Workflow

**Flow:**
1. Student scans QR code
2. System loads mission details page
3. Student clicks "Start Mission"
4. Draft submission created automatically
5. Student uploads evidence
6. Student clicks "Submit Mission"

**Mission Page Must Show:**
- Title + objective
- Step-by-step instructions
- Kit links + lab location
- Submission requirements
- Upload button + status indicator

---

### 5. Submission Status Engine

| Status | Meaning |
|--------|---------|
| `DRAFT` | Started but not submitted |
| `SUBMITTED` | Sent to teacher queue |
| `UNDER_REVIEW` | Teacher opened review |
| `FEEDBACK_REQUESTED` | Teacher wants changes |
| `RESUBMITTED` | Student updated work |
| `APPROVED` | Mission complete |
| `REJECTED` | Mission failed (requires reason) |

**Pass Criteria:**
- Student always sees current status
- Teacher can transition statuses
- Status change triggers dashboard update

---

### 6. Teacher Review OS

**Required Features:**
- Submission queue (filter by status, sort by newest)
- Submission detail view (attachments, feedback, status controls)
- Actions: Under Review, Request Feedback, Approve, Reject

**Pass Criteria:**
- Teacher sees submissions immediately after student submit
- Feedback appears instantly for student
- Review actions logged

---

### 7. Student OS Dashboard

**Required Widgets:**
- Assigned teacher info
- Active missions
- Latest submission status board
- Feedback inbox
- Submissions timeline with status badges

**Pass Criteria:**
- Student never wonders "what's happening?"
- Feedback loop is clear and actionable

---

### 8. Upload System (Evidence Vault)

**Supported Formats:**
- Images (jpg/png)
- Videos (mp4/mov)
- PDF, DOC/DOCX, XLS/XLSX

**Security Rules:**
- Private storage only
- Signed URLs for access
- Only student + assigned teacher + admin can view

---

### 9. Admin OS

**Required Features:**
- Create single user
- Bulk import via CSV (name, email, role, region, school)
- Teacher assignment UI (assign/unassign, cohort mapping)
- Mission management (create, edit, QR code, publish/unpublish)
- Unassigned queue (for routing orphaned submissions)

**Pass Criteria:**
- Admin can onboard 200 students in minutes
- Missions deployable instantly

---

### 10. Audit & Observability

**Every submission action generates event:**
- Submitted
- Opened
- Feedback requested
- Approved
- Rejected

**Stored as:** `SubmissionEvent` with timestamp, actor, action

---

### 11. Performance Minimums

- 500 concurrent logins
- 200 simultaneous uploads
- Teacher queue updates under 2 seconds
- Upload endpoints rate limited
- Errors logged

---

## Sprint Execution Order

### Week 1: Spine
1. Auth + RBAC + Tenant scoping
2. Teacher assignment routing
3. Mission + QR resolution
4. Submission status engine

### Week 2: Portals
5. Student OS dashboard
6. Teacher review OS queue
7. Upload vault + security

### Week 3: Scale
8. Admin onboarding + CSV
9. Mission publishing + QR generator
10. Audit logs + tests + deployment hardening

---

## CEO Sign-Off Criteria

We go live when:
- ✅ Student can scan QR → submit mission
- ✅ Teacher can review → approve/request feedback
- ✅ Student sees status + feedback → resubmits
- ✅ Admin can onboard + assign teachers at scale
- ✅ Multi-region tenant isolation enforced
- ✅ Attachments secure
- ✅ Event log exists

**Everything else is v2.**
