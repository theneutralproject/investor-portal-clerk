import { useState, useEffect } from 'react';
import axios from 'axios';
import { localStorageHandler, TERMS_CACHE_KEY } from '@/libs/localStorage';
export const useRegisterUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState();

  useEffect(() => {
    const fetchClerk = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post('/api/clerk');
        setData(response.data);

        localStorageHandler.set(
          TERMS_CACHE_KEY,
          JSON.stringify({ userId: response.data.id })
        );
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to register user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClerk();
  }, []);

  return { data, isLoading, error };
};

export default useRegisterUser;
