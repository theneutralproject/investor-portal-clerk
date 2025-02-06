'use client';
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

  useEffect(() => {
    const checkWidget = () => {
      if (window.HubSpotConversations?.widget) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    const loadHubSpot = () => {
      if (document.getElementById('hs-script-loader')) {
        if (checkWidget()) return;
        return;
      }

      const script = document.createElement('script');
      script.src = '//js.hs-scripts.com/24164917.js';
      script.async = true;
      script.defer = true;
      script.id = 'hs-script-loader';

      script.addEventListener('load', () => {
        const checkInterval = setInterval(() => {
          if (checkWidget()) {
            clearInterval(checkInterval);
          }
        }, 100);

        setTimeout(() => clearInterval(checkInterval), 10000);
      });

      document.body.appendChild(script);
    };

    loadHubSpot();
  }, []);

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
