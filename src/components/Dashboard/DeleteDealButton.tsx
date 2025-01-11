import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Dialog,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDashboard } from './DashboardContext';

interface DeleteDealButtonProps {
  dealId: number;
}

const DeleteDealButton: React.FC<DeleteDealButtonProps> = ({ dealId }) => {
  const [open, setOpen] = useState(false);
  const { deleteDeal } = useDashboard();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      void deleteDeal(dealId);
      handleClose();
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        size="small"
        sx={{
          minWidth: 0,
          padding: '4px',
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        <CloseIcon fontSize="small" />
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-deal-dialog"
        PaperProps={{
          style: {
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.25)',
          },
        }}
      >
        <Card sx={{ maxWidth: 500 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Are you sure?
            </Typography>
            <Typography variant="body1" color="black">
              Are you sure you want to remove this deal? You cannot undo this
              action
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
            <Button
              variant="text"
              sx={{ color: 'text.secondary' }}
              onClick={handleClose}
            >
              Don&apos;t Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="neutralYellow"
              sx={{
                backgroundColor: '#d43031',
                '&:hover': { backgroundColor: '#d43031' },
              }}
            >
              Cancel Investment
            </Button>
          </CardActions>
        </Card>
      </Dialog>
    </>
  );
};

export default DeleteDealButton;
