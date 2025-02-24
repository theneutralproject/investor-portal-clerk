'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import useRegisterUser from '@/app/hooks/useRegisterUser';
import { useUser } from '@clerk/nextjs';

const OnboardingPage = () => {
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
      console.log('router ready, reloading user');
      await user?.reload();
      console.log('redirecting', redirectUrl || '/dashboard');
      setTimeout(() => {
        router?.push(redirectUrl || '/dashboard');
      }, 1000);
    }

    if (data) {
      void onboardedProcess();
    }
  }, [router, data, user, redirectUrl]);

  return <DashboardSkeleton />;
};

export default OnboardingPage;
