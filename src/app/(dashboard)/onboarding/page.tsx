'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import useRegisterUser from '@/app/hooks/useRegisterUser';
import { useUser } from '@clerk/nextjs';

const Onboarding = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data } = useRegisterUser();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setRedirectUrl(params.get('redirect_url') || params.get('redirectUrl'));
    }
  }, []);

  useEffect(() => {
    async function onboardedProcess() {
      console.log('reloading user');
      await user?.reload();
      console.log('redirecting');
      router.push(redirectUrl || '/dashboard');
    }

    if (data) {
      void onboardedProcess();
    }
  }, [router, data, user, redirectUrl]);

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
