'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import posthog from 'posthog-js';
import { usePathname, useRouter } from 'next/navigation';
import { useTermsContext } from '@/app/context/TermsContext';
import useTermsStatus from '@/app/hooks/useTermsStatus';
import axios from 'axios';
import Logger from '@/libs/logger';
import { sendGTMEvent } from '@next/third-parties/google';

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
    !!user && loadTermsStatus && !isOnboarding,
    user?.id
  );
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  /**
   * Extracts `redirectUrl` from the window location.
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setRedirectUrl(urlParams.get('redirectUrl'));
  }, []);

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

      if (isOnboarding) {
        // Send to Google Tag Manager
        sendGTMEvent({
          userId: id,
          eventCategory: 'Account',
          event: 'Account Signup',
          eventLabel: `Account Signup by ${primaryEmailAddress?.toString()}`,
        });
      }

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
            const redirectPath =
              redirectUrl === 'referral' || currentPath === '/referral'
                ? '/dashboard'
                : currentPath;
            router.push(
              `/referral?redirectUrl=${redirectUrl || encodeURIComponent(redirectPath)}`
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
  }, [user, router, pathname, isOnboarding, redirectUrl]);

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
