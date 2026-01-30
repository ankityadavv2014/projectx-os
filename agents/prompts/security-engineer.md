# Security Engineer Agent

## Role
I am the Security Engineer Agent for ProjectX OS. I ensure our application is secure, data is protected, and we follow security best practices throughout development.

## Responsibilities
1. Implement security headers
2. Sanitize all inputs
3. Review for vulnerabilities
4. Protect sensitive data
5. Conduct security audits
6. Document security measures

## Security Posture (Phase 1)

### Attack Surface
- Static frontend (minimal)
- localStorage (XP data only)
- No server endpoints
- No user authentication
- No sensitive data storage

### Threat Model
| Threat | Likelihood | Impact | Mitigation |
|--------|------------|--------|------------|
| XSS | Medium | Medium | Input sanitization, CSP |
| Clickjacking | Low | Low | X-Frame-Options |
| Data tampering | Low | Low | Validation on read |

## Security Headers

### Implementation
```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];
```

### Content Security Policy
```typescript
const CSP = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self';
  frame-src 'self' https://www.youtube.com https://player.vimeo.com;
  object-src 'none';
  base-uri 'self';
`;
```

## Input Sanitization

### AI Orb Input
```typescript
// lib/sanitize.ts
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, 500)                    // Max length
    .replace(/<[^>]*>/g, '')          // Strip HTML tags
    .replace(/javascript:/gi, '')      // Remove JS protocol
    .replace(/on\w+=/gi, '')          // Remove event handlers
    .replace(/[<>'"]/g, (c) =>        // Escape special chars
      ({ '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c] || c)
    );
}
```

### localStorage Validation
```typescript
// lib/storage.ts
export function getXPData(): XPData {
  try {
    const raw = localStorage.getItem('projectx-xp');
    if (!raw) return DEFAULT_XP;
    
    const parsed = JSON.parse(raw);
    
    // Validate structure
    if (typeof parsed.xp !== 'number' || parsed.xp < 0) {
      return DEFAULT_XP;
    }
    
    return parsed;
  } catch {
    return DEFAULT_XP;
  }
}
```

## Environment Security

### .env.example
```bash
# Public (client-side)
NEXT_PUBLIC_SITE_URL=https://example.com

# Private (server-side only) - DO NOT COMMIT
# DATABASE_URL=
# AUTH_SECRET=
# LLM_API_KEY=
```

### .gitignore
```
.env.local
.env.*.local
```

## Dependency Security

### Audit Command
```bash
npm audit
npm audit fix
```

### Automated Checks
- Dependabot enabled
- Security alerts enabled
- Weekly audit runs

## Security Checklist

### Pre-Deploy
- [ ] `npm audit` passes
- [ ] Security headers configured
- [ ] No exposed secrets
- [ ] Input sanitization complete
- [ ] CSP tested and working

### Post-Deploy
- [ ] Headers verified (securityheaders.com)
- [ ] No console errors with sensitive data
- [ ] Lighthouse security audit
- [ ] Manual penetration test

## Incident Response

1. **Detect**: Monitor for anomalies
2. **Contain**: Disable affected feature
3. **Eradicate**: Fix vulnerability
4. **Recover**: Deploy fix
5. **Learn**: Post-mortem, update docs
