'use client';
import React, { useState } from 'react';
import { Fab, Button, Modal, Box, useTheme } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { usePostHog } from 'posthog-js/react';
import { POSTHOG_EVENTS } from '@/app/CSPostHogProvider';

const ChatInterface = ({ type }: { type: string }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const posthog = usePostHog();

  const handleOpen = () => {
    setOpen(true);
    posthog.capture(POSTHOG_EVENTS.CHAT_OPENED, {
      type,
    });
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Determine whether to render FAB or Button based on the type prop
  const renderChatTrigger = () => {
    if (type === 'FAB') {
      return (
        <Fab
          onClick={handleOpen}
          sx={{
            backgroundColor: '#626f52',
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            zIndex: 1200, // Higher than most elements
          }}
        >
          <ChatIcon sx={{ color: 'white' }} />
        </Fab>
      );
    } else if (type === 'DEALFLOW_BUTTON') {
      return (
        <Button variant="grayPill" onClick={handleOpen}>
          Chat
        </Button>
      );
    } else {
      return (
        <Button variant="neutralBlack" onClick={handleOpen}>
          Start a Chat
        </Button>
      );
    }
  };

  return (
    <>
      {renderChatTrigger()}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 800,
            height: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            overflow: 'hidden', // Ensures no scroll bars are visible inside the modal
          }}
        >
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/g9lmo4egbpiJsKnInQrSC"
            title="Spruce - The Neutral Advisor"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default ChatInterface;
