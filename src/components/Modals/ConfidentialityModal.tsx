import React from 'react';
import {
  Typography,
  Link,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';

interface IConfidentialityModalProps {
  open: boolean;
  onClose: () => void;
}

const ConfidentialityModal = ({
  open,
  onClose,
}: IConfidentialityModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '20px' }}>
          Accept Confidentiality Agreement to View
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2, flex: 1, overflow: 'auto' }}>
        <Typography sx={{ mb: 2 }}>
          By clicking “I Agree”, you agree to our{' '}
          <Link
            href="/confidentiality-agreement"
            target="_blank"
            sx={{ color: 'rgba(0, 0, 0, 0.87)' }}
          >
            confidentiality agreement
          </Link>
          .
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          size="medium"
          sx={{
            bgcolor: 'black',
            borderRadius: 12,
            '&:hover': { bgcolor: '#333' },
          }}
          onClick={onClose}
        >
          I AGREE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfidentialityModal;
