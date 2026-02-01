# ProjectX Persona Journeys

> Detailed user journeys for each persona through the ProjectX ecosystem

## 🎓 Student Journey

### Entry Point
**"Start Your Journey →"** from homepage or persona pathways

### Onboarding Flow
```
Homepage → /student (Dashboard)
    ↓
First-time user detected
    ↓
/student/onboarding
    - Role selection confirmation
    - Initial profile setup
    - First mission recommendation
    ↓
/mission/1 (First Mission)
    - Mission briefing
    - Objective walkthrough
    - AI Mentor introduction
```

### Core Loop
```
Dashboard (/student)
    ↓
Browse Missions → /student/missions
    ↓
Select Mission → /mission/[id]
    ↓
Work on Mission
    - Read objectives
    - Use AI Mentor
    - Create artifact
    ↓
Submit Artifact
    ↓
Await Review
    ↓
Receive Feedback
    - Approved → XP + Badge
    - Revision → Update & Resubmit
    ↓
Next Mission Recommended
    ↓
(Repeat Core Loop)
```

### Graduation Path
```
Complete 10 missions
    ↓
Earn 5,000+ XP
    ↓
Portfolio Review
    ↓
Mentor Approval
    ↓
Graduation Ceremony (/student/graduation)
    ↓
Unlock eXperiment Portal
```

### Key Pages
| Page | Purpose | Next Action |
|------|---------|-------------|
| `/student` | Dashboard overview | Start Mission |
| `/student/missions` | Browse all missions | Select Mission |
| `/mission/[id]` | Work on mission | Submit Artifact |
| `/student/portfolio` | View completed work | Share Portfolio |
| `/student/xp` | Progress & badges | Check Graduation |
| `/student/graduation` | Graduation status | Enter eXperiment |

---

## 👨‍🏫 Teacher Journey

### Entry Point
**"Empower Learners →"** from homepage

### Onboarding Flow
```
Homepage → /teacher (Dashboard)
    ↓
First-time user detected
    ↓
/teacher/onboarding
    - School association
    - Cohort creation
    - Mission library intro
    ↓
Create First Cohort
    ↓
Invite Students
```

### Core Loop
```
Dashboard (/teacher)
    ↓
Review pending submissions
    ↓
/review
    - Score with rubric
    - Provide feedback
    - Approve/Request revision
    ↓
Check cohort progress
    ↓
/teacher/analytics
    - Engagement metrics
    - Skill progression
    - At-risk students
    ↓
Assign new missions
    ↓
/teacher/assignments
    ↓
(Repeat Core Loop)
```

### Key Pages
| Page | Purpose | Next Action |
|------|---------|-------------|
| `/teacher` | Dashboard overview | Review Submissions |
| `/teacher/cohorts` | Manage cohorts | View Cohort |
| `/teacher/assignments` | Assign missions | Create Assignment |
| `/review` | Review submissions | Score & Feedback |
| `/teacher/analytics` | View progress | Identify issues |
| `/teacher/resources` | Teaching materials | Learn techniques |

---

## 👨‍👩‍👧 Parent Journey

### Entry Point
**"Track Progress →"** from homepage

### Onboarding Flow
```
Homepage → /parent (Dashboard)
    ↓
First-time user detected
    ↓
/parent/link
    - Enter student's link code
    - OR request link from student
    ↓
Confirm connection
    ↓
View child's dashboard
```

### Core Loop
```
Dashboard (/parent)
    ↓
View progress overview
    - Current mission
    - XP level
    - Recent badges
    ↓
Check artifacts
    ↓
/parent/artifacts
    - View completed work
    - Leave encouragement
    ↓
Review achievements
    ↓
/parent/achievements
    - Badge timeline
    - Milestone celebrations
    ↓
Receive notifications
    - Mission completions
    - Teacher feedback
    - Celebration alerts
```

### Key Pages
| Page | Purpose | Next Action |
|------|---------|-------------|
| `/parent` | Dashboard overview | View Progress |
| `/parent/progress` | Detailed progress | Check Artifacts |
| `/parent/artifacts` | View completed work | Encourage |
| `/parent/achievements` | Badges & milestones | Celebrate |
| `/parent/link` | Connect to child | Enter Code |

---

## 🏫 School/Admin Journey

### Entry Point
**"Partner With Us →"** from homepage

### Onboarding Flow
```
Homepage → /school (Landing)
    ↓
Schedule demo → /contact
    ↓
Pilot agreement
    ↓
/admin (Dashboard access)
    ↓
/admin/teachers
    - Bulk invite teachers
    - Assign training
    ↓
/admin/cohorts
    - Create student cohorts
    - Assign to teachers
```

### Core Loop
```
Dashboard (/admin)
    ↓
Monitor school metrics
    - Active students
    - Mission completions
    - Teacher engagement
    ↓
/admin/analytics
    - Deep dive analytics
    - Outcome tracking
    - Skill mapping
    ↓
Generate reports
    ↓
/admin/reports
    - Impact reports
    - Progress exports
    - Board presentations
    ↓
Manage resources
    - Add teachers
    - Create cohorts
    - Curriculum alignment
```

### Key Pages
| Page | Purpose | Next Action |
|------|---------|-------------|
| `/school` | Partner landing | Schedule Demo |
| `/admin` | Dashboard overview | View Metrics |
| `/admin/teachers` | Manage teachers | Invite Teacher |
| `/admin/cohorts` | Manage cohorts | Create Cohort |
| `/admin/analytics` | Deep analytics | Generate Report |
| `/admin/reports` | Export reports | Download PDF |

---

## Cross-Journey Interactions

### Student ↔ Teacher
- Teacher assigns missions
- Student submits artifacts
- Teacher reviews & scores
- Student receives feedback

### Student ↔ Parent
- Student shares link code
- Parent views progress
- Parent sees achievements
- Parent sends encouragement

### Teacher ↔ Admin
- Admin invites teachers
- Teacher manages cohorts
- Admin monitors performance
- Admin generates reports

---

## Journey Success Metrics

### Student
- Mission completion rate
- XP progression velocity
- Portfolio quality score
- Graduation rate

### Teacher
- Review turnaround time
- Feedback quality
- Student engagement
- Cohort completion rate

### Parent
- Login frequency
- Artifact views
- Encouragement sent
- Time on platform

### Admin
- Teacher activation
- Student engagement
- Learning outcomes
- Retention rate
