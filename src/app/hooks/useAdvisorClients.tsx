'use client';

import { useQuery } from '@tanstack/react-query';

interface AdvisorClient {
  client: {
    id: number;
    name: string;
    email: string;
  };
  organization: {
    id: number;
    name: string;
  };
  totalInvested: number;
  numberOfInvestments: number;
  dealTypes: string[];
  earningsToDate: number;
  projectedEarnings: number;
  totalProjectedReturn: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

interface AdvisorClientsResponse {
  clients: AdvisorClient[];
  pagination: Pagination;
}

/**
 * Hook to fetch advisor clients with pagination support.
 * @param loadRequest Whether the request should be performed or not
 * @param page Current page number
 * @param limit Number of items per page
 * @returns React Query result for advisor clients
 */
export function useAdvisorClients(loadRequest = false, page = 1, limit = 20) {
  return useQuery<AdvisorClientsResponse>({
    queryKey: ['advisorClients', page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/advisors/clients?${params.toString()}`);

      if (!res.ok) {
        throw new Error('Failed to fetch advisor clients');
      }

      return res.json();
    },
    retry: 1,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: loadRequest, // only fetch if allowed
  });
}
