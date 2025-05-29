// app/context/AdvisorContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdvisorFirm } from '@prisma/client';
import { useAdvisor } from '../hooks/useAdvisor';

interface AdvisorContextValue {
  advisor: AdvisorFirm | null;
  isLoading: boolean;
  error: Error | null;
}

const AdvisorContext = createContext<AdvisorContextValue | undefined>(
  undefined
);

export const AdvisorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, isLoading, error } = useAdvisor(true);
  const [advisor, setAdvisor] = useState<AdvisorFirm | null>(null);

  useEffect(() => {
    if (data) setAdvisor(data);
  }, [data]);

  return (
    <AdvisorContext.Provider value={{ advisor, isLoading, error }}>
      {children}
    </AdvisorContext.Provider>
  );
};

export const useAdvisorContext = (enabled: boolean = false) => {
  const context = useContext(AdvisorContext);
  if (!enabled) return;

  if (!context) {
    throw new Error('useAdvisorContext must be used within an AdvisorProvider');
  }
  return context;
};
