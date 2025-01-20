import { test, expect } from '@playwright/test';
import { deleteDealsFromTestContact } from 'e2e/helpers';

test.describe('dealflow logic tests', () => {
  // Store the deal ID for use across tests
  let dealId: string | null = null;

  test('Can view Edison get started page', async ({ page }) => {
    await page.goto('/dealflow/edison/new/get-started');
    // Wait for the api call to load  /api/deals/flow?projectSlug=edison&dealId=new
    await page.waitForResponse(response =>
      response.url().includes('/api/deals/flow?projectSlug=edison&dealId=new')
    );
    await expect(page.getByText('The Edison / Invest')).toBeVisible();
    await expect(page.getByText('Get Started')).toBeVisible();
    await expect(page.getByText('Investment Summary')).toBeVisible();
    await expect(page.getByText('Milwaukee, WI')).toBeVisible();
  });

  test('Can continue from get started page and store deal ID', async ({
    page,
  }) => {
    await page.goto('/dealflow/edison/new/get-started');

    // Click the continue button
    await page.getByRole('button', { name: 'Continue' }).click();

    // Wait for navigation and store the new URL
    await page.waitForURL(/.*\/dealflow\/edison\/.*\/type/);

    // Extract and store the deal ID from the URL for future tests
    const url = page.url();
    // @ts-expect-error - dealId is defined in the next line
    dealId = url.split('/edison/')[1].split('/type')[0];

    // Verify we're on the correct page
    expect(url).toMatch(/http:\/\/localhost:3000\/dealflow\/edison\/.*\/type/);
  });

  test('Can view investment type options', async ({ page }) => {
    // Use the stored dealId to navigate directly to the type page
    await page.goto(`/dealflow/edison/${dealId}/type`);

    await page.waitForTimeout(5000);

    // Verify the investment options are visible
    await expect(page.getByText('Equity Investment')).toBeVisible();
    await expect(page.getByText('Debt Investment')).toBeVisible();
  });

  test('Can view user details', async ({ page }) => {
    if (!dealId) {
      console.log('no dealId set. Skipping');
      test.skip();
      return;
    }
    // Use the stored dealId to navigate directly to the type page
    await page.goto(`/dealflow/edison/${dealId}/type`);
    console.log('dealId', dealId);
    // await expect(page.getByText("Testi Tester")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('+15555550100')).toBeVisible({
      timeout: 20000,
    });
    await expect(page.getByText('testi+clerk_test@neutral.us')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText('Individual')).toBeVisible({ timeout: 10000 });
  });

  test.afterAll(async () => {
    await deleteDealsFromTestContact();
  });
});
