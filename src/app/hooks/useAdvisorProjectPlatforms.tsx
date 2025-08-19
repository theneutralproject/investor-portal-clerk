'use client';

import { AdvisorProjectBroker } from '@/libs/types';
import { useQuery } from '@tanstack/react-query';

export function useAdvisorProjectPlatforms(projectId: number) {
  return useQuery<{ data: AdvisorProjectBroker[] }, Error>({
    queryKey: ['advisor-project-platforms', projectId],
    queryFn: async () => {
      const res = await fetch(
        `/api/public/projects/${projectId}/advisor-project-platforms`
      );
      if (!res.ok) throw new Error('Failed to fetch advisor data');
      return res.json();
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
