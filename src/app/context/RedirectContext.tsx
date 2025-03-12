'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { localStorageHandler, REDIRECT_URL_KEY } from '@/libs/localStorage';

// Define localStorage key

interface DoRedirectType {
  path?: string;
  remove?: boolean;
}
// Define context type
interface RedirectContextType {
  getRedirectUrl: () => string | null;
  setRedirectUrl: (url: string | null) => void;
  doRedirect: (props: DoRedirectType) => void;
}

// Create the context
const RedirectContext = createContext<RedirectContextType | undefined>(
  undefined
);

// Redirect Provider component
export const RedirectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const getRedirectUrl = (): string | null =>
    localStorageHandler.get(REDIRECT_URL_KEY);
  const setRedirectUrl = (url: string | null) =>
    localStorageHandler.set(REDIRECT_URL_KEY, url);

  const doRedirect = ({ path, remove = true }: DoRedirectType) => {
    const finalPath = path || getRedirectUrl() || '/dashboard';
    if (finalPath) {
      if (remove) {
        setRedirectUrl(null);
      }
      router.push(finalPath);
    }
  };

  return (
    <RedirectContext.Provider
      value={{ getRedirectUrl, setRedirectUrl, doRedirect }}
    >
      {children}
    </RedirectContext.Provider>
  );
};

// Custom hook to use the redirect context
export const useRedirect = (): RedirectContextType => {
  const context = useContext(RedirectContext);
  if (!context) {
    throw new Error('useRedirect must be used within a RedirectProvider');
  }
  return context;
};
