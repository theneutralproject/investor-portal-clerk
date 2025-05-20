'use client';

import { UseAdvisorDocumentsResponse } from '@/libs/types';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to fetch all documents associated with a specific client's deals,
 * optionally filtered by a search term.
 *
 * @param loadRequest - Boolean flag to control whether the query should run.
 * @param clientId - The unique identifier of the client organization.
 * @param search - Optional search term to filter documents by name, type, or client name.
 * @returns A React Query result object containing the advisor's client documents,
 *          loading status, and any error encountered.
 *
 * @example
 * const { data, isLoading } = useAdvisorClientDocuments(true, 123, 'K1');
 */
export function useAdvisorClientDocuments(
  loadRequest = false,
  clientId: number,
  search: string = ''
) {
  return useQuery<UseAdvisorDocumentsResponse>({
    queryKey: ['advisorClientDocuments', clientId, search],
    queryFn: async () => {
      const params = new URLSearchParams({ search });
      const res = await fetch(
        `/api/advisors/clients/${clientId}/documents?${params.toString()}`
      );
      if (!res.ok) throw new Error('Failed to fetch advisor client documents');
      return res.json();
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: loadRequest,
  });
}
