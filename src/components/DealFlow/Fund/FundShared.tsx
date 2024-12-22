import React from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Stack,
  Card,
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  Payment as PaymentIcon,
  AccountBalanceWallet as WireIcon,
} from '@mui/icons-material';
import { type Deal } from '@prisma/client';
import {
  type DealWithInvestmentStats,
  type ProjectWithAllNestedData,
} from '@/libs/types';

interface FundingOptionProps {
  value: string;
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const FundingOption = ({
  value,
  icon,
  label,
  subLabel,
  checked,
  onChange,
  disabled,
}: FundingOptionProps) => (
  <Card
    sx={{
      p: 2,
      cursor: 'pointer',
      '&:hover': {
        bgcolor: 'action.hover',
      },
      display: 'flex',
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <FormControlLabel
      value={value}
      control={
        <Radio
          checked={checked}
          onChange={() => onChange(value)}
          disabled={disabled}
        />
      }
      label={
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="body1">{label}</Typography>
            {subLabel && (
              <Typography variant="caption" color="text.secondary">
                {subLabel}
              </Typography>
            )}
          </Box>
        </Box>
      }
      sx={{
        width: '100%',
        margin: 0,
      }}
    />
    <Box sx={{ display: 'flex', alignItems: 'center' }}>{icon}</Box>
  </Card>
);

export const FundingOptions: React.FC<{
  selectedOption: string;
  onChange: (value: string) => void;
  deal: DealWithInvestmentStats;
}> = ({ selectedOption, onChange, deal }) => {
  const MAX_AMOUNT = parseFloat(
    process.env.NEXT_PUBLIC_FINIX_MAX_TRANSACTION_AMOUNT ?? '0'
  );
  const dealAmount = deal?.investmentStats?.amount ?? 0;
  const SHOW_PLAID = dealAmount < MAX_AMOUNT;

  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      <RadioGroup
        value={selectedOption}
        onChange={e => onChange(e.target.value)}
      >
        <Stack spacing={2}>
          <FundingOption
            value="plaid"
            icon={<BankIcon color="action" />}
            label="Connect with Bank Account"
            subLabel={
              SHOW_PLAID
                ? 'Recommended'
                : `We only allow amounts up to $${MAX_AMOUNT.toLocaleString()} via bank transfer`
            }
            checked={selectedOption === 'plaid'}
            onChange={onChange}
            disabled={!SHOW_PLAID}
          />
          <FundingOption
            value="check"
            icon={<PaymentIcon color="action" />}
            label="Fund via Check"
            checked={selectedOption === 'check'}
            onChange={onChange}
          />
          <FundingOption
            value="wire"
            icon={<WireIcon color="action" />}
            label="Fund via Wire Transfer"
            checked={selectedOption === 'wire'}
            onChange={onChange}
          />
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};

export const getPaymentInfo = (
  project: ProjectWithAllNestedData,
  deal: Deal
) => {
  const defaultPaymentInfo = {
    investmentEntity: 'Not Available',
    accountNumber: 'Not Available',
    routingNumber: 'Not Available',
    mailTo: 'Not Available',
    companyName: 'Not Available',
  };

  if (!project || !deal) {
    return defaultPaymentInfo;
  }

  const foundPaymentInfo =
    project?.projectPaymentInfo?.find(
      info =>
        deal?.investmentEntity &&
        info.investmentEntity === deal.investmentEntity
    ) ?? defaultPaymentInfo;

  const mailTo =
    foundPaymentInfo.investmentEntity !== 'Not Available'
      ? `${foundPaymentInfo.investmentEntity}\nAttn: Nathan Helbach\n25 W. Main Street, Suite 500\nMadison, WI 53703`
      : 'Nathan Helbach\n25 W. Main Street, Suite 500\nMadison, WI 53703';

  return {
    companyName: foundPaymentInfo.investmentEntity,
    mailTo,
    accountNumber: foundPaymentInfo.accountNumber,
    routingNumber: foundPaymentInfo.routingNumber,
  };
};

export const getMerchantId = (projectSlug: string) => {
  switch (projectSlug) {
    case 'edison':
      return process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID_EDISON!;
    case 'bakers':
      return process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID_BAKERS!;
    case '519':
      return process.env.NEXT_PUBLIC_FINIX_MERCHANT_ID_519!;
    default:
      throw new Error('Invalid project slug');
  }
};
