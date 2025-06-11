'use client';

import { WebFlowContent } from '@/libs/types';
import { useQuery } from '@tanstack/react-query';

interface IUseWebFlowContentProps {
  collection: string;
  loadRequest?: boolean;
  offset?: number;
  limit?: number;
}

export function useWebFlowContent({
  collection,
  offset = 0,
  limit = 100,
  loadRequest = false,
}: IUseWebFlowContentProps) {
  return useQuery<WebFlowContent, Error>({
    queryKey: ['advisor', 'resources', collection],
    queryFn: async () => {
      const url = `/api/advisors/resources/?collection=${collection}&offset=${offset}&limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch webflow collection data');
      return res.json();
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: loadRequest,
  });
}
