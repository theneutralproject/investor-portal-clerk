import * as Sentry from '@sentry/nextjs';
import { initPosthog } from './libs/posthog';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }

  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    initPosthog();
  }
}

export const onRequestError = Sentry.captureRequestError;
