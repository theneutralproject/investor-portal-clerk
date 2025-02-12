import posthog from 'posthog-js';

export function initPosthog() {
  if (
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_POSTHOG_KEY &&
    !window.__POSTHOG_LOADED__
  ) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    });
    window.__POSTHOG_LOADED__ = true;
  }
}

export default posthog;
