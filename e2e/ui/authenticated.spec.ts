import { test, expect } from '@playwright/test';

test.describe('authentication view tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      'https://polite-man-6.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js',
      route => {
        route.fulfill({
          status: 200,
          contentType: 'application/javascript',
          body: '', // Empty script to prevent CORS issues
        });
      }
    );
  });

  test('Can view dashboard page and load project data', async ({
    request,
    page,
  }) => {
    const response = await request.get('/api/public/projects');
    expect(response.status()).toBe(200);

    const body = await JSON.parse(await response.text());
    expect(response.headers()['content-type']).toBe('application/json');
    expect(body).toHaveLength(3);

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

    // await expect(page.getByText('Projects')).toBeVisible();
    await expect(page.getByText('The Edison')).toBeVisible();
    await expect(page.getByText('Welcome to Neutral')).toBeVisible();
  });
});
