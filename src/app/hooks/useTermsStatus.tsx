import { useState, useEffect } from 'react';
import axios from 'axios';
import { localStorageHandler, TERMS_CACHE_KEY } from '@/libs/localStorage';

const CURRENT_TERMS_REVISION = parseInt(
  process.env.NEXT_PUBLIC_CURRENT_TERMS_REVISION || '1',
  10
);

export const useTermsStatus = (
  userExists: boolean,
  clerkUserId?: number | string
) => {
  const [data, setData] = useState<null | {
    hasAcceptedCurrentRevision: boolean;
    isAdvisor: boolean;
  }>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userExists) return;

    const fetchTermsStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Retrieve cached data
        const cachedTerms = localStorageHandler.get(TERMS_CACHE_KEY);
        if (cachedTerms) {
          const {
            hasAcceptedCurrentRevision,
            revision,
            clerkUserId: cachedClerkUserId,
            isAdvisor,
          } = JSON.parse(cachedTerms);

          // If revision changed or has not accepted revision or
          // clerkUserId is different, clear cache and refetch
          if (
            revision !== CURRENT_TERMS_REVISION ||
            !hasAcceptedCurrentRevision ||
            clerkUserId !== cachedClerkUserId
          ) {
            localStorageHandler.set(TERMS_CACHE_KEY, null); // Clear outdated cache
          } else {
            // Otherwise use cached data, no API call needed
            setData({ hasAcceptedCurrentRevision, isAdvisor });
            setIsLoading(false);
            return;
          }
        }

        // No valid cache, fetch from API
        const response = await axios.get('/api/users/terms');
        setData(response.data);
        localStorageHandler.set(
          TERMS_CACHE_KEY,
          JSON.stringify({
            ...response.data,
            revision: CURRENT_TERMS_REVISION,
            clerkUserId,
          })
        );
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch terms status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTermsStatus();
  }, [userExists, clerkUserId]);

  return { data, isLoading, error };
};

export default useTermsStatus;
