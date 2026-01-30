#!/usr/bin/env node
/**
 * Agent Factory CLI
 * 
 * Spawns specialized sub-agents for specific tasks.
 * These agents inherit from core agents but have focused expertise.
 * 
 * Usage:
 *   npx ts-node agents/factory/agent-factory.ts spawn <type> --context="..."
 *   npx ts-node agents/factory/agent-factory.ts list
 *   npx ts-node agents/factory/agent-factory.ts describe <type>
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPES
// ============================================================================

interface AgentSpec {
  type: string;
  name: string;
  parentAgent: string;
  description: string;
  capabilities: string[];
  context?: string;
}

interface SpawnedAgent {
  id: string;
  spec: AgentSpec;
  prompt: string;
  createdAt: Date;
}

// ============================================================================
// AGENT REGISTRY
// ============================================================================

const SPECIALIST_AGENTS: Record<string, Omit<AgentSpec, 'context'>> = {
  animation: {
    type: 'animation',
    name: 'Animation Specialist',
    parentAgent: 'frontend-lead',
    description: 'Expert in Framer Motion, CSS animations, and micro-interactions',
    capabilities: [
      'Create smooth transitions',
      'Implement scroll-triggered animations',
      'Build loading states and skeletons',
      'Optimize animation performance',
      'Design gesture interactions',
    ],
  },
  a11y: {
    type: 'a11y',
    name: 'Accessibility Auditor',
    parentAgent: 'ux-architect',
    description: 'Expert in WCAG compliance and inclusive design',
    capabilities: [
      'Audit for WCAG 2.1 AA compliance',
      'Review keyboard navigation',
      'Test with screen readers',
      'Improve color contrast',
      'Add ARIA labels and roles',
    ],
  },
  perf: {
    type: 'perf',
    name: 'Performance Optimizer',
    parentAgent: 'frontend-lead',
    description: 'Expert in Core Web Vitals and performance optimization',
    capabilities: [
      'Analyze Lighthouse scores',
      'Optimize bundle size',
      'Implement code splitting',
      'Reduce render blocking resources',
      'Improve LCP, FID, CLS',
    ],
  },
  testing: {
    type: 'testing',
    name: 'Testing Specialist',
    parentAgent: 'qa-engineer',
    description: 'Expert in test automation and coverage',
    capabilities: [
      'Write Playwright E2E tests',
      'Create unit tests with Vitest',
      'Set up test infrastructure',
      'Implement visual regression testing',
      'Mock APIs and external services',
    ],
  },
  seo: {
    type: 'seo',
    name: 'SEO Specialist',
    parentAgent: 'product-manager',
    description: 'Expert in search engine optimization and metadata',
    capabilities: [
      'Optimize meta tags',
      'Implement structured data',
      'Improve site performance for SEO',
      'Create sitemap and robots.txt',
      'Analyze search rankings',
    ],
  },
  copy: {
    type: 'copy',
    name: 'Copywriter',
    parentAgent: 'creative-director',
    description: 'Expert in brand voice and compelling copy',
    capabilities: [
      'Write headlines and taglines',
      'Create product descriptions',
      'Develop brand voice guidelines',
      'Write microcopy for UX',
      'Craft call-to-action text',
    ],
  },
  api: {
    type: 'api',
    name: 'API Designer',
    parentAgent: 'backend-lead',
    description: 'Expert in API design and documentation',
    capabilities: [
      'Design RESTful endpoints',
      'Create OpenAPI specifications',
      'Implement error handling patterns',
      'Design data models',
      'Document API usage',
    ],
  },
  security: {
    type: 'security',
    name: 'Security Auditor',
    parentAgent: 'security-engineer',
    description: 'Expert in penetration testing and vulnerability assessment',
    capabilities: [
      'Conduct security audits',
      'Test for common vulnerabilities',
      'Review authentication flows',
      'Analyze dependency security',
      'Implement security fixes',
    ],
  },
};

// ============================================================================
// PROMPT GENERATION
// ============================================================================

function generatePrompt(spec: AgentSpec): string {
  const template = `# ${spec.name}

## Role
I am a specialized ${spec.name} agent, spawned from the ${spec.parentAgent} agent for the ProjectX OS project.

## Description
${spec.description}

## Context
${spec.context || 'No specific context provided.'}

## Capabilities
${spec.capabilities.map((c) => `- ${c}`).join('\n')}

## Parent Agent
I inherit knowledge and standards from the **${spec.parentAgent}** agent. I follow their guidelines while applying my specialized expertise.

## Working Style
1. Focus on my area of expertise
2. Consult parent agent for broader decisions
3. Document all recommendations
4. Provide actionable code examples
5. Consider project constraints (performance, accessibility, brand)

## Communication
When I need to escalate or collaborate:
- Tag relevant core agents
- Provide clear context
- Share specific recommendations
- Offer multiple solutions when applicable

---
*Spawned by Agent Factory*
*Created: ${new Date().toISOString()}*
`;

  return template;
}

// ============================================================================
// CLI COMMANDS
// ============================================================================

function listAgents(): void {
  console.log('\n🤖 Available Specialist Agents:\n');
  
  Object.entries(SPECIALIST_AGENTS).forEach(([key, spec]) => {
    console.log(`  ${key.padEnd(12)} - ${spec.name}`);
    console.log(`               ${spec.description}\n`);
  });
}

function describeAgent(type: string): void {
  const spec = SPECIALIST_AGENTS[type];
  
  if (!spec) {
    console.error(`❌ Unknown agent type: ${type}`);
    console.log('   Run "agent-factory list" to see available types.');
    process.exit(1);
  }

  console.log(`\n🤖 ${spec.name}\n`);
  console.log(`Type:        ${spec.type}`);
  console.log(`Parent:      ${spec.parentAgent}`);
  console.log(`Description: ${spec.description}`);
  console.log(`\nCapabilities:`);
  spec.capabilities.forEach((c) => console.log(`  • ${c}`));
  console.log('');
}

function spawnAgent(type: string, context?: string): SpawnedAgent {
  const baseSpec = SPECIALIST_AGENTS[type];
  
  if (!baseSpec) {
    console.error(`❌ Unknown agent type: ${type}`);
    console.log('   Run "agent-factory list" to see available types.');
    process.exit(1);
  }

  const spec: AgentSpec = {
    ...baseSpec,
    context,
  };

  const prompt = generatePrompt(spec);
  const agent: SpawnedAgent = {
    id: `${type}-${Date.now()}`,
    spec,
    prompt,
    createdAt: new Date(),
  };

  // Save to spawned agents directory
  const outputDir = path.join(__dirname, '..', 'spawned');
  const outputFile = path.join(outputDir, `${agent.id}.md`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, prompt);

  console.log(`\n✅ Spawned: ${spec.name}`);
  console.log(`   ID: ${agent.id}`);
  console.log(`   File: ${outputFile}\n`);

  return agent;
}

// ============================================================================
// MAIN
// ============================================================================

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'list':
      listAgents();
      break;

    case 'describe':
      const describeType = args[1];
      if (!describeType) {
        console.error('❌ Usage: agent-factory describe <type>');
        process.exit(1);
      }
      describeAgent(describeType);
      break;

    case 'spawn':
      const spawnType = args[1];
      if (!spawnType) {
        console.error('❌ Usage: agent-factory spawn <type> [--context="..."]');
        process.exit(1);
      }
      
      // Parse --context flag
      const contextArg = args.find((a) => a.startsWith('--context='));
      const context = contextArg?.replace('--context=', '').replace(/"/g, '');
      
      spawnAgent(spawnType, context);
      break;

    default:
      console.log(`
🏭 Agent Factory - ProjectX OS

Commands:
  list              List all available specialist agents
  describe <type>   Show details about a specific agent type
  spawn <type>      Spawn a new specialist agent
                    Options:
                      --context="..."  Provide task-specific context

Examples:
  agent-factory list
  agent-factory describe animation
  agent-factory spawn animation --context="Create hero section animations"
`);
  }
}

main();
