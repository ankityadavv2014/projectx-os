# ProjectX OS — Agent System

> **Version**: 1.0.0  
> **Last Updated**: January 30, 2026

## Overview

ProjectX OS is built by an **Agentic Organization** — a coordinated system of AI agents that work together to design, build, and maintain the platform.

---

## 1. Core Agents

### 1.1 PMO (Orchestrator)

**Role**: Project coordination, planning, conflict resolution

**Responsibilities**:
- Sprint planning
- Cross-agent coordination
- Blocker resolution
- Progress tracking

**Prompt Location**: `/agents/prompts/pmo.md`

---

### 1.2 Product Manager

**Role**: Feature definition, prioritization, user advocacy

**Responsibilities**:
- PRD creation
- Feature specs
- Backlog grooming
- Stakeholder communication

**Prompt Location**: `/agents/prompts/product-manager.md`

---

### 1.3 Creative Director

**Role**: Brand, visual design, experience quality

**Responsibilities**:
- Design system
- Visual language
- Animation direction
- Brand consistency

**Prompt Location**: `/agents/prompts/creative-director.md`

---

### 1.4 UX Architect

**Role**: User flows, information architecture, usability

**Responsibilities**:
- User journeys
- IA design
- Usability audits
- Accessibility

**Prompt Location**: `/agents/prompts/ux-architect.md`

---

### 1.5 Frontend Lead

**Role**: UI implementation, component architecture, performance

**Responsibilities**:
- Component development
- State management
- Performance optimization
- Code quality

**Prompt Location**: `/agents/prompts/frontend-lead.md`

---

### 1.6 AI/Agent Engineer

**Role**: AI integrations, LLM orchestration, agent systems

**Responsibilities**:
- Orb AI implementation
- Agent factory
- Prompt engineering
- AI UX

**Prompt Location**: `/agents/prompts/ai-agent-engineer.md`

---

### 1.7 Security Engineer

**Role**: Security posture, compliance, data protection

**Responsibilities**:
- Security audits
- Threat modeling
- RBAC implementation
- Compliance (FERPA, COPPA)

**Prompt Location**: `/agents/prompts/security-engineer.md`

---

### 1.8 QA Engineer

**Role**: Testing strategy, quality gates, bug prevention

**Responsibilities**:
- Test planning
- E2E test creation
- Bug triage
- Release validation

**Prompt Location**: `/agents/prompts/qa-engineer.md`

---

### 1.9 DevOps Engineer

**Role**: CI/CD, infrastructure, deployment

**Responsibilities**:
- Pipeline maintenance
- Deployment automation
- Monitoring
- Performance infrastructure

**Prompt Location**: `/agents/prompts/devops.md`

---

## 2. Specialist Agents (Auto-Spawned)

These agents are spawned automatically after MVP milestones:

### 2.1 Performance Tuner
- Lighthouse optimization
- Bundle analysis
- LCP/FID improvements

### 2.2 Animation Specialist
- Framer Motion patterns
- Microinteractions
- Delight moments

### 2.3 Accessibility Specialist
- WCAG compliance
- Keyboard navigation
- Screen reader testing

### 2.4 SEO Specialist
- Meta optimization
- Sitemap generation
- Open Graph tags

### 2.5 Telemetry Analyst
- Event schema design
- Conversion tracking
- Analytics dashboards

### 2.6 Component Librarian
- Design system hygiene
- Documentation
- Storybook maintenance

---

## 3. Agent Factory

### 3.1 Purpose

The Agent Factory creates new specialist agents on demand based on project needs.

### 3.2 Location

```
/agents/
├── factory/
│   └── agent-factory.ts
├── prompts/
│   ├── pmo.md
│   ├── product-manager.md
│   └── ...
├── templates/
│   └── agent-template.md
├── registry.json
└── README.md
```

### 3.3 Registry Schema

```json
{
  "agents": [
    {
      "id": "pmo",
      "name": "PMO / Orchestrator",
      "role": "Project coordination",
      "promptPath": "prompts/pmo.md",
      "spawnedAt": "2026-01-30T00:00:00Z",
      "status": "active"
    }
  ]
}
```

### 3.4 Spawning New Agents

```bash
# Via CLI
npx agent-factory spawn --role "Performance Tuner" --scope "lighthouse,bundle,lcp"

# Output: /agents/prompts/performance-tuner.md
```

---

## 4. Agent Communication Protocol

### 4.1 Response Format

All agents must respond with:

```markdown
## Decision
[Clear decision or recommendation]

## Rationale
[Why this decision]

## Plan
[Step-by-step implementation plan]

## Artifacts
[Files to create/modify]

## Risks
[Potential issues and mitigations]

## Next
[Immediate next action]
```

### 4.2 Handoff Format

When passing work between agents:

```markdown
## Handoff: [From Agent] → [To Agent]

### Context
[Background information]

### Completed
[What was done]

### Pending
[What needs to be done]

### Blockers
[Any issues]

### Priority
[Urgency level]
```

---

## 5. Agent Workflows

### 5.1 Feature Development

```
Product Manager    →    UX Architect    →    Frontend Lead    →    QA Engineer
    (Spec)              (Flows)              (Build)              (Test)
```

### 5.2 Bug Fix

```
QA Engineer    →    Frontend Lead    →    QA Engineer
  (Report)          (Fix)               (Verify)
```

### 5.3 Security Issue

```
Security Engineer    →    Frontend Lead    →    Security Engineer    →    DevOps
    (Identify)             (Fix)                (Verify)                 (Deploy)
```

---

## 6. Integration with Pilot

### 6.1 Issue Labels

Pilot processes issues with the `pilot` label. Agent work can trigger Pilot:

1. Agent identifies task
2. Agent creates GitHub issue with `pilot` label
3. Pilot picks up issue
4. Pilot implements solution
5. Pilot creates PR
6. Agent reviews PR

### 6.2 Quality Gates

Pilot respects quality gates:
- `npm run build` must pass
- `npm run lint` must pass
- Tests must pass

---

## 7. Agent Evaluation

### 7.1 Metrics

| Agent | Metric | Target |
|-------|--------|--------|
| Frontend Lead | Build success rate | > 95% |
| QA Engineer | Test coverage | > 80% |
| Security Engineer | Vulnerabilities | 0 critical |
| DevOps | Deploy success | > 99% |

### 7.2 Retrospectives

Weekly agent retrospective:
- What worked
- What didn't
- Improvements for next sprint

---

## 8. Creating New Agents

### 8.1 Template

```markdown
# Agent: [Name]

## Role
[One-line role description]

## Responsibilities
1. [Responsibility 1]
2. [Responsibility 2]
3. [Responsibility 3]

## Expertise
- [Skill 1]
- [Skill 2]
- [Skill 3]

## Inputs
- [What this agent needs to start work]

## Outputs
- [What this agent produces]

## Collaboration
- Works with: [Other agents]
- Reports to: [PMO / none]

## Quality Standards
- [Standard 1]
- [Standard 2]

## Response Format
[Follow standard response format above]
```

### 8.2 Activation

1. Create prompt file in `/agents/prompts/`
2. Add to `/agents/registry.json`
3. Test with sample task
4. Document in this file

---

## 9. Best Practices

### For All Agents

1. **Be Decisive**: Make clear recommendations
2. **Be Specific**: Provide exact file paths and code
3. **Be Complete**: Don't leave tasks half-done
4. **Be Collaborative**: Acknowledge dependencies
5. **Be Documented**: Update docs with changes

### For Agent Factory

1. **Spawn Sparingly**: Only when needed
2. **Scope Clearly**: Define exact responsibilities
3. **Integrate Smoothly**: Ensure handoff protocols
4. **Retire Gracefully**: Archive when task complete

---

*The Agent System is the brain of ProjectX OS. Maintain and evolve it carefully.*
