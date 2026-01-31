# ProjectX OS — Agent Runbooks

This directory contains operational runbooks for each agent in the ProjectX Agentic Organization.

## Purpose

Runbooks provide step-by-step procedures for common tasks, ensuring consistency and quality across the organization.

## Runbook Index

### Core Agent Runbooks

| Agent | Runbook | Description |
|-------|---------|-------------|
| PMO | `pmo-sprint-planning.md` | Sprint planning procedure |
| Product Manager | `pm-feature-spec.md` | Feature specification workflow |
| Frontend Lead | `frontend-component.md` | Component creation workflow |
| QA Engineer | `qa-test-creation.md` | Test creation procedure |
| DevOps | `devops-deployment.md` | Deployment procedure |

### Specialist Runbooks

| Specialist | Runbook | Description |
|------------|---------|-------------|
| Performance Tuner | `perf-audit.md` | Performance audit procedure |
| A11y Specialist | `a11y-audit.md` | Accessibility audit procedure |
| SEO Specialist | `seo-audit.md` | SEO audit procedure |

## Runbook Template

Each runbook should follow this structure:

```markdown
# Runbook: {Task Name}

## Agent
{Agent Name}

## Trigger
{When this runbook should be executed}

## Prerequisites
- [ ] {Prerequisite 1}
- [ ] {Prerequisite 2}

## Procedure

### Step 1: {Step Name}
{Detailed instructions}

### Step 2: {Step Name}
{Detailed instructions}

## Validation
- [ ] {Check 1}
- [ ] {Check 2}

## Rollback
{What to do if something goes wrong}

## Handoff
{Who to notify when complete}
```

---

*Runbooks are living documents. Update as processes evolve.*
