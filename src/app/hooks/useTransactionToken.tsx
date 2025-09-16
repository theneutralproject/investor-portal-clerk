'use client';

import { useQuery } from '@tanstack/react-query';

export function useTransactionToken(loadRequest = false) {
  return useQuery<{ data: { token: string } }, Error>({
    queryKey: ['transactions', 'token'],
    queryFn: async () => {
      const res = await fetch(`/api/transactions/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch transaction token');
      return await res.json();
    },
    retry: 2,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: loadRequest,
  });
}
