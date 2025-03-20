import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
import DealFlowFooter from '@components/DealFlow/Shared/DealFlowFooter';
import PaymentProcessing from '@components/DealFlow/Fund/PaymentProcessing';
import DealFlowTitle from '@components/DealFlow/Shared/DealFlowTitle';
import FundPlaid from '@components/DealFlow/Fund/FundPlaid';
import FundCheck from '@components/DealFlow/Fund/FundCheck';
import FundWire from '@/components/DealFlow/Fund/FundWire';
import {
  getPaymentInfo,
  getMerchantId,
  FundingOptions,
} from '@components/DealFlow/Fund/FundShared';
import PaymentComplete from '@components/DealFlow/Fund/PaymentComplete';

const DealFlowFund: React.FC = () => {
  const { project, deal } = useDealFlow();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showComponent, setShowComponent] = useState(false);

  const paymentInfo = getPaymentInfo(project, deal);
  const investmentAmount = deal?.investmentStats?.amount ?? 0;
  const merchantId = getMerchantId(project.slug);

  const handleBack = () => {
    setSelectedOption('');
    setShowComponent(false);
  };

  const handleContinue = () => {
    if (selectedOption) {
      setShowComponent(true);
    }
  };

  if (deal?.dealStage === 5) {
    return <PaymentComplete />;
  }

  if (deal?.paymentReferenceId !== null) {
    return <PaymentProcessing />;
  }

  if (showComponent) {
    switch (selectedOption) {
      case 'plaid':
        return <FundPlaid merchantId={merchantId} onBack={handleBack} />;
      case 'check':
        return (
          <FundCheck
            paymentInfo={paymentInfo}
            investmentAmount={investmentAmount}
            onBack={handleBack}
          />
        );
      case 'wire':
        return (
          <FundWire
            paymentInfo={paymentInfo}
            investmentAmount={investmentAmount}
            onBack={handleBack}
          />
        );
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <DealFlowTitle title="Fund Your Investment" />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        As the final step, provide the bank account you&apos;d like to use to
        fund your investment. All information and transactions are encrypted,
        and Neutral does not store your banking information.
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        How would you like to fund your investment?
      </Typography>

      <FundingOptions
        selectedOption={selectedOption}
        onChange={setSelectedOption}
        deal={deal}
      />

      <DealFlowFooter
        onContinue={handleContinue}
        isContinueDisabled={!selectedOption}
      />
    </Box>
  );
};

export default DealFlowFund;
