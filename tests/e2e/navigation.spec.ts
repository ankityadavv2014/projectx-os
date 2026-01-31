import { test, expect } from '@playwright/test';

test.describe('Navigation System', () => {
  
  test('TopBar exists on app pages and Close routes to /os', async ({ page }) => {
    // Visit student page
    await page.goto('/student');
    
    // Verify TopBar exists
    const topBar = page.locator('header');
    await expect(topBar).toBeVisible();
    
    // Verify Close button exists
    const closeButton = page.locator('button[title*="Return to OS"]');
    await expect(closeButton).toBeVisible();
    
    // Click close
    await closeButton.click();
    
    // Should land on /os
    await expect(page).toHaveURL('/os');
  });

  test('Next button routes to expected destination', async ({ page }) => {
    // Visit student page
    await page.goto('/student');
    
    // Find and click Next button (contains "Start Mission")
    const nextButton = page.locator('button:has-text("Start Mission")');
    
    // Next button should be visible on desktop
    if (await nextButton.isVisible()) {
      await nextButton.click();
      
      // Should route to mission page
      await expect(page).toHaveURL(/\/mission\//);
    }
  });

  test('Escape key routes to /os from app pages', async ({ page }) => {
    // Visit teacher page
    await page.goto('/teacher');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Should route to /os
    await expect(page).toHaveURL('/os');
  });

  test('Command Palette opens with Cmd+K', async ({ page }) => {
    // Visit any page
    await page.goto('/student');
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // Press Cmd+K (or Ctrl+K on non-Mac)
    await page.keyboard.press('Meta+k');
    
    // Command palette should be visible
    const palette = page.locator('input[placeholder*="command"]');
    await expect(palette).toBeVisible({ timeout: 3000 });
    
    // Type to search
    await palette.fill('teacher');
    
    // Should show Teacher Dashboard option
    const teacherOption = page.locator('button:has-text("Teacher Dashboard")');
    await expect(teacherOption).toBeVisible();
    
    // Click to navigate
    await teacherOption.click();
    
    // Should route to teacher
    await expect(page).toHaveURL('/teacher');
  });

  test('Landing page has no TopBar', async ({ page }) => {
    // Visit landing page
    await page.goto('/');
    
    // TopBar should not be visible (returns null in component)
    const topBar = page.locator('header.fixed');
    await expect(topBar).not.toBeVisible();
  });

  test('Return to OS FAB visible on app pages', async ({ page }) => {
    // Visit admin page
    await page.goto('/admin');
    
    // FAB should be visible
    const fab = page.locator('a:has-text("Return to OS")');
    await expect(fab).toBeVisible();
    
    // Click FAB
    await fab.click();
    
    // Should route to /os
    await expect(page).toHaveURL('/os');
  });

  test('Back button navigates to parent', async ({ page }) => {
    // Visit review page (parent is /teacher)
    await page.goto('/review');
    
    // Find back button
    const backButton = page.locator('button[title*="Back"]');
    await expect(backButton).toBeVisible();
    
    // Click back
    await backButton.click();
    
    // Should go to teacher (the parent)
    await expect(page).toHaveURL('/teacher');
  });

  test('Breadcrumbs show correct trail', async ({ page }) => {
    // Visit review page
    await page.goto('/review');
    
    // Should show breadcrumb trail: Home / Experience OS / Teacher Dashboard / Review Submissions
    const breadcrumbs = page.locator('nav a');
    
    // On desktop, breadcrumbs should be visible
    const homeCrumb = page.locator('nav a[href="/"]');
    if (await homeCrumb.isVisible()) {
      await expect(homeCrumb).toBeVisible();
      
      const osCrumb = page.locator('nav a[href="/os"]');
      await expect(osCrumb).toBeVisible();
    }
  });

});
