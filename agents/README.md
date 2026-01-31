# ProjectX OS — Agent System

## Overview

ProjectX OS is built by an **Agentic Organization** — a coordinated system of AI agents that work together to design, build, and maintain the platform.

## Directory Structure

```
/agents
├── factory/
│   └── agent-factory.ts    # CLI tool to spawn new agents
├── prompts/
│   ├── pmo.md              # PMO/Orchestrator prompt
│   ├── product-manager.md  # Product Manager prompt
│   ├── creative-director.md
│   ├── ux-architect.md
│   ├── frontend-lead.md
│   ├── backend-lead.md
│   ├── ai-agent-engineer.md
│   ├── security-engineer.md
│   ├── qa-engineer.md
│   └── devops.md
├── templates/
│   └── agent-template.md   # Template for new agents
├── runbooks/
│   └── README.md           # Operational runbooks
├── registry.json           # Agent registry
└── README.md               # This file
```

## Core Agents

| Agent | Role | Status |
|-------|------|--------|
| PMO | Project coordination | ✅ Active |
| Product Manager | Feature definition | ✅ Active |
| Creative Director | Design direction | ✅ Active |
| UX Architect | User experience | ✅ Active |
| Frontend Lead | UI implementation | ✅ Active |
| Backend Lead | API & database | ✅ Active |
| AI/Agent Engineer | AI systems | ✅ Active |
| Security Engineer | Security & compliance | ✅ Active |
| QA Engineer | Testing & quality | ✅ Active |
| DevOps | CI/CD & infrastructure | ✅ Active |

## Specialist Agents (Auto-Spawned)

These agents are spawned automatically after MVP milestones:

| Specialist | Scope | Status |
|------------|-------|--------|
| Performance Tuner | Lighthouse, LCP, bundle | ⏳ Pending |
| Animation Specialist | Framer Motion, microinteractions | ⏳ Pending |
| A11y Specialist | WCAG, keyboard nav | ⏳ Pending |
| SEO Specialist | Meta, sitemap, OG | ⏳ Pending |
| Telemetry Analyst | Events, analytics | ⏳ Pending |
| Component Librarian | Design system | ⏳ Pending |

## Using the Agent Factory

### Spawn a New Agent

```bash
npx ts-node agents/factory/agent-factory.ts spawn \
  --name "Performance Tuner" \
  --role "Lighthouse optimization, bundle analysis" \
  --scope "lighthouse,lcp,bundle,performance"
```

### List All Agents

```bash
npx ts-node agents/factory/agent-factory.ts list
```

### Activate a Specialist

```bash
npx ts-node agents/factory/agent-factory.ts activate --id performance-tuner
```

## Agent Communication Protocol

All agents must respond with this format:

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

## Handoff Protocol

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

## Integration with Pilot

The agent system integrates with GitHub Copilot Pilot:

1. Agent identifies task
2. Agent creates GitHub issue with `pilot` label
3. Pilot picks up and implements
4. Pilot creates PR
5. Agent reviews and merges

## Quality Gates

All agent work must pass:

- `npm run build` — No build errors
- `npm run lint` — No lint errors
- `npm run typecheck` — No type errors
- `npm test` — All tests passing

## Contributing

To add a new agent:

1. Copy `templates/agent-template.md` to `prompts/{agent-name}.md`
2. Fill in the template
3. Add entry to `registry.json`
4. Document in this README

---

*The Agent System is the brain of ProjectX OS. Maintain and evolve it carefully.*
