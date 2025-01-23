import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_SECRET: z.string(),
    E2E_CLERK_USER_USERNAME: z.string(),
    E2E_CLERK_USER_PASSWORD: z.string(),
    E2E_CLERK_USER_VERIFY_CODE: z.string(),
    E2E_CLERK_USER_PHONE: z.string(),
    ADMIN_USER_ID: z.string(),
    FINIX_USERNAME_519: z.string(),
    FINIX_USERNAME_EDISON: z.string(),
    FINIX_USERNAME_BAKERS: z.string(),
    FINIX_PASSWORD_519: z.string(),
    FINIX_PASSWORD_EDISON: z.string(),
    FINIX_PASSWORD_BAKERS: z.string(),
    FINIX_BASE_URL: z.string(),
    FINIX_WH_USERNAME: z.string(),
    FINIX_WH_PASSWORD: z.string(),
    HUBSPOT_ACCESS_TOKEN: z.string(),
    HUBSPOT_API_BASE_URL: z.string(),
    HUBSPOT_PROJECT_DOC_ACCESSED_WEBHOOK: z.string(),
    HUBSPOT_FINANCE_DOC_ACCESSED_WEBHOOK: z.string(),
    HUBSPOT_OWNER_ID: z.string(),
    SUPABASE_STORAGE_URL: z.string(),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
    BASE_URL: z.string(),
    GOOGLE_TAG_ID: z.string(),
    PRISMA_FIELD_ENCRYPTION_KEY: z.string(),
    TEST_USER_TOKEN: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_OAUTH_URL: z.string(),
    GOOGLE_ACCESS_TOKEN_URL: z.string(),
    GOOGLE_TOKEN_INFO_URL: z.string(),
    GOOGLE_CALLBACK_URL_SUBDIRECTORY: z.string(),
    JWT_SECRET: z.string(),
    IRON_SESSION_PASSWORD: z.string(),
    DOCUSIGN_BASE_PATH: z.string(),
    DOCUSIGN_USER_ID: z.string(),
    DOCUSIGN_API_ACCOUNT_ID: z.string(),
    DOCUSIGN_INTEGRATION_KEY: z.string(),
    DOCUSIGN_RSA_PRIVATE_KEY: z.string(),
    CURRENT_TERMS_REVISION: z.string(),
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
    NEXT_PUBLIC_FINIX_MERCHANT_ID_519: z.string(),
    NEXT_PUBLIC_FINIX_MERCHANT_ID_EDISON: z.string(),
    NEXT_PUBLIC_FINIX_MERCHANT_ID_BAKERS: z.string(),
    NEXT_PUBLIC_FINIX_MAX_TRANSACTION_AMOUNT: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    E2E_CLERK_USER_USERNAME: process.env.E2E_CLERK_USER_USERNAME,
    E2E_CLERK_USER_PASSWORD: process.env.E2E_CLERK_USER_PASSWORD,
    E2E_CLERK_USER_VERIFY_CODE: process.env.E2E_CLERK_USER_VERIFY_CODE,
    E2E_CLERK_USER_PHONE: process.env.E2E_CLERK_USER_PHONE,
    ADMIN_USER_ID: process.env.ADMIN_USER_ID,
    FINIX_USERNAME_519: process.env.FINIX_USERNAME_519,
    FINIX_USERNAME_EDISON: process.env.FINIX_USERNAME_EDISON,
    FINIX_USERNAME_BAKERS: process.env.FINIX_USERNAME_BAKERS,
    FINIX_PASSWORD_519: process.env.FINIX_PASSWORD_519,
    FINIX_PASSWORD_EDISON: process.env.FINIX_PASSWORD_EDISON,
    FINIX_PASSWORD_BAKERS: process.env.FINIX_PASSWORD_BAKERS,
    FINIX_BASE_URL: process.env.FINIX_BASE_URL,
    NEXT_PUBLIC_FINIX_MERCHANT_ID_BAKERS:
      process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID_BAKERS,
    NEXT_PUBLIC_FINIX_MERCHANT_ID_519:
      process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID_519,
    NEXT_PUBLIC_FINIX_MERCHANT_ID_EDISON:
      process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID_EDISON,
    NEXT_PUBLIC_FINIX_MAX_TRANSACTION_AMOUNT:
      process.env.NEXT_PUBLIC_FINIX_MAX_TRANSACTION_AMOUNT,
    FINIX_WH_USERNAME: process.env.FINIX_WH_USERNAME,
    FINIX_WH_PASSWORD: process.env.FINIX_WH_PASSWORD,
    HUBSPOT_ACCESS_TOKEN: process.env.HUBSPOT_ACCESS_TOKEN,
    HUBSPOT_API_BASE_URL: process.env.HUBSPOT_API_BASE_URL,
    HUBSPOT_PROJECT_DOC_ACCESSED_WEBHOOK:
      process.env.HUBSPOT_PROJECT_DOC_ACCESSED_WEBHOOK,
    HUBSPOT_FINANCE_DOC_ACCESSED_WEBHOOK:
      process.env.HUBSPOT_FINANCE_DOC_ACCESSED_WEBHOOK,
    HUBSPOT_OWNER_ID: process.env.HUBSPOT_OWNER_ID,
    SUPABASE_STORAGE_URL: process.env.SUPABASE_STORAGE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    BASE_URL: process.env.BASE_URL,
    GOOGLE_TAG_ID: process.env.GOOGLE_TAG_ID,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    PRISMA_FIELD_ENCRYPTION_KEY: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
    TEST_USER_TOKEN: process.env.TEST_USER_TOKEN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_OAUTH_URL: process.env.GOOGLE_OAUTH_URL,
    GOOGLE_ACCESS_TOKEN_URL: process.env.GOOGLE_ACCESS_TOKEN_URL,
    GOOGLE_TOKEN_INFO_URL: process.env.GOOGLE_TOKEN_INFO_URL,
    GOOGLE_CALLBACK_URL_SUBDIRECTORY:
      process.env.GOOGLE_CALLBACK_URL_SUBDIRECTORY,
    JWT_SECRET: process.env.JWT_SECRET,
    IRON_SESSION_PASSWORD: process.env.IRON_SESSION_PASSWORD,
    DOCUSIGN_BASE_PATH: process.env.DOCUSIGN_BASE_PATH,
    DOCUSIGN_USER_ID: process.env.DOCUSIGN_USER_ID,
    DOCUSIGN_API_ACCOUNT_ID: process.env.DOCUSIGN_API_ACCOUNT_ID,
    DOCUSIGN_INTEGRATION_KEY: process.env.DOCUSIGN_INTEGRATION_KEY,
    DOCUSIGN_RSA_PRIVATE_KEY: process.env.DOCUSIGN_RSA_PRIVATE_KEY,
    CURRENT_TERMS_REVISION: process.env.CURRENT_TERMS_REVISION,
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
