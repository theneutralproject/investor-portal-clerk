'use client';
import React from 'react';
import { Fab, Button, useTheme } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { usePostHog } from 'posthog-js/react';
import { useHubspotChat } from '@/components/HubspotChatProvider';
import { captureChatOpened } from '@/libs/posthog/events';

const ChatInterface = ({ type }: { type: string }) => {
  const theme = useTheme();
  const posthog = usePostHog();
  const { isLoaded, openChat } = useHubspotChat();

  const handleOpen = () => {
    openChat();
    captureChatOpened(posthog, type);
  };

  const renderChatTrigger = () => {
    if (type === 'FAB') {
      return (
        <Fab
          onClick={handleOpen}
          disabled={!isLoaded}
          sx={{
            backgroundColor: '#626f52',
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            zIndex: 1200,
            '&.Mui-disabled': {
              backgroundColor: '#a5a5a5',
            },
          }}
        >
          <ChatIcon sx={{ color: 'white' }} />
        </Fab>
      );
    } else if (type === 'DEALFLOW_BUTTON') {
      return (
        <Button variant="grayPill" onClick={handleOpen} disabled={!isLoaded}>
          Chat
        </Button>
      );
    } else {
      return (
        <Button
          variant="neutralBlack"
          onClick={handleOpen}
          disabled={!isLoaded}
        >
          Start a Chat
        </Button>
      );
    }
  };

  return <>{renderChatTrigger()}</>;
};

export default ChatInterface;
