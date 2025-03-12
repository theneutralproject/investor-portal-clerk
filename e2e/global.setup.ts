import { clerk, clerkSetup } from '@clerk/testing/playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authFile = path.join(__dirname, '../playwright/.clerk/user.json');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export default async function globalSetup() {
  console.log('Running Global Setup...');
  await clerkSetup();

  if (!process.env.E2E_CLERK_USER_PHONE) {
    throw new Error(
      'Missing Clerk environment variables: E2E_CLERK_USER_PHONE'
    );
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Signing in user with Clerk...');
  await page.goto(BASE_URL);

  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'phone_code',
      identifier: process.env.E2E_CLERK_USER_PHONE!,
    },
  });

  await page.goto(`${BASE_URL}/dashboard`);

  const pageContext = page.context();
  let cookies = await pageContext.cookies();

  while (!cookies.some(c => c.name === '__session')) {
    cookies = await pageContext.cookies();
  }

  await pageContext.storageState({ path: authFile });

  console.log('Clerk authentication completed. Session stored.');
  await browser.close();
}
