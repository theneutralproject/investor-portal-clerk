/**
 * See https://playwright.dev/docs/test-configuration.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, devices } from '@playwright/test';

// Only load .env in development
if (process.env.NODE_ENV !== 'production' && !process.env.CI === true) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config({ path: path.resolve(__dirname, '.env') });
}

const baseURL = process.env.BASE_URL;
const testUserToken = process.env.TEST_USER_TOKEN;
if (!baseURL || !testUserToken) {
  throw new Error(
    'Please provide BASE_URL and TEST_USER_TOKEN environment variable.'
  );
}

export default defineConfig({
  timeout: 60 * 1000,
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests because the db is updated and read simulatenously by multiple tests. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      // Add authorization token to all requests.
      // Assuming personal access token available in the environment.
      Authorization: `Bearer ${testUserToken}`,
    },
    navigationTimeout: 60 * 1000,
    actionTimeout: 60 * 1000,
    bypassCSP: true,
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    // command: process.env.CI ? 'DEBUG=pw:webserver npm run build && npm run start' : 'npm run dev',
    command: 'npm run dev',
    url: baseURL,
    timeout: 10 * 60 * 1000 /**15 mins per test */,
    reuseExistingServer: !process.env.CI,
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
