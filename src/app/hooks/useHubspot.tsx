import { useEffect, useState } from 'react';

export const useHubspot = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hubspotData, setHubspotData] = useState<{
    loadImmediately?: boolean;
    identificationEmail: string;
    identificationToken: string;
    failed: boolean;
  }>();
  useEffect(() => {
    setIsLoading(true);

    const loadHubspot = async () => {
      const res = await fetch('/api/hubspot/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      setIsLoading(false);

      if (!data.token || !!data.error) {
        setHubspotData({
          identificationEmail: '',
          identificationToken: '',
          failed: true,
        });
        return;
      }

      setHubspotData({
        identificationEmail: data.email,
        identificationToken: data.token,
        failed: false,
      });
    };

    loadHubspot();
  }, []);

  return {
    isLoading,
    hubspotData,
  };
};
