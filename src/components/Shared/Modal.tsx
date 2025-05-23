'use client';

import { Modal as MUIModal, Paper, Box, Typography } from '@mui/material';
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
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const ModalFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(1),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
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
            <Typography variant="h6">{title}</Typography>
          </ModalHeader>
        )}

        <Box flex="1">{children}</Box>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContainer>
    </MUIModal>
  );
}
