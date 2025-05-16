'use client';

import { UseAdvisorClientInvestmentsResponse } from '@/libs/types';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to fetch all investment records for a specific client organization
 * under an advisor's firm.
 *
 * @param loadRequest - Boolean flag to enable or disable the fetch request.
 *                      Typically controlled by component logic.
 * @param organizationId - Optional numeric ID of the client organization whose investments should be fetched.
 * @returns React Query result object containing the fetched investment data, loading status, and error (if any).
 *
 * @example
 * const { data, isLoading, error } = useAdvisorClientInvestments(true, 42);
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
