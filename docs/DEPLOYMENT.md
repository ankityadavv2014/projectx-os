# ProjectX OS — Deployment Guide

> **Version**: 1.0.0  
> **Last Updated**: January 30, 2026

## Overview

This document covers technical deployment of ProjectX OS to production environments.

---

## 1. Deployment Targets

### Primary: Vercel
- **Recommended** for Next.js
- Edge functions for global performance
- Automatic preview deployments

### Secondary: AWS/GCP
- For enterprise self-hosted
- Docker + Kubernetes

### Development
- Local: `npm run dev`
- Preview: Vercel Preview URLs

---

## 2. Environment Variables

### Required

```env
# App
NEXT_PUBLIC_APP_URL=https://projectx.school
NEXT_PUBLIC_APP_NAME=ProjectX OS

# Feature Flags
NEXT_PUBLIC_FEATURE_MOCK_AUTH=false
NEXT_PUBLIC_FEATURE_ANALYTICS=true

# Database (when ready)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Auth (when ready)
NEXTAUTH_URL=https://projectx.school
NEXTAUTH_SECRET=your-secret-key

# Storage (when ready)
STORAGE_BUCKET=projectx-artifacts
STORAGE_REGION=us-east-1
```

### Optional

```env
# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_GA_ID=G-xxx

# Error Tracking
SENTRY_DSN=https://xxx@sentry.io/xxx

# Email
RESEND_API_KEY=re_xxx
```

---

## 3. Build Configuration

### Next.js Config

```typescript
// next.config.ts
const config = {
  // Performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Security
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
  
  // Images
  images: {
    domains: ['projectx.school', 'storage.projectx.school'],
  },
};
```

---

## 4. Vercel Deployment

### Setup

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_APP_URL production
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### vercel.json

```json
{
  "framework": "nextjs",
  "regions": ["iad1", "sfo1", "fra1", "sin1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-DNS-Prefetch-Control", "value": "on" }
      ]
    }
  ]
}
```

---

## 5. Docker Deployment

### Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_APP_URL=https://projectx.school
    depends_on:
      - db
  
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=projectx
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=projectx

volumes:
  postgres_data:
```

---

## 6. CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install
        run: npm ci
      
      - name: Type Check
        run: npm run typecheck
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 7. Database Migrations

### Using Drizzle (recommended)

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate

# Push schema (dev only)
npm run db:push
```

### Migration Scripts

```typescript
// drizzle.config.ts
export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
};
```

---

## 8. Monitoring

### Health Check Endpoint

```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION,
  });
}
```

### Metrics to Track

| Metric | Target | Alert |
|--------|--------|-------|
| Response Time (p95) | < 200ms | > 500ms |
| Error Rate | < 0.1% | > 1% |
| Uptime | 99.9% | < 99% |
| Build Time | < 60s | > 120s |

---

## 9. Rollback Procedure

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback <deployment-url>
```

### Docker
```bash
# Tag current as backup
docker tag projectx:latest projectx:backup

# Pull previous
docker pull projectx:previous

# Restart
docker-compose up -d
```

---

## 10. Security Checklist

### Pre-Deploy
- [ ] All secrets in environment variables
- [ ] No hardcoded credentials
- [ ] Dependencies audited (`npm audit`)
- [ ] CSP headers configured
- [ ] Rate limiting enabled

### Post-Deploy
- [ ] SSL certificate valid
- [ ] Security headers verified
- [ ] Error pages don't leak info
- [ ] Logging configured
- [ ] Monitoring active

---

## 11. Performance Checklist

### Pre-Deploy
- [ ] Images optimized
- [ ] Bundle analyzed
- [ ] Lazy loading implemented
- [ ] Caching configured

### Post-Deploy
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals green
- [ ] CDN configured
- [ ] Compression enabled

---

## 12. DNS Configuration

### Records

```
# Root domain
projectx.school.    A       76.76.21.21

# Subdomains
app.projectx.school.    CNAME   cname.vercel-dns.com.
api.projectx.school.    CNAME   cname.vercel-dns.com.
```

### SSL
- Automatic via Vercel/Cloudflare
- Force HTTPS redirect

---

*Follow this guide for all production deployments. Update as infrastructure evolves.*
