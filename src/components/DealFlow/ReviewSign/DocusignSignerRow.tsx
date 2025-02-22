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
  //TODO What are the valid roles?
  const getRoleLabel = (role: string): string => {
    const roleMap: Record<string, string> = {
      Signer: '(You)',
      'Neutral Signer': '(Neutral)',
      'Co-investor': '(Co-investor)',
    };

    if (role.includes('Verification') || role.includes('Verifier')) {
      return '(Accreditation Verifier)';
    }

    return roleMap[role] || '';
  };

  const getStatusIcon = (status: DocusignStatus): React.ReactNode => {
    switch (status) {
      case DocusignStatus.SENT:
      case DocusignStatus.DELIVERED:
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoreHorizIcon sx={{ color: '#9e9e9e', fontWeight: 'medium' }} />
            <Typography
              variant="body2"
              sx={{ color: '#9e9e9e', fontWeight: 'medium' }}
            >
              WAITING
            </Typography>
          </Box>
        );

      case DocusignStatus.SIGNED:
      case DocusignStatus.COMPLETED:
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckIcon sx={{ color: '#4caf50', fontWeight: 'medium' }} />
            <Typography
              variant="body2"
              sx={{ color: '#4caf50', fontWeight: 'medium' }}
            >
              SIGNED
            </Typography>
          </Box>
        );

      case DocusignStatus.DECLINED:
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloseIcon sx={{ color: '#f44336', fontWeight: 'medium' }} />
            <Typography
              variant="body2"
              sx={{ color: '#f44336', fontWeight: 'medium' }}
            >
              DECLINED
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };
  const renderStatusDot = (status: DocusignStatus) => {
    switch (status) {
      case DocusignStatus.SENT:
      case DocusignStatus.DELIVERED:
        return (
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: '#BDBDBD',
            }}
          />
        );

      case DocusignStatus.SIGNED:
      case DocusignStatus.COMPLETED:
        return (
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: '#4CAF50',
            }}
          />
        );

      case DocusignStatus.DECLINED:
        return (
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: '#F44336',
            }}
          />
        );

      case DocusignStatus.FAX_PENDING:
      case DocusignStatus.AUTO_RESPONDED:
        return (
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              border: '2px solid #BDBDBD',
              bgcolor: 'transparent',
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <ListItem sx={{ py: 1, px: 0, alignItems: 'center' }}>
        <ListItemIcon
          sx={{ minWidth: 40, display: 'flex', alignItems: 'center' }}
        >
          {renderStatusDot(signer.status)}
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
              {getStatusIcon(signer.status)}
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
