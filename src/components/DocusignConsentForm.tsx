import React, { useState } from 'react';
import { Button, Modal, Box } from '@mui/material';

function DocusignConsentForm({
  consentUrl,
  onExit,
}: {
  consentUrl: string;
  onExit?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
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
    height: 450,
    bgcolor: '#1b323e',
    p: 2,
  };

  return (
    <div>
      <Button
        variant="neutralBlack"
        sx={{}}
        fullWidth
        onClick={() => {
          handleOpen();
        }}
      >
        Authenticate with Docusign
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <iframe
            title="Docusign"
            style={{ width: '100%', height: '100%' }}
            src={consentUrl}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default DocusignConsentForm;
