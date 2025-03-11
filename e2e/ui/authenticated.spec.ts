import { test, expect } from '@playwright/test';

test.describe('authentication view tests', () => {
  test('Can view dashboard page and load project data', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'networkidle' });

    // await expect(page.getByText('Projects')).toBeVisible();
    await expect(page.getByText('The Edison')).toBeVisible({
      timeout: 20000,
    });
    await expect(page.getByText('Welcome to Neutral')).toBeVisible({
      timeout: 20000,
    });
  });
});
