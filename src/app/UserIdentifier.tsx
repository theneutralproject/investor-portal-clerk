'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import posthog from 'posthog-js';
import { useRouter } from 'next/navigation';
import { useTermsContext } from '@/app/context/TermsContext';
import useTermsStatus from '@/app/hooks/useTermsStatus';

export default function UserIdentifier() {
  const { user } = useUser();
  const router = useRouter();
  const [loadTermsStatus, setLoadTermStatus] = useState<boolean>(false);
  const { setTermsStatus } = useTermsContext();
  const { data, isLoading } = useTermsStatus(!!user && loadTermsStatus);

  useEffect(() => {
    if (user) {
      const { id, primaryEmailAddress, firstName, lastName } = user;
      posthog.identify(primaryEmailAddress?.toString(), {
        email: primaryEmailAddress?.toString(),
        firstname: firstName,
        lastname: lastName,
        id: id,
      });
      setLoadTermStatus(true);

      // Fetch user data from API
      const fetchUser = async () => {
        try {
          const response = await fetch('/api/users');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const userData = await response.json();

          //Force redirect to /referral if user has no referral source
          if (!userData.referralSource || userData.referralSource.length <= 1) {
            const currentPath = window.location.pathname;
            router.push(
              `/referral?redirectUrl=${encodeURIComponent(currentPath)}`
            );
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      void fetchUser();
    }
  }, [user, router]);

  useEffect(() => {
    if (!isLoading && data) {
      setLoadTermStatus(false);
      setTermsStatus(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data]);

  return null;
}
