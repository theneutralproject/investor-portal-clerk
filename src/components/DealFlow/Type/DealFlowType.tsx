import React, { useState } from 'react';
import { Box, Typography, RadioGroup, Card, CardContent } from '@mui/material';
import { DealFinancingType } from '@prisma/client';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
import DealFlowFooter from '@components/DealFlow/Shared/DealFlowFooter';
import DealFlowTitle from '@components/DealFlow/Shared/DealFlowTitle';
import { MODAL_KEYS } from '../Shared/Modal/DealFlowLearnMoreModal';

const DealFlowType: React.FC = () => {
  const { deal, updateDeal, project } = useDealFlow();
  const [financingType, setFinancingType] = useState<DealFinancingType>(
    deal?.investmentStats?.financingType ?? DealFinancingType.equity
  );

  const handleFinancingTypeChange = (type: DealFinancingType) => {
    setFinancingType(type);
  };

  const handleUpdateDeal = async () => {
    if (!deal) return;

    await updateDeal({
      ...deal,
      investmentStats: {
        ...deal.investmentStats,
        financingType: financingType,
      },
    });
  };

  const investmentTypes = [
    ...(project?.investmentStats?.boolEquity
      ? [
          {
            type: DealFinancingType.equity,
            title: 'Equity Investment',
            description:
              "Common Equity benefits from the property's performance; in contrast to Common Debt, this type of investment offers higher potential returns and tax optimization. Common Equity does have a higher risk associated with the higher return.",
          },
        ]
      : []),
    ...(project?.investmentStats?.boolDebt
      ? [
          {
            type: DealFinancingType.promissory_note_now,
            title: 'Debt Investment',
            description:
              'Common Debt provides a fixed rate of return, and it has priority in repayment to Common Equity, making it a less risky investment. Furthermore, Common Debt has a fixed rate of return per annum, distributed quarterly.',
          },
        ]
      : []),
  ];

  return (
    <Box>
      <DealFlowTitle
        title="Choose Investment Type"
        modalKey={MODAL_KEYS.CHOOSE_INVESTMENT_TYPE}
      />
      <RadioGroup
        aria-label="financing-type"
        name="financing-type"
        value={financingType}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          {investmentTypes.map(({ type, title, description }) => (
            <Card
              key={title}
              onClick={() => handleFinancingTypeChange(type)}
              sx={{
                cursor: 'pointer',
                border:
                  financingType === type
                    ? '2px solid #1976d2'
                    : '1px solid #e0e0e0',
                borderRadius: 2,
                '&:hover': { boxShadow: 3 },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box
                    width={24}
                    height={24}
                    borderRadius="50%"
                    border="2px solid #1976d2"
                    mr={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {financingType === type && (
                      <Box
                        width={12}
                        height={12}
                        borderRadius="50%"
                        bgcolor="#1976d2"
                      />
                    )}
                  </Box>
                  <Typography variant="h6">{title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </RadioGroup>

      <DealFlowFooter onBack={() => null} onContinue={handleUpdateDeal} />
    </Box>
  );
};

export default DealFlowType;
