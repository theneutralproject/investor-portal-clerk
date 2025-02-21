// OnboardingPage.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import useRegisterUser from '@/app/hooks/useRegisterUser';
import { useUser } from '@clerk/nextjs';

const OnboardingPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data } = useRegisterUser();
  const searchParams = useSearchParams();
  const redirectUrl =
    searchParams.get('redirect_url') || searchParams.get('redirectUrl');

  useEffect(() => {
    async function onboardedProcess() {
      if (data) {
        await user?.reload();
        router.push(redirectUrl ? redirectUrl : '/dashboard');
      }
    }

    onboardedProcess();
  }, [router, data, user, redirectUrl]);

  return <DashboardSkeleton />;
};

export default OnboardingPage;
