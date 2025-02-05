import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  IconButton,
  Alert,
} from '@mui/material';
import {
  AccountBalanceWallet as WireIcon,
  Payment as PaymentIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';

interface PaymentDetail {
  label: string;
  value: string | number;
  copyable?: boolean;
}

interface PaymentDetailsCardProps {
  title: string;
  paymentType: 'wire' | 'check';
  details: PaymentDetail[];
  copied: string | null;
  onCopy?: (text: string, field: string) => void;
}

const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  title,
  paymentType,
  details,
  copied,
  onCopy,
}) => {
  const Icon = paymentType === 'wire' ? WireIcon : PaymentIcon;

  const renderDetailRow = (detail: PaymentDetail) => (
    <Stack
      key={detail.label}
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{ width: '100%' }}
    >
      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
        {detail.label}:
      </Typography>
      <Stack direction="row" alignItems="flex-start" spacing={1}>
        {copied === detail.label && (
          <Alert severity="success">Copied to clipboard</Alert>
        )}
        <Typography
          component="pre"
          sx={{
            fontFamily: 'inherit',
            margin: 0,
            whiteSpace: 'pre-line',
          }}
        >
          {detail.value}
        </Typography>
        {detail.copyable && onCopy && (
          <IconButton
            size="small"
            onClick={() => onCopy(String(detail.value), detail.label)}
          >
            <CopyIcon fontSize="small" sx={{ color: 'black' }} />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ cursor: 'pointer' }}
        >
          <Icon sx={{ color: 'black' }} />
          <Typography variant="h6" flex={1}>
            {title}
          </Typography>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Stack spacing={2}>{details.map(renderDetailRow)}</Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentDetailsCard;
