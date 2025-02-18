// RedirectPage.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import useRegisterUser from '@/app/hooks/useRegisterUser';

const RedirectPage = () => {
  const router = useRouter();
  const { data } = useRegisterUser();
  useEffect(() => {
    if (data) {
      router.push('/dashboard');
    }
  }, [router, data]);

  return <DashboardSkeleton />;
};

export default RedirectPage;
