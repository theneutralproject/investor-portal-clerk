'use client';

import { AdvisorClientsResponse } from '@/libs/types';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to fetch advisor clients with pagination support.
 * @param loadRequest Whether the request should be performed or not
 * @param page Current page number
 * @param limit Number of items per page
 * @returns React Query result for advisor clients
 */
export function useAdvisorClients(
  loadRequest = false,
  page = 1,
  limit = 20,
  search = ''
) {
  return useQuery<AdvisorClientsResponse>({
    queryKey: ['advisorClients', page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
      });
      const res = await fetch(`/api/advisors/clients?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch advisor clients');
      return res.json();
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: loadRequest,
  });
}
