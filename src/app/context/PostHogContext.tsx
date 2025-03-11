// app/providers.tsx
'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect, useState } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [posthogInitialized, setPosthogInitialized] = useState<boolean>(false);
  useEffect(() => {
    if (posthogInitialized) {
      return;
    }

    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      });
      setPosthogInitialized(true);
    }
  }, [posthogInitialized, setPosthogInitialized]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
