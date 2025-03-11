import { test, expect, BrowserContext, Page } from '@playwright/test';
import {
  COMPLETE_INVESTMENT,
  DASHBOARD_POSTFOLIO_TEST_ID,
  DOCUMENTS_NEW_TEST_ID,
  INVESTMENT_SUMMARY_TEST_ID,
} from 'e2e/testIds';

test.describe('Unauthenticated User Tests', () => {
  test.describe.configure({ mode: 'parallel' });

  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto('/signout');
    await page.waitForLoadState('networkidle');
  });

  test.afterAll(async () => {
    await context.close();
  });

  test.describe('Dashboard Page', async () => {
    test('Should see "Sign in" button in dashboard page when logged out', async ({
      page,
    }) => {
      await page.goto('/dashboard', { waitUntil: 'networkidle' });

      const loginButton = page.locator(
        `[data-testid="${DASHBOARD_POSTFOLIO_TEST_ID}-sign-in-btn"]`
      );
      await expect(loginButton).toBeVisible();
      await expect(loginButton).toHaveText('SIGN IN');
    });

    test('Should see "Sign up" button in dashboard page when logged out', async ({
      page,
    }) => {
      await page.goto('/dashboard', { waitUntil: 'networkidle' });

      const signUpButton = page.locator(
        `[data-testid="${DASHBOARD_POSTFOLIO_TEST_ID}-sign-up-btn"]`
      );
      await expect(signUpButton).toBeVisible();
      await expect(signUpButton).toHaveText('CREATE ACCOUNT');
    });

    test('Should see "Invest in Tomorrow, Today" section in dashboard page when logged out', async ({
      page,
    }) => {
      await page.goto('/dashboard', { waitUntil: 'networkidle' });

      const signUpButton = page.locator(
        `[data-testid="${DASHBOARD_POSTFOLIO_TEST_ID}-sign-up-btn"]`
      );
      await expect(signUpButton).toBeVisible();
      await expect(signUpButton).toHaveText('CREATE ACCOUNT');
    });
  });

  test.describe('Project Page', () => {
    test('Should not see project "Documents" when logged out', async ({
      page,
    }) => {
      await page.goto('/projects/edison', { waitUntil: 'networkidle' });

      await expect(
        page.locator(`[data-testid="${DOCUMENTS_NEW_TEST_ID}"]`)
      ).not.toBeVisible();
    });

    test('Should not see "Complete Invesments" section when logged out', async ({
      page,
    }) => {
      await page.goto('/projects/edison', { waitUntil: 'networkidle' });

      await expect(
        page.locator(`[data-testid="${COMPLETE_INVESTMENT}"]`)
      ).not.toBeVisible();
    });

    test('Should see "Investment Summary" section blurred and with "Create an account" section when logged out', async ({
      page,
    }) => {
      await page.goto('/projects/edison', { waitUntil: 'networkidle' });

      await expect(page.getByText('Investment Summary')).toBeVisible();
      await expect(
        page.locator(`[data-testid="${INVESTMENT_SUMMARY_TEST_ID}"]`)
      ).toBeVisible();

      await expect(
        page.locator(
          `[data-testid="${INVESTMENT_SUMMARY_TEST_ID}-create-account"]`
        )
      ).toBeVisible();
    });
  });
});
