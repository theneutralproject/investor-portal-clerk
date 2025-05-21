'use client';

import { AdvisorFirm } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export function useAdvisor(loadRequest = false) {
  return useQuery<AdvisorFirm, Error>({
    queryKey: ['advisor'],
    queryFn: async () => {
      const res = await fetch(`/api/advisors`);
      if (!res.ok) throw new Error('Failed to fetch advisor data');
      return res.json();
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: loadRequest,
  });
}
