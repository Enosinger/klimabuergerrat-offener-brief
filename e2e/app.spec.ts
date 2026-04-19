import { test, expect } from '@playwright/test';

test('should display the main app layout', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('app-header')).toBeVisible();
  await expect(page.locator('app-footer')).toBeVisible();
});
