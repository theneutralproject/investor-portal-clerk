'use client';

import { AdvisorFirmEmployee } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export function useAdvisorEmployees(loadRequest = false) {
  return useQuery<AdvisorFirmEmployee[], Error>({
    queryKey: ['advisor', 'employees'],
    queryFn: async () => {
      const res = await fetch(`/api/advisors/employees`);
      if (!res.ok) throw new Error('Failed to fetch advisor employees');
      return res.json();
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: loadRequest,
  });
}
