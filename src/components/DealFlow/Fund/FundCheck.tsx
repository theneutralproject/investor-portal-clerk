import React, { useState } from 'react';
import { Box } from '@mui/material';
import DealFlowFooter from '../Shared/DealFlowFooter';
import DealFlowTitle from '../Shared/DealFlowTitle';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
import PaymentDetailsCard from './PaymentDetailsCard';
import ReferenceNumberInput from './ReferenceNumberInput';

interface FundCheckProps {
  paymentInfo: {
    companyName: string;
    mailTo: string;
  };
  investmentAmount: number;
  onBack?: () => void;
}

const FundCheck: React.FC<FundCheckProps> = ({
  paymentInfo,
  investmentAmount,
  onBack,
}) => {
  const { deal, updateDeal, refetchDeal } = useDealFlow();
  const [checkNumber, setCheckNumber] = useState<string>(
    deal?.paymentReferenceId ?? ''
  );

  const handleCheckNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckNumber(event.target.value);
  };

  const fundCheckContinue = async () => {
    if (!deal) return;

    await updateDeal(
      {
        ...deal,
        paymentReferenceId: checkNumber,
        dateFundsSent: new Date(),
        paymentMethod: 'CHECK',
      },
      false
    );
    await refetchDeal();
  };

  const details = [
    {
      label: 'Pay to',
      value: paymentInfo.companyName,
    },
    {
      label: 'Amount',
      value: `$${investmentAmount.toLocaleString()}`,
    },
    {
      label: 'Memo',
      value: deal?.transactionId ?? '',
    },
    {
      label: 'Mail to',
      value: paymentInfo.mailTo,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <DealFlowTitle title="Fund Your Investment" />

      <PaymentDetailsCard
        title="Add Funds by Check"
        paymentType="check"
        details={details}
        copied={null}
      />

      <ReferenceNumberInput
        value={checkNumber}
        onChange={handleCheckNumberChange}
        label="Check Number"
        helperText="Please enter your check number for tracking purposes"
      />

      <DealFlowFooter
        onBack={onBack}
        onContinue={fundCheckContinue}
        isContinueDisabled={checkNumber.length === 0}
      />
    </Box>
  );
};

export default FundCheck;
