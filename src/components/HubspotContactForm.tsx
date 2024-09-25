import React, { useState } from "react";
import { Button, Modal, Box } from "@mui/material";

function HubspotContactForm({ onExit }: { onExit?: () => void }) {
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
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: 450,
    bgcolor: "#1b323e",
    p: 2,
  };

  return (
    <div>
      <Button
        variant="neutralBlack"
        sx={{ p: "4px 20px", borderRadius: "99px" }}
        fullWidth
        onClick={() => {
          handleOpen();
        }}
      >
        Send an Email
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
            style={{ width: "100%", height: "100%" }}
            src="https://share.hsforms.com/1qNeQazGrSMuSu61GfzUWvAedxrp"
          />
        </Box>
      </Modal>
    </div>
  );
}

export default HubspotContactForm;
