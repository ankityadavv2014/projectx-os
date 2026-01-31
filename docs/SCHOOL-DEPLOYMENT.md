# ProjectX OS — School Deployment Guide

> **Version**: 1.0.0  
> **Last Updated**: January 30, 2026

## Overview

This guide covers deploying ProjectX OS to schools, from pilot onboarding to full rollout.

---

## 1. Deployment Models

### A) Cloud Hosted (Recommended)
- **URL**: `https://{school-slug}.projectx.school`
- **Data**: Isolated per organization
- **Updates**: Automatic
- **Support**: 24/7

### B) Self-Hosted (Enterprise)
- **Requirements**: Docker + PostgreSQL
- **Data**: On-premise
- **Updates**: Manual
- **Support**: Priority tickets

---

## 2. Pre-Deployment Checklist

### Technical Requirements
- [ ] Modern browsers (Chrome 90+, Safari 15+, Firefox 88+, Edge 90+)
- [ ] Stable internet (5 Mbps+ recommended)
- [ ] Devices: Tablets, Laptops, or Desktops
- [ ] (Optional) Projector for classroom demos

### Administrative Requirements
- [ ] Organization registration complete
- [ ] Admin account provisioned
- [ ] Teacher accounts created
- [ ] Cohorts defined (classes/sections)
- [ ] Student roster imported
- [ ] Parent linking enabled (optional)

---

## 3. Onboarding Flow

### Week 1: Admin Setup
1. **Organization Profile**
   - School name, logo, timezone
   - Academic calendar
   - Grade levels / tracks

2. **Teacher Onboarding**
   - Bulk invite via CSV
   - Role assignment
   - Training session (1 hour)

3. **Cohort Creation**
   - Define class sections
   - Assign homeroom teachers
   - Generate cohort codes

### Week 2: Student Activation
1. **Cohort Entry**
   - Students scan QR or enter code
   - Profile creation (minimal)
   - First mission unlock

2. **Parent Linking (Optional)**
   - Parent receives invite
   - Links to child via secure code
   - Dashboard access granted

### Week 3: Go Live
1. **First Mission Cycle**
   - Teacher assigns starter mission
   - Students submit artifacts
   - Teacher reviews + approves
   - XP flows, badges unlock

2. **Monitoring**
   - Admin tracks adoption
   - Support available for blockers

---

## 4. Infrastructure Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     School Network                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Student  │  │ Student  │  │ Teacher  │  │  Admin   │   │
│  │  Tablet  │  │  Laptop  │  │  Laptop  │  │  Device  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │          │
│       └─────────────┴──────┬──────┴─────────────┘          │
│                            │                                │
│                     ┌──────▼──────┐                        │
│                     │   Firewall  │                        │
│                     └──────┬──────┘                        │
└────────────────────────────┼────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   CloudFlare    │
                    │   WAF + CDN     │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
        │  Next.js  │  │   Supabase │  │   R2/S3   │
        │   Edge    │  │  Database  │  │  Artifacts│
        └───────────┘  └───────────┘  └───────────┘
```

---

## 5. Data Privacy & Compliance

### Student Data Protection
- **FERPA Compliant**: US schools
- **GDPR Ready**: EU schools
- **COPPA Safe**: Under-13 protections
- **Data Residency**: Region-selectable

### Parent Consent
- Digital consent flow built-in
- Opt-out provisions
- Data export requests supported

### Security Measures
- TLS 1.3 encryption
- At-rest encryption (AES-256)
- SOC 2 Type II (in progress)
- Penetration testing: Annual

---

## 6. Content & Curriculum

### Pre-Built Tracks
1. **Creative Coding** (Ages 8-12)
2. **Robotics Foundations** (Ages 10-14)
3. **AI Explorers** (Ages 12-16)
4. **Entrepreneurship** (Ages 14-18)
5. **Maker Skills** (All ages)

### Custom Content
- Schools can create custom missions
- Import from Google Classroom
- Export outcomes to SIS

---

## 7. Kit Distribution (Physical)

### Inventory Management
- Admin tracks kit allocation
- Student kit assignment
- Return/damage tracking

### Recommended Starter Kits
| Kit | Contents | Grade Range |
|-----|----------|-------------|
| Maker Box | Arduino, sensors, LEDs | 6-12 |
| AI Kit | Raspberry Pi, camera | 9-12 |
| Creative Pack | Art supplies, journal | K-8 |

---

## 8. Support & Training

### Teacher Training
- **Onboarding**: 1-hour live session
- **Office Hours**: Weekly drop-in
- **Help Center**: docs.projectx.school

### Technical Support
- **Email**: support@projectx.school
- **Chat**: In-app (business hours)
- **Phone**: Enterprise tier

### Community
- **Educator Slack**: 1000+ teachers
- **Monthly Webinars**: Best practices
- **Annual Summit**: ProjectX Connect

---

## 9. Success Metrics

### Adoption
- % students active weekly
- Missions completed per student
- Teacher review turnaround

### Outcomes
- XP progression curves
- Badge unlock rates
- Portfolio completeness

### Satisfaction
- NPS surveys (quarterly)
- Parent feedback
- Student engagement scores

---

## 10. Rollout Phases

### Phase 1: Pilot (1-2 months)
- 1-3 cohorts
- Core track only
- Weekly check-ins

### Phase 2: Expansion (2-4 months)
- All interested cohorts
- Multiple tracks
- Parent portal enabled

### Phase 3: Full Adoption (Ongoing)
- School-wide
- SIS integration
- Custom tracks

---

## Quick Reference

| Action | Owner | Timeline |
|--------|-------|----------|
| Register org | Admin | Day 1 |
| Import teachers | Admin | Day 1-2 |
| Create cohorts | Admin/Teachers | Day 2-3 |
| Student activation | Teachers | Week 1-2 |
| First mission cycle | All | Week 2-3 |
| Parent linking | Parents | Week 2-4 |
| Go-live review | Admin + ProjectX | Week 4 |

---

**Need help?** Contact schools@projectx.school or visit docs.projectx.school
