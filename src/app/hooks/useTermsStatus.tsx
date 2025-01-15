import { useState, useEffect } from 'react';
import axios from 'axios';

export const useTermsStatus = (userExists: boolean) => {
  const [data, setData] = useState<null | {
    hasAcceptedCurrentRevision: boolean;
  }>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userExists) return;

    const fetchTermsStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('/api/users/terms');
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch terms status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTermsStatus();
  }, [userExists]);

  return { data, isLoading, error };
};

export default useTermsStatus;
