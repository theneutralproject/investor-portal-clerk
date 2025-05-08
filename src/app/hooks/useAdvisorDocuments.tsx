'use client';

import { UseAdvisorDocumentsResponse } from '@/libs/types';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to fetch all documents for all client deals of an advisor.
 * @param loadRequest Whether the request should be performed or not
 * @returns React Query result for advisor documents
 */
export function useAdvisorDocuments(loadRequest = false, search: string = '') {
  return useQuery<UseAdvisorDocumentsResponse>({
    queryKey: ['advisorDocuments', search],
    queryFn: async () => {
      const params = new URLSearchParams({
        search,
      });
      const res = await fetch(`/api/advisors/documents?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch advisor documents');
      return res.json();
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: loadRequest,
  });
}
