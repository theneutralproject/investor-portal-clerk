// The setup function runs before each test

import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { test as setup } from "@playwright/test";
import path from "path";

setup("global setup", async ({}) => {
    console.log("In Global setup");
  await clerkSetup();

  if (
    !process.env.E2E_CLERK_USER_USERNAME ||
    !process.env.E2E_CLERK_USER_PASSWORD
  ) {
    throw new Error(
      "Please provide E2E_CLERK_USER_USERNAME and E2E_CLERK_USER_PASSWORD environment variables."
    );
  }
});

const authFile = path.join(__dirname, "../playwright/.clerk/user.json");

setup("authenticate", async ({ page }) => {
  console.log("in setup/ authenticate");
  await page.goto("/");
  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: process.env.E2E_CLERK_USER_USERNAME!,
      password: process.env.E2E_CLERK_USER_PASSWORD!,
    },
  });
  await page.goto("/dashboard");
  await page.getByText('Offerings');
  
  const pageContext = await page.context();
  
  let cookies = await pageContext.cookies();

  // clerk polls the session cookie, so we have to set a wait
  while (!cookies.some(c => c.name === '__session')) {
    cookies = await pageContext.cookies();
  }

  // store the cookies in the state.json
  await pageContext.storageState({ path: authFile });
});