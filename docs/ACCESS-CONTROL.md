# ProjectX Access Control

> Role-based access control (RBAC) and permission system

## Roles

### Core Roles

| Role | Description | Phase Access |
|------|-------------|--------------|
| `student` | Primary learner | eXperience (default) |
| `teacher` | Facilitator/Mentor | eXperience |
| `parent` | Supporter/Observer | eXperience (read-only student view) |
| `admin` | School administrator | eXperience + Admin tools |
| `superadmin` | Platform administrator | All portals + System tools |

### Phase-Based Roles

| Role | Unlock Condition | Portal Access |
|------|------------------|---------------|
| `experimenter` | Graduate from eXperience | eXperiment |
| `exceler` | Graduate from eXperiment | eXcel |
| `expander` | Graduate from eXcel | eXpand |

---

## Route Permissions

### Public Routes (No Auth)
```
/                 # Homepage
/about            # About page
/manifesto        # Manifesto
/vision           # Vision & Roadmap
/partners         # Partnership info
/careers          # Job listings
/contact          # Contact form
/legal            # Privacy & Terms
/school           # School partnership landing
```

### Authenticated Routes (Any Role)
```
/os               # Main OS hub
```

### Student Routes
```
/student          # Student dashboard
/student/*        # All student sub-routes
/mission/[id]     # Mission pages
```

### Teacher Routes
```
/teacher          # Teacher dashboard
/teacher/*        # All teacher sub-routes
/review           # Review interface
```

### Parent Routes
```
/parent           # Parent dashboard
/parent/*         # All parent sub-routes
```

### Admin Routes
```
/admin            # Admin dashboard
/admin/*          # All admin sub-routes
```

### Portal Routes (Phase-Locked)
```
/experiment       # Requires: experimenter role OR eXperience graduation
/excel            # Requires: exceler role OR eXperiment graduation
/expand           # Requires: expander role OR eXcel graduation
```

---

## Permission Matrix

### Student Permissions

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Own Profile | - | ✅ | ✅ | - |
| Own Missions | - | ✅ | - | - |
| Own Artifacts | ✅ | ✅ | ✅ | ✅ |
| Own Portfolio | ✅ | ✅ | ✅ | ✅ |
| Own XP/Badges | - | ✅ | - | - |
| Other Students | - | Limited* | - | - |
| Teachers | - | Limited* | - | - |

*Limited = Name, public profile only

### Teacher Permissions

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Own Profile | - | ✅ | ✅ | - |
| Own Cohorts | ✅ | ✅ | ✅ | ✅ |
| Cohort Students | - | ✅ | - | - |
| Student Missions | - | ✅ | ✅* | - |
| Student Artifacts | - | ✅ | - | - |
| Mission Assignments | ✅ | ✅ | ✅ | ✅ |
| Reviews/Scores | ✅ | ✅ | ✅ | ✅ |

*Update = Approve/Request Revision

### Parent Permissions

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Own Profile | - | ✅ | ✅ | - |
| Linked Child | - | ✅ | - | - |
| Child Missions | - | ✅ | - | - |
| Child Artifacts | - | ✅ | - | - |
| Child Progress | - | ✅ | - | - |

### Admin Permissions

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Own Profile | - | ✅ | ✅ | - |
| School Settings | - | ✅ | ✅ | - |
| Teachers | ✅ | ✅ | ✅ | ✅ |
| Cohorts | ✅ | ✅ | ✅ | ✅ |
| All Students | - | ✅ | - | - |
| Analytics | - | ✅ | - | - |
| Reports | ✅ | ✅ | - | ✅ |

---

## Access Denial Handling

### Unauthenticated Access
```
Route: Any protected route
→ Redirect to: /login (or auth flow)
→ After auth: Return to original route
```

### Unauthorized Access (Wrong Role)
```
Route: /admin (accessed by student)
→ Show: /access-denied page
→ Options:
  - Return to appropriate dashboard
  - Return to OS
  - Contact support
```

### Locked Portal Access
```
Route: /experiment (before graduation)
→ Show: Portal locked page with:
  - Current phase progress
  - Requirements to unlock
  - CTA to continue current phase
```

---

## Implementation Notes

### Middleware Check Order
1. Is route public? → Allow
2. Is user authenticated? → If not, redirect to auth
3. Does user have required role? → If not, show access-denied
4. Does user have phase access? → If not, show unlock-required
5. Allow

### Role Storage
- Roles stored in user profile
- Phase roles added upon graduation
- Cached in session/JWT for performance

### Role Escalation
- Teachers can become mentors (additional permissions)
- Admins can grant teacher access
- Graduation automatically adds phase roles

### Multi-Role Support
- Users can have multiple roles
- Example: A teacher who is also a parent
- UI adapts to show relevant options
