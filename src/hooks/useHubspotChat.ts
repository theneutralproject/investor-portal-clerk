import { useEffect, useState } from 'react';

declare global {
  interface Window {
    HubSpotConversations?: any;
  }
}

export const useHubspotChat = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadHubSpot = () => {
      // Check if script already exists
      if (document.getElementById('hs-script-loader')) {
        console.log('HubSpot script already exists');
        return;
      }

      console.log('Loading HubSpot script...');
      const script = document.createElement('script');
      script.src = '//js.hs-scripts.com/24164917.js';
      script.async = true;
      script.defer = true;
      script.id = 'hs-script-loader';

      script.addEventListener('load', () => {
        console.log('HubSpot script loaded');
        // Wait a bit for the widget to initialize
        setTimeout(() => {
          if (window.HubSpotConversations) {
            console.log('HubSpot conversations widget initialized');
            window.HubSpotConversations.widget.load();
            setIsLoaded(true);
          } else {
            console.error('HubSpot conversations not found after script load');
          }
        }, 1000);
      });

      script.addEventListener('error', error => {
        console.error('Error loading HubSpot script:', error);
      });

      document.body.appendChild(script);
    };

    loadHubSpot();

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up HubSpot widget...');
      const existingScript = document.getElementById('hs-script-loader');
      if (existingScript) {
        existingScript.remove();
      }
      if (window.HubSpotConversations) {
        window.HubSpotConversations.widget.remove();
      }
    };
  }, []);

  const openChat = () => {
    console.log('Attempting to open chat...');
    if (window.HubSpotConversations) {
      try {
        // First ensure the widget is loaded
        window.HubSpotConversations.widget.load();
        // Then open it
        setTimeout(() => {
          window.HubSpotConversations.widget.open();
          console.log('Chat widget opened');
        }, 100);
      } catch (error) {
        console.error('Error opening HubSpot chat:', error);
      }
    } else {
      console.error('HubSpot conversations not available');
    }
  };

  return {
    isLoaded,
    openChat,
  };
};
