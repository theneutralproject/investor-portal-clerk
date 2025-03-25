'use client';

import { useHubspot } from '@/app/hooks/useHubspot';
import { createContext, useContext, useEffect, useState } from 'react';

interface HubspotChatContextType {
  isLoaded: boolean;
  openChat: () => void;
}

const HubspotChatContext = createContext<HubspotChatContextType>({
  isLoaded: false,
  openChat: () => {},
});

export const useHubspotChat = () => useContext(HubspotChatContext);

export function HubspotChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isLoading: isLoadingToken, hubspotData } = useHubspot();

  useEffect(() => {
    if (!hubspotData || isLoadingToken) return;

    // Prevent duplicate script load
    if (document.getElementById('hs-script-loader')) return;

    window.hsConversationsSettings = {
      loadImmediately: false,
    };

    const script = document.createElement('script');
    script.src = '//js.hs-scripts.com/24164917.js';
    script.async = true;
    script.defer = true;
    script.id = 'hs-script-loader';

    // Monitor script and widget readiness
    script.onload = () => {
      const checkInterval = setInterval(() => {
        if (window.HubSpotConversations?.widget) {
          setIsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      setTimeout(() => clearInterval(checkInterval), 10000);
    };

    if (!window.HubSpotConversations) {
      window.hsConversationsOnReady = [
        () => {
          window.hsConversationsSettings = {
            loadImmediately: true,
            identificationEmail: hubspotData?.identificationEmail,
            identificationToken: hubspotData?.identificationToken,
          };
          window.HubSpotConversations.widget.load();
        },
      ];
    }

    document.body.appendChild(script);
  }, [isLoadingToken, hubspotData]);

  const openChat = () => {
    if (!window.HubSpotConversations?.widget) return;

    try {
      window.HubSpotConversations.widget.load();
      window.HubSpotConversations.widget.open();
    } catch (error) {
      console.error('Error opening HubSpot chat:', error);
    }
  };

  return (
    <HubspotChatContext.Provider value={{ isLoaded, openChat }}>
      {children}
    </HubspotChatContext.Provider>
  );
}
