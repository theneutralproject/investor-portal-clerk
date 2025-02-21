'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import posthog from 'posthog-js';
import { usePathname, useRouter } from 'next/navigation';
import { useTermsContext } from '@/app/context/TermsContext';
import useTermsStatus from '@/app/hooks/useTermsStatus';
import axios from 'axios';
import Logger from '@/libs/logger';

/**
 * UserIdentifier component is responsible for:
 * - Identifying the user in PostHog analytics
 * - Fetching user data from the backend
 * - Redirecting users to `/referral` if they have no referral source
 * - Managing terms acceptance state in the application
 *
 * @component
 */
export default function UserIdentifier() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const isOnboarding = pathname === '/onboarding';
  const [loadTermsStatus, setLoadTermStatus] = useState<boolean>(false);
  const { setTermsStatus } = useTermsContext();
  const { data, isLoading } = useTermsStatus(
    !!user && loadTermsStatus && !isOnboarding
  );

  /**
   * Effect that runs when a user logs in.
   * - Identifies the user in PostHog.
   * - Fetches user data from `/api/users`.
   * - If no user data is found, it creates a new user via `/api/clerk/post-signup`.
   * - Redirects to `/referral` if the user lacks a referral source.
   */
  useEffect(() => {
    if (user) {
      const { id, primaryEmailAddress, firstName, lastName } = user;

      // Identify user in PostHog analytics
      posthog.identify(primaryEmailAddress?.toString(), {
        email: primaryEmailAddress?.toString(),
        firstname: firstName,
        lastname: lastName,
        id: id,
      });

      /**
       * Fetch user data from the API or create a new user if not found.
       * Redirect to `/referral` if the user lacks a referral source.
       */
      const fetchUser = async () => {
        try {
          const response = await axios.get('/api/users');
          const userData = response.data;
          setLoadTermStatus(true);

          // Force redirect to /referral if the user has no referral source
          if (!userData.referralSource || userData.referralSource.length <= 1) {
            const currentPath = window.location.pathname;
            router.push(
              `/referral?redirectUrl=${encodeURIComponent(currentPath)}`
            );
          }
        } catch (error) {
          Logger.error(error, null, {
            message: 'Error fetching user data:',
          });
        }
      };

      if (!isOnboarding) {
        void fetchUser();
      }
    }
  }, [user, router, pathname, isOnboarding]);

  /**
   * Effect that updates the terms acceptance status when data is available.
   */
  useEffect(() => {
    if (!isLoading && data) {
      setLoadTermStatus(false);
      setTermsStatus(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data]);

  return null;
}
