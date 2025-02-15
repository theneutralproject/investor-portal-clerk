'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import posthog from 'posthog-js';

function PostHogCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = `${window.location.origin}${pathname}`;
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
      posthog.capture('$pageview', { current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}

const PageViewTracker = () => {
  return (
    <Suspense>
      <PostHogCapture />
    </Suspense>
  );
};

export default PageViewTracker;
