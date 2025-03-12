import { useState, useEffect } from 'react';
import axios from 'axios';
import { localStorageHandler, TERMS_CACHE_KEY } from '@/libs/localStorage';

export const useAcceptTerms = (enable: boolean) => {
  const [data, setData] = useState<null | {
    hasAcceptedCurrentRevision: boolean;
  }>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enable) return;

    const acceptTerms = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post('/api/users/terms');
        setData(response.data);

        // Update cache with new terms acceptance
        localStorageHandler.set(
          TERMS_CACHE_KEY,
          JSON.stringify({
            ...response.data.termEvent,
            hasAcceptedCurrentRevision: true,
            clerkId: response.data.clerkUserId,
          })
        );
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to accept terms');
      } finally {
        setIsLoading(false);
      }
    };

    acceptTerms();
  }, [enable]);

  return { data, isLoading, error };
};

export default useAcceptTerms;
