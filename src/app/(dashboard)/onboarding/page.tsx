'use client';

import { useEffect, useState } from 'react';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import useRegisterUser from '@/app/hooks/useRegisterUser';
import { useUser } from '@clerk/nextjs';

const OnboardingPage = () => {
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
      window.location.href = redirectUrl || '/dashboard';
    }

    if (data) {
      void onboardedProcess();
    }
  }, [data, user, redirectUrl]);

  return <DashboardSkeleton />;
};

export default OnboardingPage;
