# ProjectX OS — Role-Based Access Control (RBAC)

> **Version**: 1.0.0  
> **Last Updated**: January 30, 2026

## Overview

This document defines the complete RBAC system for ProjectX OS, ensuring each persona can only access appropriate features and data.

---

## 1. Roles

### 1.1 Student
**Description**: Learner enrolled in cohorts, completes missions, earns XP.

**Identifier**: `role: 'student'`

### 1.2 Teacher
**Description**: Educator managing cohorts, assigning missions, reviewing submissions.

**Identifier**: `role: 'teacher'`

### 1.3 Parent
**Description**: Guardian with visibility into linked child's progress.

**Identifier**: `role: 'parent'`

### 1.4 Admin
**Description**: School administrator with org-wide access.

**Identifier**: `role: 'admin'`

### 1.5 Facilitator
**Description**: Lab mentor supporting cohorts, optional review assist.

**Identifier**: `role: 'facilitator'`

### 1.6 SuperAdmin (Internal)
**Description**: ProjectX platform administrator. Not exposed to schools.

**Identifier**: `role: 'superadmin'`

---

## 2. Permission Matrix

### 2.1 Missions

| Action | Student | Teacher | Parent | Admin | Facilitator |
|--------|---------|---------|--------|-------|-------------|
| View assigned missions | ✅ | ✅ | ❌ | ✅ | ✅ |
| View all org missions | ❌ | ✅ | ❌ | ✅ | ✅ |
| Create missions | ❌ | ✅ | ❌ | ✅ | ❌ |
| Edit missions | ❌ | ✅ | ❌ | ✅ | ❌ |
| Delete missions | ❌ | ❌ | ❌ | ✅ | ❌ |
| Assign to cohort | ❌ | ✅ | ❌ | ✅ | ❌ |

### 2.2 Submissions

| Action | Student | Teacher | Parent | Admin | Facilitator |
|--------|---------|---------|--------|-------|-------------|
| Submit artifact | ✅ | ❌ | ❌ | ❌ | ❌ |
| View own submissions | ✅ | ❌ | ✅* | ✅ | ❌ |
| View cohort submissions | ❌ | ✅ | ❌ | ✅ | ✅ |
| Review/score submission | ❌ | ✅ | ❌ | ✅ | ✅** |
| Approve submission | ❌ | ✅ | ❌ | ✅ | ❌ |
| Request revision | ❌ | ✅ | ❌ | ✅ | ✅ |

*Parent views only linked child's submissions  
**Facilitator can assist review but cannot final-approve

### 2.3 XP & Badges

| Action | Student | Teacher | Parent | Admin | Facilitator |
|--------|---------|---------|--------|-------|-------------|
| View own XP | ✅ | ✅ | ✅* | ✅ | ❌ |
| View cohort XP | ❌ | ✅ | ❌ | ✅ | ✅ |
| Award XP | ❌ | ✅ | ❌ | ✅ | ❌ |
| View own badges | ✅ | ✅ | ✅* | ✅ | ❌ |
| Award badges | ❌ | ✅ | ❌ | ✅ | ❌ |

### 2.4 Users & Cohorts

| Action | Student | Teacher | Parent | Admin | Facilitator |
|--------|---------|---------|--------|-------|-------------|
| View own profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| View cohort roster | ❌ | ✅ | ❌ | ✅ | ✅ |
| Create cohort | ❌ | ❌ | ❌ | ✅ | ❌ |
| Invite teachers | ❌ | ❌ | ❌ | ✅ | ❌ |
| Link parent to child | ❌ | ❌ | ✅ | ✅ | ❌ |

### 2.5 Organization

| Action | Student | Teacher | Parent | Admin | Facilitator |
|--------|---------|---------|--------|-------|-------------|
| View org settings | ❌ | ❌ | ❌ | ✅ | ❌ |
| Edit org settings | ❌ | ❌ | ❌ | ✅ | ❌ |
| View billing | ❌ | ❌ | ❌ | ✅ | ❌ |
| Export reports | ❌ | ✅ | ❌ | ✅ | ❌ |
| View audit log | ❌ | ❌ | ❌ | ✅ | ❌ |

### 2.6 Inventory (Kits)

| Action | Student | Teacher | Parent | Admin | Facilitator |
|--------|---------|---------|--------|-------|-------------|
| View assigned kit | ✅ | ❌ | ✅* | ✅ | ❌ |
| Manage inventory | ❌ | ❌ | ❌ | ✅ | ❌ |
| Assign kit to student | ❌ | ✅ | ❌ | ✅ | ❌ |

---

## 3. Data Isolation Rules

### 3.1 Student Data Isolation
- Student can ONLY see their own:
  - Submissions
  - XP
  - Badges
  - Assigned missions
  - Portfolio

- Student CANNOT see:
  - Other students' data
  - Teacher/Admin interfaces
  - Org settings

### 3.2 Parent Data Isolation
- Parent can ONLY see linked child(ren):
  - Progress
  - Approved artifacts
  - Teacher feedback
  - XP/badges

- Parent CANNOT see:
  - Other students
  - Internal review notes
  - Pending (unapproved) submissions

### 3.3 Teacher Data Isolation
- Teacher can see:
  - Assigned cohorts
  - Students in those cohorts
  - Submissions from their cohorts

- Teacher CANNOT see:
  - Other teachers' cohorts (unless shared)
  - Org billing
  - Other orgs

### 3.4 Facilitator Data Isolation
- Facilitator can see:
  - Assigned cohorts
  - Student progress in those cohorts

- Facilitator CANNOT see:
  - Org settings
  - Billing
  - Teacher management

---

## 4. Implementation

### 4.1 Auth Context

```typescript
// src/lib/auth/auth-context.tsx
interface AuthContext {
  user: User | null;
  role: UserRole;
  permissions: Permission[];
  orgId: string | null;
  cohortIds: string[];
  linkedChildIds?: string[]; // For parents
}

type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'facilitator';
```

### 4.2 Permission Check Hook

```typescript
// src/hooks/usePermission.ts
function usePermission(permission: Permission): boolean {
  const { permissions } = useAuth();
  return permissions.includes(permission);
}

// Usage
const canReviewSubmissions = usePermission('submissions:review');
```

### 4.3 Route Guards

```typescript
// src/lib/auth/guards.ts
function withRoleGuard(
  allowedRoles: UserRole[],
  Component: React.ComponentType
) {
  return function GuardedComponent(props: any) {
    const { role } = useAuth();
    
    if (!allowedRoles.includes(role)) {
      redirect('/unauthorized');
    }
    
    return <Component {...props} />;
  };
}

// Usage
export default withRoleGuard(['teacher', 'admin'], ReviewPage);
```

### 4.4 API Middleware

```typescript
// src/lib/api/middleware.ts
function requirePermission(permission: Permission) {
  return async (req: Request, ctx: Context) => {
    const user = await getUser(req);
    
    if (!hasPermission(user, permission)) {
      return new Response('Forbidden', { status: 403 });
    }
    
    return ctx.next();
  };
}
```

### 4.5 Data Query Filters

```typescript
// src/lib/data/filters.ts
function applyRoleFilter(query: Query, user: User): Query {
  switch (user.role) {
    case 'student':
      return query.where('userId', '==', user.id);
    
    case 'parent':
      return query.where('userId', 'in', user.linkedChildIds);
    
    case 'teacher':
      return query.where('cohortId', 'in', user.assignedCohortIds);
    
    case 'admin':
      return query.where('orgId', '==', user.orgId);
    
    default:
      return query.limit(0); // No access
  }
}
```

---

## 5. Feature Flags for Development

### 5.1 Mock Auth Flag

```env
# .env.local
NEXT_PUBLIC_FEATURE_MOCK_AUTH=true
```

### 5.2 Role Switcher Component

```typescript
// src/components/dev/RoleSwitcher.tsx
// Only renders when FEATURE_MOCK_AUTH=true

function RoleSwitcher() {
  const { setMockRole } = useMockAuth();
  
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gray-900 p-2 rounded">
      <select onChange={(e) => setMockRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="parent">Parent</option>
        <option value="admin">Admin</option>
        <option value="facilitator">Facilitator</option>
      </select>
    </div>
  );
}
```

---

## 6. Audit Logging

### 6.1 Logged Events

All permission-sensitive actions are logged:

```typescript
interface AuditLog {
  timestamp: Date;
  userId: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  result: 'allowed' | 'denied';
  metadata?: Record<string, any>;
}
```

### 6.2 Example Logs

```json
{
  "timestamp": "2026-01-30T10:15:00Z",
  "userId": "user_123",
  "userRole": "teacher",
  "action": "submissions:approve",
  "resource": "submission",
  "resourceId": "sub_456",
  "result": "allowed"
}
```

---

## 7. Error Handling

### 7.1 Unauthorized (401)
- User not authenticated
- Redirect to login

### 7.2 Forbidden (403)
- User authenticated but lacks permission
- Show friendly error page
- Log attempt

### 7.3 Not Found (404)
- Resource doesn't exist OR user doesn't have access
- Use 404 for both to prevent data leakage

---

## 8. Testing RBAC

### 8.1 Unit Tests

```typescript
describe('RBAC Permissions', () => {
  test('student cannot review submissions', () => {
    const student = mockUser({ role: 'student' });
    expect(hasPermission(student, 'submissions:review')).toBe(false);
  });
  
  test('teacher can review own cohort submissions', () => {
    const teacher = mockUser({ role: 'teacher', cohortIds: ['cohort_1'] });
    expect(canAccessSubmission(teacher, { cohortId: 'cohort_1' })).toBe(true);
  });
});
```

### 8.2 E2E Tests

```typescript
test('parent cannot see other students', async ({ page }) => {
  await loginAs('parent', { linkedChildId: 'child_1' });
  await page.goto('/students/child_2');
  await expect(page.locator('text=Not Found')).toBeVisible();
});
```

---

## 9. Security Considerations

### 9.1 Defense in Depth
- Frontend guards (UX)
- API middleware (enforcement)
- Database rules (backup)

### 9.2 Principle of Least Privilege
- Default: No access
- Explicit grants required

### 9.3 Role Escalation Prevention
- Users cannot change own role
- Role changes require admin + audit

---

*RBAC is critical for school deployments. Test thoroughly before any release.*
