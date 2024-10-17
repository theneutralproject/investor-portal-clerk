import { test } from '@playwright/test';

test.describe("authentication tests", () => {
  // by default, the user is already signed in thanks to the global setup
  test("already signed in", async ({ page }) => {
    await page.goto("/projects", { waitUntil: "domcontentloaded" });

    await page.getByText('All Projects');
    await page.getByText('The Edison');
  });

});