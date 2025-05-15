'use client';

import { UseAdvisorClientInvestmentsResponse } from '@/libs/types';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to fetch all investments for all client of an advisor.
 * @param loadRequest Whether the request should be performed or not
 * @returns React Query result for advisor documents
 */
export function useAdvisorClientInvestments(
  loadRequest = false,
  organizationId?: number
) {
  return useQuery<UseAdvisorClientInvestmentsResponse>({
    queryKey: ['advisorClientInvestments', organizationId],
    queryFn: async () => {
      const res = await fetch(
        `/api/advisors/clients/${organizationId}/investments`
      );
      if (!res.ok)
        throw new Error('Failed to fetch advisor client investments');
      return res.json();
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: loadRequest,
  });
}
