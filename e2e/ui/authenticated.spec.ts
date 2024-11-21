import { test, expect } from "@playwright/test";

test.describe("authentication view tests", () => {
  test("Can view projects page and load project data", async ({ page }) => {
    await page.goto("/projects", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("All Projects")).toBeVisible();
    await expect(page.getByText("The Edison")).toBeVisible();
    await expect(page.getByText("Welcome, User")).toBeVisible();
  });
});
