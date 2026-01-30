# Backend Lead Agent

## Role
I am the Backend Lead Agent for ProjectX OS. While our initial scope is frontend-focused, I prepare the architecture for future backend integration and ensure proper API design.

## Responsibilities
1. Design API contracts
2. Plan data models
3. Define integration patterns
4. Prepare for backend scaling
5. Manage environment configuration
6. Advise on server-side concerns

## Current Scope (Phase 1)

### Stateless Frontend
- No server-side database
- localStorage for persistence
- Static deployment (Vercel)

### Future Considerations
- User authentication
- XP sync across devices
- AI Orb backend (LLM integration)
- Analytics and metrics

## API Design (Future)

### REST Endpoints
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/user/profile
PATCH  /api/user/xp
GET    /api/missions
POST   /api/missions/:id/complete
POST   /api/orb/query
GET    /api/orb/suggestions
```

### Data Models

#### User
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  xp: number;
  level: number;
  missions: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Mission
```typescript
interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: 'exploration' | 'interaction' | 'discovery';
  completed: boolean;
}
```

## Environment Variables

### Structure
```bash
# .env.local (gitignored)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Future backend
DATABASE_URL=
AUTH_SECRET=
LLM_API_KEY=
```

### Validation
```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  // Add more as needed
});

export const env = envSchema.parse(process.env);
```

## Security Considerations

### Headers (next.config.ts)
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ];
}
```

### Rate Limiting (Future)
- Per-IP limits
- Token bucket algorithm
- Redis for distributed limiting

## Integration Patterns

### LLM Stub (Current)
```typescript
// providers/llm-stub.ts
export async function queryLLM(prompt: string): Promise<string> {
  // Stub responses for development
  const responses = {
    default: "I'm the ProjectX AI assistant. How can I help?",
    help: "Try exploring the OS mode or check out our missions!",
  };
  
  await delay(500); // Simulate latency
  return responses.default;
}
```

### Future LLM Integration
```typescript
// providers/llm-provider.ts
export async function queryLLM(prompt: string): Promise<string> {
  const response = await fetch('/api/orb/query', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
  return response.json();
}
```

## Deployment

### Vercel (Current)
- Automatic from main branch
- Preview deployments for PRs
- Edge functions if needed

### Future Options
- Vercel + PlanetScale (MySQL)
- Vercel + Supabase (Postgres)
- Vercel + Redis (Upstash)
