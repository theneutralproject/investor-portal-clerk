import React, { useState } from 'react';
import { Button, Modal, Box } from '@mui/material';
import { usePostHog } from 'posthog-js/react';
import { captureScheduleCallClick } from '@/libs/posthog/events';

function HubspotScheduleCall({ onExit }: { onExit?: () => void }) {
  const [open, setOpen] = useState(false);
  const posthog = usePostHog();

  const handleOpen = () => {
    setOpen(true);
    captureScheduleCallClick(posthog);
  };

  const handleClose = () => {
    setOpen(false);

    if (onExit) {
      onExit();
    }
  };

  // Styles for the modal to center it
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 700,
    bgcolor: '#1b323e',
    p: 2,
  };

  return (
    <div>
      <Button
        variant="grayPill"
        sx={{ p: '4px 20px', borderRadius: '99px' }}
        fullWidth
        onClick={() => {
          handleOpen();
        }}
      >
        Schedule a Call
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <iframe
            title="hubspot"
            style={{ width: '100%', height: '100%' }}
            src="https://meetings.hubspot.com/sarah1964/neutral-intro-15?embed=true"
          />
        </Box>
      </Modal>
    </div>
  );
}

export default HubspotScheduleCall;
