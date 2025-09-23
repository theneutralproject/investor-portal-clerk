'use client';

import { Bill } from '@/libs/transactions/schema';
import { useQuery } from '@tanstack/react-query';

export function useTransactionHistory({ enabled = false }) {
  return useQuery<{ data: Bill[] }, Error>({
    queryKey: ['transaction', 'history'],
    queryFn: async () => {
      const res = await fetch(`/api/transactions`);
      if (!res.ok) throw new Error('Failed to fetch client transactions');
      return await res.json();
    },
    retry: 2,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled,
  });
}
