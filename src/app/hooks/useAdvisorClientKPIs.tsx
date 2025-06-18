'use client';

import { AdvisorClientKPIsResponse } from '@/libs/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

/**
 * Custom React Query hook to fetch portfolio KPIs for advisor clients.
 *
 * Fetches aggregated investment data from `/api/advisors/clients/kpis`, including
 * total amount invested and number of client organizations linked to the advisor's firm.
 *
 * @param {boolean} loadRequest - Whether the request should be executed. Useful for conditional fetching.
 * @returns {UseQueryResult<AdvisorClientKPIsResponse>} - React Query result containing KPIs and metadata.
 */
export function useAdvisorClientKPIs(
  loadRequest: boolean = false
): UseQueryResult<AdvisorClientKPIsResponse> {
  return useQuery<AdvisorClientKPIsResponse>({
    queryKey: ['advisor', 'clients', 'kpi'],
    queryFn: async () => {
      const res = await fetch(`/api/advisors/clients/kpi`);
      if (!res.ok) throw new Error('Failed to fetch advisor client kpis');
      return res.json();
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: loadRequest,
  });
}
