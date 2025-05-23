'use client';

import {
  Modal as MUIModal,
  Paper,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';

const ModalContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  minWidth: 400,
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflow: 'auto',
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: theme.spacing(3),
  paddingTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

const ModalFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(),
  marginBottom: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

type CenteredModalProps = {
  title?: string;
  children: ReactNode;
  open?: boolean;
  footer?: ReactNode;
  onClose: () => void;
};

export default function Modal({
  title,
  children,
  footer,
  open = false,
  onClose,
}: CenteredModalProps) {
  return (
    <MUIModal open={open} onClose={onClose}>
      <ModalContainer elevation={3}>
        {title && (
          <ModalHeader>
            <Typography
              variant="h6"
              color="rgba(0, 0, 0, 0.87)"
              fontWeight={600}
            >
              {title}
            </Typography>
          </ModalHeader>
        )}

        <Divider />
        <Box flex="1">{children}</Box>

        {footer && (
          <>
            <Divider sx={{ pt: 1, mt: 1 }} />
            <ModalFooter>{footer}</ModalFooter>
          </>
        )}
      </ModalContainer>
    </MUIModal>
  );
}
