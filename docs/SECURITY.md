# ProjectX OS - Security Specification

## Security Headers

### Content Security Policy
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://api.projectx.com;
frame-src 'self' https://www.youtube.com https://player.vimeo.com;
```

### Additional Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Data Protection

### localStorage Usage
- XP data only (no PII)
- Sanitized before storage
- Validated on retrieval

### No Server-Side Storage
- Stateless frontend
- No user accounts (Phase 1)
- No cookies for tracking

## Input Sanitization

### AI Orb Input
```typescript
function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 500) // Max length
    .replace(/<[^>]*>/g, '') // Strip HTML
    .replace(/[<>'"&]/g, ''); // Escape special chars
}
```

### Search Input
- Same sanitization as Orb
- No SQL (no database)
- XSS prevention

## Environment Variables

### Public (Client-side)
```
NEXT_PUBLIC_SITE_URL=https://projectx.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Private (Server-side only)
```
# Future: API keys for LLM
LLM_API_KEY=sk-...
```

### .env.example
All env vars documented with placeholders.

## Rate Limiting

### Client-side
- Debounce search: 300ms
- Throttle XP updates: 1s
- Max API calls: 100/minute (future)

## Error Handling

### Graceful Degradation
- LLM stub if API fails
- Cached responses fallback
- Error boundaries for components

### Error Messages
- No sensitive info in errors
- User-friendly messages
- Console errors in dev only

## Audit Checklist

- [ ] CSP headers configured
- [ ] Security headers in next.config.js
- [ ] No exposed API keys
- [ ] Input sanitization complete
- [ ] localStorage data validated
- [ ] Error boundaries implemented
- [ ] Rate limiting in place
- [ ] Dependency audit passed (`npm audit`)

## Incident Response

1. Identify vulnerability
2. Assess impact
3. Patch immediately
4. Deploy fix
5. Post-mortem documentation

---

*Document maintained by Security Engineer Agent*
