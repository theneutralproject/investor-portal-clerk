'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import useAcceptTerms from '@/app/hooks/useAcceptTerms';

// Define the shape of the context state
interface TermsContextState {
  hasAcceptedCurrentRevision: boolean | null; // Null initially, boolean after API resolves
  showModal: boolean;
  acceptTerms: () => void;
  setTermsStatus: (termStatus: { hasAcceptedCurrentRevision: boolean }) => void;
}

// Create the context
const TermsContext = createContext<TermsContextState | undefined>(undefined);

// Create a provider
export const TermsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [onAcceptTerms, setOnAcceptTerms] = useState<boolean>(false);
  const [termsStatus, setTermsStatus] = useState<{
    hasAcceptedCurrentRevision: boolean;
  } | null>(null);
  const {
    data: dataAcceptTerms,
    isLoading: isLoadingAcceptTerms,
    error: errorAcceptTerms,
  } = useAcceptTerms(onAcceptTerms);

  useEffect(() => {
    if (termsStatus && !termsStatus.hasAcceptedCurrentRevision) {
      setShowModal(true);
    }
  }, [termsStatus]);

  useEffect(() => {
    if (!isLoadingAcceptTerms && errorAcceptTerms) {
      setShowModal(true);
    }
    if (dataAcceptTerms?.hasAcceptedCurrentRevision) {
      setShowModal(false);
      setOnAcceptTerms(false);
    }
  }, [errorAcceptTerms]);

  const acceptTerms = () => {
    setShowModal(false);
    setOnAcceptTerms(true);
  };

  return (
    <TermsContext.Provider
      value={{
        hasAcceptedCurrentRevision:
          termsStatus?.hasAcceptedCurrentRevision || false,
        showModal,
        acceptTerms,
        setTermsStatus,
      }}
    >
      {children}
    </TermsContext.Provider>
  );
};

// Hook to use the context
export const useTermsContext = () => {
  const context = useContext(TermsContext);
  if (!context) {
    throw new Error('useTermsContext must be used within a TermsProvider');
  }
  return context;
};
