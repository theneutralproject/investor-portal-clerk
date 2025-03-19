import { test, expect, Page } from '@playwright/test';
import {
  COMPLETE_INVESTMENT,
  DASHBOARD_POSTFOLIO_TEST_ID,
  DOCUMENTS_NEW_TEST_ID,
  INVESTMENT_SUMMARY_TEST_ID,
} from 'e2e/testIds';

test.describe('Unauthenticated User Tests', () => {
  test.describe.configure({ mode: 'parallel' });

  test.describe('Dashboard Page', async () => {
    let dashboardPage: Page;

    test.beforeAll(async ({ browser }) => {
      dashboardPage = await browser.newPage();

      await dashboardPage.goto('/signout');
      await dashboardPage.waitForLoadState('networkidle');
      await dashboardPage.goto('/dashboard', { waitUntil: 'networkidle' });
    });

    test.afterAll(async () => {
      await dashboardPage.close();
    });

    test('Should see "Sign in" button in dashboard page when logged out', async () => {
      const loginButton = dashboardPage.locator(
        `[data-testid="${DASHBOARD_POSTFOLIO_TEST_ID}-sign-in-btn"]`
      );
      await expect(loginButton).toBeVisible();
      await expect(loginButton).toHaveText('SIGN IN');
    });

    test('Should see "Sign up" button in dashboard page when logged out', async () => {
      const signUpButton = dashboardPage.locator(
        `[data-testid="${DASHBOARD_POSTFOLIO_TEST_ID}-sign-up-btn"]`
      );
      await expect(signUpButton).toBeVisible();
      await expect(signUpButton).toHaveText('CREATE ACCOUNT');
    });

    test('Should see "Invest in Tomorrow, Today" section in dashboard page when logged out', async () => {
      const signUpButton = dashboardPage.locator(
        `[data-testid="${DASHBOARD_POSTFOLIO_TEST_ID}-sign-up-btn"]`
      );
      await expect(signUpButton).toBeVisible();
      await expect(signUpButton).toHaveText('CREATE ACCOUNT');
    });
  });

  test.describe('Project Page', () => {
    let projectsPage: Page;

    test.beforeAll(async ({ browser }) => {
      projectsPage = await browser.newPage();

      await projectsPage.goto('/signout');
      await projectsPage.waitForLoadState('networkidle');
      await projectsPage.goto('/projects/edison', { waitUntil: 'networkidle' });
    });

    test.afterAll(async () => {
      await projectsPage.close();
    });

    test('Should not see project "Documents" when logged out', async () => {
      await expect(
        projectsPage.locator(`[data-testid="${DOCUMENTS_NEW_TEST_ID}"]`)
      ).not.toBeVisible();
    });

    test('Should not see "Complete Invesments" section when logged out', async () => {
      await expect(
        projectsPage.locator(`[data-testid="${COMPLETE_INVESTMENT}"]`)
      ).not.toBeVisible();
    });

    test('Should see "Investment Summary" section blurred and with "Create an account" section when logged out', async () => {
      await expect(projectsPage.getByText('Investment Summary')).toBeVisible();
      await expect(
        projectsPage.locator(`[data-testid="${INVESTMENT_SUMMARY_TEST_ID}"]`)
      ).toBeVisible();

      await expect(
        projectsPage.locator(
          `[data-testid="${INVESTMENT_SUMMARY_TEST_ID}-create-account"]`
        )
      ).toBeVisible();
    });
  });
});
