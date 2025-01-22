'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import posthog from 'posthog-js';
import { useTermsContext } from '@/app/context/TermsContext';
import useTermsStatus from '@/app/hooks/useTermsStatus';

export default function UserIdentifier() {
  const { user } = useUser();
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
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && data) {
      setLoadTermStatus(false);
      setTermsStatus(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data]);

  return null;
}
