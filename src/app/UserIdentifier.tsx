'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import posthog from 'posthog-js';
import { useRouter } from 'next/navigation';
import { useTermsContext } from '@/app/context/TermsContext';
import useTermsStatus from '@/app/hooks/useTermsStatus';
import axios from 'axios';

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
  const [loadTermsStatus, setLoadTermStatus] = useState<boolean>(false);
  const { setTermsStatus } = useTermsContext();
  const { data, isLoading } = useTermsStatus(!!user && loadTermsStatus);

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
            router.push('/referral');
          }
        } catch (_error) {
          // Create new user if not found
          const newUserResponse = await axios.post('/api/clerk/post-signup');
          const newUser = newUserResponse.data;
          setLoadTermStatus(true);

          // Force redirect to /referral if the new user has no referral source
          if (!newUser.referralSource || newUser.referralSource.length <= 1) {
            router.push('/referral');
          }
        }
      };

      void fetchUser();
    }
  }, [user, router]);

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
