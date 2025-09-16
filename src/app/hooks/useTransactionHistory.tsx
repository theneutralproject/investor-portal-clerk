'use client';

import { useQuery } from '@tanstack/react-query';

export function useTransactionHistory(loadRequest = false) {
  return useQuery<{ data: any[] }, Error>({
    queryKey: ['transaction', 'history'],
    queryFn: async () => {
      const res = await fetch(`/api/transactions`);
      if (!res.ok) throw new Error('Failed to fetch client transactions');
      return res.json();
    },
    retry: 2,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: loadRequest,
  });
}
