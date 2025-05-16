'use client';

import { PortfolioReturnsResponse } from '@/libs/returns/schema';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to fetch portfolio returns for a specific advisor client organization.
 *
 * @param loadRequest - Whether the request should be triggered (e.g., based on client-side logic or conditions).
 * @param clientId - The unique numeric identifier of the client organization.
 * @returns A React Query result object containing portfolio returns data or error state.
 *
 * @example
 * const { data, isLoading, error } = useAdvisorClientReturns(true, 123);
 */
export function useAdvisorClientReturns(loadRequest = false, clientId: number) {
  return useQuery<PortfolioReturnsResponse, Error>({
    queryKey: ['advisor', 'client-returns', clientId],
    queryFn: async () => {
      const res = await fetch(`/api/advisors/clients/${clientId}/returns`);
      if (!res.ok) throw new Error('Failed to fetch advisor client documents');
      return res.json();
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: loadRequest,
  });
}
