import React from 'react';
import {
  Box,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import { SigningParticipant, DocusignStatus } from './ReviewingInvestment';

interface DocusignSignerRowProps {
  signer: SigningParticipant;
  isLast: boolean;
}

const DocusignSignerRow: React.FC<DocusignSignerRowProps> = ({
  signer,
  isLast,
}) => {
  const roleLabels: Record<string, string> = {
    Signer: '(You)',
    'Neutral Signer': '(Neutral)',
    'Co-investor': '(Co-investor)',
  };

  const getRoleLabel = (role: string): string => {
    if (role.includes('Verification') || role.includes('Verifier')) {
      return '(Accreditation Verifier)';
    }
    return roleLabels[role] || '';
  };

  const statusStyles = {
    waiting: { color: '#9e9e9e', text: 'WAITING', icon: <MoreHorizIcon /> },
    signed: { color: '#4caf50', text: 'SIGNED', icon: <CheckIcon /> },
    declined: { color: '#f44336', text: 'DECLINED', icon: <CloseIcon /> },
  };

  const statusDotStyles = {
    filled: (color: string) => ({
      width: 12,
      height: 12,
      borderRadius: '50%',
      bgcolor: color,
    }),
    outlined: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      border: '2px solid #BDBDBD',
      bgcolor: 'transparent',
    },
  };

  const getStatusInfo = (status: DocusignStatus) => {
    switch (status) {
      case DocusignStatus.SENT:
      case DocusignStatus.DELIVERED:
        return {
          dot: statusDotStyles.filled('#BDBDBD'),
          status: statusStyles.waiting,
        };

      case DocusignStatus.SIGNED:
      case DocusignStatus.COMPLETED:
        return {
          dot: statusDotStyles.filled('#4CAF50'),
          status: statusStyles.signed,
        };

      case DocusignStatus.DECLINED:
        return {
          dot: statusDotStyles.filled('#F44336'),
          status: statusStyles.declined,
        };

      case DocusignStatus.FAX_PENDING:
      case DocusignStatus.AUTO_RESPONDED:
        return {
          dot: statusDotStyles.outlined,
          status: null,
        };

      default:
        return {
          dot: null,
          status: null,
        };
    }
  };

  const renderStatusIcon = (
    style:
      | typeof statusStyles.waiting
      | typeof statusStyles.signed
      | typeof statusStyles.declined
      | null
  ) => {
    if (!style) return null;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {React.cloneElement(style.icon, {
          sx: { color: style.color, fontWeight: 'medium' },
        })}
        <Typography
          variant="body2"
          sx={{ color: style.color, fontWeight: 'medium' }}
        >
          {style.text}
        </Typography>
      </Box>
    );
  };

  const { dot, status } = getStatusInfo(signer.status);

  return (
    <React.Fragment>
      <ListItem sx={{ py: 1, px: 0, alignItems: 'center' }}>
        <ListItemIcon
          sx={{ minWidth: 40, display: 'flex', alignItems: 'center' }}
        >
          {dot && <Box sx={dot} />}
        </ListItemIcon>
        <ListItemText
          primary={
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.5,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {signer.name} {getRoleLabel(signer.role)}
              </Typography>
              {renderStatusIcon(status)}
            </Box>
          }
          secondary={
            <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
              {signer.email}
            </Typography>
          }
        />
      </ListItem>
      {!isLast && (
        <Box
          sx={{
            position: 'relative',
            left: 5,
            height: 30,
            width: 1,
            borderLeft: '2px solid #e0e0e0',
          }}
        />
      )}
    </React.Fragment>
  );
};

export default DocusignSignerRow;
