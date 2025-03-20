'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import useRegisterUser from '@/app/hooks/useRegisterUser';
import { useUser } from '@clerk/nextjs';
import { useRedirect } from '@/app/context/RedirectContext';
import { sendGTMEvent } from '@next/third-parties/google';

const OnboardingPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data } = useRegisterUser();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const { doRedirect } = useRedirect();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRedirectUrl(params.get('redirect_url') || params.get('redirectUrl'));
  }, []);

  useEffect(() => {
    async function onboardedProcess() {
      await user?.reload();
      sendGTMEvent({
        userId: user?.id,
        eventCategory: 'Account',
        event: 'Account Signup',
        eventLabel: `New Account Signup by ${user?.primaryEmailAddress?.emailAddress?.toString()}`,
      });

      if (redirectUrl) {
        router.push(redirectUrl || '/dashboard');
      } else {
        // Do redirect to page but do not remove the path
        doRedirect({
          remove: false,
        });
      }
    }

    if (data) {
      void onboardedProcess();
    }
  }, [router, data, user, redirectUrl, doRedirect]);

  return <DashboardSkeleton />;
};

export default OnboardingPage;
