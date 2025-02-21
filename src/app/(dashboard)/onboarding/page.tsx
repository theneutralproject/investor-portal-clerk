// OnboardingPage.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import useRegisterUser from '@/app/hooks/useRegisterUser';
import { useUser } from '@clerk/nextjs';

const OnboardingPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data } = useRegisterUser();
  useEffect(() => {
    async function onboardedProcess() {
      if (data) {
        await user?.reload();
        router.push('/dashboard');
      }
    }

    onboardedProcess();
  }, [router, data, user]);

  return <DashboardSkeleton />;
};

export default OnboardingPage;
