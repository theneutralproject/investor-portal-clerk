import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  IconButton,
  Alert,
  TextField,
} from '@mui/material';
import {
  AccountBalanceWallet as WireIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import DealFlowFooter from '../Shared/DealFlowFooter';
import DealFlowTitle from '../Shared/DealFlowTitle';
import { useDealFlow } from '../Shared/DealFlowContext';

interface FundACHProps {
  paymentInfo: {
    accountNumber: string;
    routingNumber: string;
  };
  investmentAmount: number;
}

const FundACH: React.FC<FundACHProps> = ({ paymentInfo, investmentAmount }) => {
  const { deal, refetchDeal, updateDeal } = useDealFlow();
  const [copied, setCopied] = useState<string | null>(null);
  const [wireTransferId, setWireTransferId] = useState<string>(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    deal?.paymentReferenceId ?? ''
  );
  const copyToClipboard = (text: string, field: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleWireTransferIdChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWireTransferId(e.target.value);
  };

  const fundWireTransferContinue = async () => {
    if (!deal) return;

    await updateDeal(
      {
        ...deal,
        paymentReferenceId: wireTransferId,
        dateFundsSent: new Date(),
        paymentMethod: 'WIRE',
      },
      false
    );
    await refetchDeal();
  };

  const renderDetailRow = (
    label: string,
    value: string | number,
    copyable?: boolean
  ) => (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{ width: '100%' }}
    >
      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
        {label}:
      </Typography>
      <Stack direction="row" alignItems="flex-start" spacing={1}>
        {copied === label && (
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
          {value}
        </Typography>
        {copyable && (
          <IconButton
            size="small"
            onClick={() => copyToClipboard(String(value), label)}
          >
            <CopyIcon fontSize="small" sx={{ color: 'black' }} />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ p: 3 }}>
      <DealFlowTitle title="Fund Your Investment" />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ cursor: 'pointer' }}
          >
            <WireIcon sx={{ color: 'black' }} />
            <Typography variant="h6" flex={1}>
              Add Funds via Wire Transfer
            </Typography>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Stack spacing={2}>
              {renderDetailRow(
                'Amount',
                `$${investmentAmount.toLocaleString()}`
              )}
              {renderDetailRow(
                'Account Number',
                paymentInfo.accountNumber,
                true
              )}
              {renderDetailRow(
                'Routing Number',
                paymentInfo.routingNumber,
                true
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Tracking Confirmation Number"
            helperText="Please enter the Federal Wire Reference Number or IMAD/OMAD number"
            value={wireTransferId}
            onChange={handleWireTransferIdChange}
          />
        </CardContent>
      </Card>

      <DealFlowFooter
        onBack={() => null}
        onContinue={fundWireTransferContinue}
        isContinueDisabled={wireTransferId.length === 0}
      />
    </Box>
  );
};

export default FundACH;
