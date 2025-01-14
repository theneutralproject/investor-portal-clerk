import { test, expect } from '@playwright/test';

test.describe('authentication view tests', () => {
  test('Can view dashboard page and load project data', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

    // await expect(page.getByText('Projects')).toBeVisible();
    await expect(page.getByText('The Edison')).toBeVisible();
    await expect(page.getByText('Welcome to Neutral')).toBeVisible();
  });
});
