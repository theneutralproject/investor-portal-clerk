'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import useRegisterUser from '@/app/hooks/useRegisterUser';
import { useUser } from '@clerk/nextjs';

const Onboarding = () => {
  const { user } = useUser();
  const { data } = useRegisterUser();
  const searchParams = useSearchParams();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const url =
      searchParams.get('redirect_url') || searchParams.get('redirectUrl');
    setRedirectUrl(url);
  }, [searchParams]);

  useEffect(() => {
    async function onboardedProcess() {
      if (data) {
        console.log('reloading user');
        await user?.reload();
      }
      console.log('redirecting');

      window.location.assign(redirectUrl || '/dashboard');
    }

    onboardedProcess();
  }, [data, user, redirectUrl]);

  return <DashboardSkeleton />;
};

const OnboardingPage = () => {
  return (
    <Suspense>
      <Onboarding />
    </Suspense>
  );
};

export default OnboardingPage;
