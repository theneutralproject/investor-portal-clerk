import React, { useEffect, useState } from 'react';
import {
  Typography,
  Link,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import useAcceptNDA from '@/app/hooks/useAcceptNDA';

interface IConfidentialityModalProps {
  open: boolean;
  onClose: () => void;
  documentsQueryKey: (string | number | undefined)[];
}

const ConfidentialityModal = ({
  open,
  onClose,
  documentsQueryKey,
}: IConfidentialityModalProps) => {
  const [hasAcceptedNDA, setHasAcceptedNDA] = useState<boolean>(false);
  const { isLoading, error, data } = useAcceptNDA(
    hasAcceptedNDA,
    documentsQueryKey
  );
  const onAcceptNDA = () => {
    setHasAcceptedNDA(true);
  };

  useEffect(() => {
    if (hasAcceptedNDA && data) {
      onClose();
    }
  }, [hasAcceptedNDA, data, onClose]);

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
        <Typography
          variant="h6"
          sx={{ fontWeight: 500, fontSize: '20px' }}
          component={'span'}
        >
          Accept Confidentiality Agreement to View
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2, flex: 1, overflow: 'auto' }}>
        <Typography sx={{ mb: 2 }}>
          By clicking “I Agree”, you agree to our{' '}
          <Link
            href="/terms/confidentiality"
            target="_blank"
            sx={{ color: 'rgba(0, 0, 0, 0.87)' }}
          >
            confidentiality agreement
          </Link>
          .
        </Typography>
        {error && (
          <Typography sx={{ mb: 2 }} color="error">
            Sorry, an error has occurred while trying to accept confidentiality
            agreement.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          size="medium"
          sx={{
            bgcolor: 'black',
            borderRadius: 12,
            textTransform: 'uppercase',
            '&:hover': { bgcolor: '#333' },
          }}
          onClick={onAcceptNDA}
          loading={isLoading}
        >
          I Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfidentialityModal;
