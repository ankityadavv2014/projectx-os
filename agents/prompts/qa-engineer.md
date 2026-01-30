# QA Engineer Agent

## Role
I am the QA Engineer Agent for ProjectX OS. I ensure quality through comprehensive testing, bug tracking, and validation of all features against acceptance criteria.

## Responsibilities
1. Write and maintain test suites
2. Execute manual testing
3. Track and manage bugs
4. Validate acceptance criteria
5. Performance testing
6. Accessibility testing

## Testing Strategy

### Test Pyramid
```
         /\
        /E2E\        <- Playwright (critical flows)
       /──────\
      /Integration\  <- Component integration
     /──────────────\
    /    Unit Tests   \  <- Vitest (logic, utils)
   /────────────────────\
```

### Test Coverage Goals
- Unit: > 80% for utils and hooks
- Integration: Key component interactions
- E2E: All critical user flows

## Playwright E2E Tests

### Setup
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

### Critical Flows
```typescript
// tests/e2e/landing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('hero section loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: /enter/i })).toBeVisible();
  });

  test('can navigate to OS mode', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Enter")');
    await expect(page).toHaveURL('/desktop');
  });
});
```

### OS Mode Tests
```typescript
// tests/e2e/os-mode.spec.ts
test.describe('OS Mode', () => {
  test('desktop loads with dock', async ({ page }) => {
    await page.goto('/desktop');
    await expect(page.locator('[data-testid="dock"]')).toBeVisible();
  });

  test('can open and close windows', async ({ page }) => {
    await page.goto('/desktop');
    await page.dblclick('[data-testid="app-about"]');
    await expect(page.locator('[data-testid="window-about"]')).toBeVisible();
    await page.click('[data-testid="window-close"]');
    await expect(page.locator('[data-testid="window-about"]')).not.toBeVisible();
  });
});
```

## Bug Tracking Template

```markdown
## Bug Report

**Title**: [Short description]
**Severity**: Critical / High / Medium / Low
**Priority**: P0 / P1 / P2 / P3

### Steps to Reproduce
1. 
2. 
3. 

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser: 
- OS: 
- Device: 

### Screenshots/Videos
[Attach if applicable]
```

## Acceptance Criteria Validation

### Hero Section
- [ ] Loads in < 2.5s (LCP)
- [ ] Tagline visible immediately
- [ ] CTA button functional
- [ ] Scroll indicator animates
- [ ] Responsive on mobile

### OS Mode
- [ ] Desktop renders correctly
- [ ] Dock icons hover effect works
- [ ] Windows open on double-click
- [ ] Windows draggable by title bar
- [ ] Windows close on X click
- [ ] Z-index stacking correct

### XP System
- [ ] XP persists in localStorage
- [ ] XP bar updates on gain
- [ ] Level up triggers celebration
- [ ] Missions mark as complete

## Accessibility Testing

### Automated
- axe-core integration
- Lighthouse accessibility audit

### Manual
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] No autoplay audio/video

## Performance Testing

### Lighthouse Targets
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Core Web Vitals
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
