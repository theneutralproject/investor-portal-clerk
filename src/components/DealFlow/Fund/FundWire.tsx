import React, { useState } from 'react';
import { Box } from '@mui/material';
import DealFlowFooter from '../Shared/DealFlowFooter';
import DealFlowTitle from '../Shared/DealFlowTitle';
import { useDealFlow } from '../Shared/DealFlowContext';
import PaymentDetailsCard from './PaymentDetailsCard';
import ReferenceNumberInput from './ReferenceNumberInput';

interface FundACHProps {
  paymentInfo: {
    accountNumber: string;
    routingNumber: string;
  };
  investmentAmount: number;
  onBack?: () => void;
}

const FundACH: React.FC<FundACHProps> = ({
  paymentInfo,
  investmentAmount,
  onBack,
}) => {
  const { deal, refetchDeal, updateDeal } = useDealFlow();
  const [copied, setCopied] = useState<string | null>(null);
  const [wireTransferId, setWireTransferId] = useState<string>(
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

  const details = [
    {
      label: 'Amount',
      value: `$${investmentAmount.toLocaleString()}`,
    },
    {
      label: 'Account Number',
      value: paymentInfo.accountNumber,
      copyable: true,
    },
    {
      label: 'Routing Number',
      value: paymentInfo.routingNumber,
      copyable: true,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <DealFlowTitle title="Fund Your Investment" />

      <PaymentDetailsCard
        title="Add Funds via Wire Transfer"
        paymentType="wire"
        details={details}
        copied={copied}
        onCopy={copyToClipboard}
      />

      <ReferenceNumberInput
        value={wireTransferId}
        onChange={handleWireTransferIdChange}
        label="Tracking Confirmation Number"
        helperText="Please enter the Federal Wire Reference Number or IMAD/OMAD number"
      />

      <DealFlowFooter
        onBack={onBack}
        onContinue={fundWireTransferContinue}
        isContinueDisabled={wireTransferId.length === 0}
      />
    </Box>
  );
};

export default FundACH;
