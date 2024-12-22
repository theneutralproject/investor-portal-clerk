import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  TextField,
} from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';
import DealFlowFooter from '../Shared/DealFlowFooter';
import DealFlowTitle from '../Shared/DealFlowTitle';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';

interface FundCheckProps {
  paymentInfo: {
    companyName: string;
    mailTo: string;
  };
  investmentAmount: number;
}

const FundCheck: React.FC<FundCheckProps> = ({
  paymentInfo,
  investmentAmount,
}) => {
  const { deal, updateDeal, refetchDeal } = useDealFlow();

  const [checkNumber, setCheckNumber] = useState<string>(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    deal?.paymentReferenceId ?? ''
  );

  const handleCheckNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckNumber(event.target.value);
  };

  const renderDetailRow = (label: string, value: string | number) => (
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
      </Stack>
    </Stack>
  );

  const fundCheckContinue = async () => {
    if (!deal) return;

    await updateDeal(
      {
        ...deal,
        paymentMethod: 'CHECK',
      },
      false
    );
    await refetchDeal();
  };

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
            <PaymentIcon sx={{ color: 'black' }} />
            <Typography variant="h6" flex={1}>
              Add Funds by Check
            </Typography>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Stack spacing={2}>
              {renderDetailRow('Pay to', paymentInfo.companyName)}
              {renderDetailRow(
                'Amount',
                `$${investmentAmount.toLocaleString()}`
              )}
              {renderDetailRow('Memo', `Deal ID: ${deal?.id}`)}
              {renderDetailRow('Mail to', paymentInfo.mailTo)}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Check Number"
            helperText="Please enter your check number for tracking purposes"
            value={checkNumber}
            onChange={handleCheckNumberChange}
          />
        </CardContent>
      </Card>

      <DealFlowFooter
        onBack={() => null}
        onContinue={fundCheckContinue}
        isContinueDisabled={checkNumber.length === 0}
      />
    </Box>
  );
};

export default FundCheck;
