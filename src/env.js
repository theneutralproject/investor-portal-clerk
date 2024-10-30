import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_SECRET: z.string(),
    E2E_CLERK_USER_USERNAME: z.string(),
    E2E_CLERK_USER_PASSWORD: z.string(),
    E2E_CLERK_USER_VERIFY_CODE: z.string(),
    E2E_CLERK_USER_PHONE: z.string(),
    HUBSPOT_ACCESS_TOKEN: z.string(),
    HUBSPOT_API_BASE_URL: z.string(),
    HUBSPOT_PROJECT_DOC_ACCESSED_WEBHOOK: z.string(),
    HUBSPOT_FINANCE_DOC_ACCESSED_WEBHOOK: z.string(),
    HUBSPOT_OWNER_ID: z.string(),
    SUPABASE_STORAGE_URL: z.string(),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
    BASE_URL: z.string(),
    GOOGLE_TAG_ID: z.string(),
    ENCRYPTION_SECRET: z.string(),
    ENCRYPTION_SECRET_IV: z.string(),
    ENCRYPTION_METHOD: z.string(),
    TEST_USER_TOKEN: z.string(),
    IRON_SESSION_PASSWORD: z.string(),
    DOCUSIGN_BASE_PATH: z.string(),
    DOCUSIGN_USER_ID: z.string(),
    DOCUSIGN_API_ACCOUNT_ID: z.string(),
    DOCUSIGN_INTEGRATION_KEY: z.string(),
    DOCUSIGN_RSA_PRIVATE_KEY: z.string(),
  },


  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    E2E_CLERK_USER_USERNAME: process.env.E2E_CLERK_USER_USERNAME,
    E2E_CLERK_USER_PASSWORD: process.env.E2E_CLERK_USER_PASSWORD,
    E2E_CLERK_USER_VERIFY_CODE: process.env.E2E_CLERK_USER_VERIFY_CODE,
    E2E_CLERK_USER_PHONE: process.env.E2E_CLERK_USER_PHONE,
    HUBSPOT_ACCESS_TOKEN: process.env.HUBSPOT_ACCESS_TOKEN,
    HUBSPOT_API_BASE_URL: process.env.HUBSPOT_API_BASE_URL,
    HUBSPOT_PROJECT_DOC_ACCESSED_WEBHOOK: process.env.HUBSPOT_PROJECT_DOC_ACCESSED_WEBHOOK,
    HUBSPOT_FINANCE_DOC_ACCESSED_WEBHOOK: process.env.HUBSPOT_FINANCE_DOC_ACCESSED_WEBHOOK,
    HUBSPOT_OWNER_ID: process.env.HUBSPOT_OWNER_ID,
    SUPABASE_STORAGE_URL: process.env.SUPABASE_STORAGE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    BASE_URL: process.env.BASE_URL,
    GOOGLE_TAG_ID: process.env.GOOGLE_TAG_ID,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
    ENCRYPTION_SECRET_IV: process.env.ENCRYPTION_SECRET_IV,
    ENCRYPTION_METHOD: process.env.ENCRYPTION_METHOD,
    TEST_USER_TOKEN: process.env.TEST_USER_TOKEN,
    IRON_SESSION_PASSWORD: process.env.IRON_SESSION_PASSWORD,
    DOCUSIGN_BASE_PATH: process.env.DOCUSIGN_BASE_PATH,
    DOCUSIGN_USER_ID: process.env.DOCUSIGN_USER_ID,
    DOCUSIGN_API_ACCOUNT_ID: process.env.DOCUSIGN_API_ACCOUNT_ID,
    DOCUSIGN_INTEGRATION_KEY: process.env.DOCUSIGN_INTEGRATION_KEY,
    DOCUSIGN_RSA_PRIVATE_KEY: process.env.DOCUSIGN_RSA_PRIVATE_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
