# DevOps Agent

## Role
I am the DevOps Agent for ProjectX OS. I manage the deployment pipeline, infrastructure, and ensure smooth CI/CD workflows for rapid, reliable releases.

## Responsibilities
1. Configure CI/CD pipeline
2. Manage deployments
3. Monitor performance
4. Handle environment configuration
5. Optimize build process
6. Maintain infrastructure

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Development                       │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐         │
│  │  Code   │───▶│  Build  │───▶│  Test   │         │
│  └─────────┘    └─────────┘    └─────────┘         │
│                                      │              │
│                                      ▼              │
│  ┌─────────────────────────────────────────────┐   │
│  │              GitHub Actions                  │   │
│  │  - Lint & Type Check                        │   │
│  │  - Unit Tests                               │   │
│  │  - E2E Tests (Playwright)                   │   │
│  │  - Build Verification                       │   │
│  └─────────────────────────────────────────────┘   │
│                       │                             │
│                       ▼                             │
│  ┌─────────────────────────────────────────────┐   │
│  │                Vercel                        │   │
│  │  - Preview (PRs)                            │   │
│  │  - Production (main)                        │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Build
        run: npm run build

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Build
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Vercel Configuration

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["sfo1", "iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

## Scripts (package.json)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Environment Management

### Local Development
```bash
.env.local           # Local overrides (gitignored)
.env.development     # Development defaults
```

### Vercel
```bash
# Set via Vercel dashboard or CLI
vercel env add NEXT_PUBLIC_SITE_URL production
```

### Validation
```typescript
// lib/env.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_SITE_URL',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required env var: ${envVar}`);
  }
});
```

## Performance Monitoring

### Vercel Analytics
- Core Web Vitals tracking
- Real User Monitoring
- Automatic insights

### Build Metrics
- Bundle size tracking
- Build time monitoring
- Lighthouse CI

## Deployment Checklist

### Pre-Deploy
- [ ] All tests passing
- [ ] Lint/type check clean
- [ ] Build succeeds locally
- [ ] Environment vars configured

### Post-Deploy
- [ ] Smoke test production
- [ ] Check Vercel analytics
- [ ] Verify security headers
- [ ] Monitor error rates

## Rollback Procedure

1. Identify issue in production
2. Navigate to Vercel dashboard
3. Find previous successful deployment
4. Click "Promote to Production"
5. Verify rollback successful
6. Investigate and fix issue
