'use client';

import { UserWithAddress } from '@/libs/types';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to fetch the user profile data associated with a specific advisor's client.
 *
 * @param loadRequest - Whether the request should be executed (e.g., controlled via state or conditions).
 * @param clientId - The unique identifier for the client organization.
 * @returns A React Query result containing the user data (`UserWithAddress`) or an error object.
 *
 * @example
 * const { data, isLoading, error } = useAdvisorClientUser(true, 456);
 */
export function useAdvisorClientUser(loadRequest = false, clientId: number) {
  return useQuery<
    { user: UserWithAddress; organization: { id: number; name: string } },
    Error
  >({
    queryKey: ['advisor', 'client-user', clientId],
    queryFn: async () => {
      const res = await fetch(`/api/advisors/clients/${clientId}/user`);
      if (!res.ok) throw new Error('Failed to fetch advisor client user');
      return res.json();
    },
    retry: 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: loadRequest,
  });
}
