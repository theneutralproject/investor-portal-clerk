import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { test, expect, Page } from '@playwright/test';
import {
  COMPLETE_INVESTMENT,
  DASHBOARD_PAGE_BANNER_TEST_ID,
  DASHBOARD_PROJECTS_TEST_ID,
  DOCUMENTS_NEW_TEST_ID,
  INVESTMENT_SUMMARY_TEST_ID,
  USER_AVATAR_TEST_ID,
} from 'e2e/testIds';

test.describe('authentication view tests', () => {
  test.describe('Dashboard Page', async () => {
    test.describe.configure({ mode: 'parallel' });
    let dashboardPage: Page;

    test.beforeAll(async ({ browser }) => {
      dashboardPage = await browser.newPage();
      await dashboardPage.setExtraHTTPHeaders({
        Authorization: '',
      });
      await setupClerkTestingToken({ page: dashboardPage });
      await dashboardPage.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    });

    test.afterAll(async () => {
      await dashboardPage.close();
    });

    test('Can view dashboard page and load project data', async () => {
      const projectCards = dashboardPage.locator(
        `[data-testid="${DASHBOARD_PROJECTS_TEST_ID}-project-card"]`
      );

      await expect(
        dashboardPage.locator(`[data-testid="${DASHBOARD_PROJECTS_TEST_ID}"]`)
      ).toBeVisible();
      await expect(
        dashboardPage.locator(
          `[data-testid="${DASHBOARD_PROJECTS_TEST_ID}-title"]`
        )
      ).toHaveText('Current Opportunities');

      // ✅ Ensure there are exactly 3 project cards
      await expect(projectCards).toHaveCount(3);

      // ✅ Check that at least one of them contains "The Edison"
      await expect(projectCards.filter({ hasText: 'The Edison' })).toHaveCount(
        1
      ); // Ensures at least one matches

      await expect(
        dashboardPage.locator(
          `[data-testid="${DASHBOARD_PAGE_BANNER_TEST_ID}"]`
        )
      ).toBeVisible();
      await expect(
        dashboardPage.locator(
          `[data-testid="${DASHBOARD_PAGE_BANNER_TEST_ID}-title"]`
        )
      ).toBeVisible();
      await expect(
        dashboardPage.locator(
          `[data-testid="${DASHBOARD_PAGE_BANNER_TEST_ID}-title"]`
        )
      ).toHaveText('Welcome to Neutral, Testi');
    });

    test('Should see "User Navbar" in dashboard page when signed in', async () => {
      // Navbar menu should be visible
      const userNavbarSelector = `[data-testid="${USER_AVATAR_TEST_ID}-user-avatar"]`;

      await dashboardPage.click(userNavbarSelector);
      await expect(
        dashboardPage.locator(`[data-testid="${USER_AVATAR_TEST_ID}-menu"]`)
      ).toBeVisible();
      // Terms link should be visible
      await expect(
        dashboardPage.locator(
          `[data-testid="${USER_AVATAR_TEST_ID}-menu-terms"]`
        )
      ).toBeVisible();
      // Privacy link should be visible
      await expect(
        dashboardPage.locator(
          `[data-testid="${USER_AVATAR_TEST_ID}-menu-privacy"]`
        )
      ).toBeVisible();
      // Sign out link should be visible
      await expect(
        dashboardPage.locator(
          `[data-testid="${USER_AVATAR_TEST_ID}-menu-sign-out"]`
        )
      ).toBeVisible();
      // User avatar should be visible
      await expect(
        dashboardPage.locator(
          `[data-testid="${USER_AVATAR_TEST_ID}-user-avatar"]`
        )
      ).toBeVisible();
    });
  });

  test.describe('Project Page', () => {
    let projectsPage: Page;

    test.beforeAll(async ({ browser }) => {
      projectsPage = await browser.newPage();
      await projectsPage.setExtraHTTPHeaders({
        Authorization: '',
      });
      await setupClerkTestingToken({ page: projectsPage });
      await projectsPage.goto('/projects/edison', {
        waitUntil: 'networkidle',
      });
    });

    test.afterAll(async () => {
      await projectsPage.close();
    });

    test('Should see project "Documents" when signed in', async () => {
      await expect(
        projectsPage.locator(`[data-testid="${DOCUMENTS_NEW_TEST_ID}"]`)
      ).toBeVisible();
    });

    test('Should see "Complete Invesments" section when signed in', async () => {
      await expect(
        projectsPage.locator(`[data-testid="${COMPLETE_INVESTMENT}"]`)
      ).toBeVisible();
    });

    test('Should see "Investment Summary" full section signed in', async () => {
      await expect(projectsPage.getByText('Investment Summary')).toBeVisible();
      await expect(
        projectsPage.locator(`[data-testid="${INVESTMENT_SUMMARY_TEST_ID}"]`)
      ).toBeVisible();

      await expect(
        projectsPage.locator(
          `[data-testid="${INVESTMENT_SUMMARY_TEST_ID}-create-account"]`
        )
      ).not.toBeVisible();
    });
  });
});
