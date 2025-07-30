import { useState, useEffect } from 'react';
import axios from 'axios';
import { NDAAgreement } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

export const useAcceptNDA = (
  enable: boolean,
  documentsQueryKey: (string | number | undefined)[]
) => {
  const queryClient = useQueryClient();
  const [data, setData] = useState<null | NDAAgreement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enable) return;

    const acceptNDA = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post<{ data: NDAAgreement }>(
          '/api/users/nda'
        );
        console.log(response.data);
        setData(response.data.data);

        queryClient.invalidateQueries(documentsQueryKey as any);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to accept NDA');
      } finally {
        setIsLoading(false);
      }
    };

    acceptNDA();
  }, [documentsQueryKey, enable, queryClient]);

  return { data, isLoading, error };
};

export default useAcceptNDA;
