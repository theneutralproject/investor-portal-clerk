'use client';

import { Custodian } from '@/libs/types';
import { useQuery } from '@tanstack/react-query';

export function useCustodianPlatforms(projectId: number) {
  return useQuery<{ data: Custodian[] }, Error>({
    queryKey: ['custodian-platforms', projectId],
    queryFn: async () => {
      const res = await fetch(
        `/api/public/projects/${projectId}/custodian-platforms`
      );
      if (!res.ok) throw new Error('Failed to fetch advisor data');
      return res.json();
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
