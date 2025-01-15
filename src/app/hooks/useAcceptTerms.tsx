import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAcceptTerms = (enable: boolean) => {
  const [data, setData] = useState<null | {
    hasAcceptedCurrentRevision: boolean;
  }>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enable) {
      return;
    }
    const fetchTermsStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post('/api/users/terms');
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to accept terms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTermsStatus();
  }, [enable]);

  return { data, isLoading, error };
};

export default useAcceptTerms;
