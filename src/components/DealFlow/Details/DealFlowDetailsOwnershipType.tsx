import React, { useState } from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { DealOwnershipType } from '@prisma/client';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
import DealFlowFooter from '@components/DealFlow/Shared/DealFlowFooter';
import { useRouter } from 'next/navigation';
import DealFlowTitle from '@components/DealFlow/Shared/DealFlowTitle';
import { sendGTMEvent } from '@next/third-parties/google';
const DealFlowDetailsOwnershipType: React.FC = () => {
  const { deal, updateDeal, createOrganization, project } = useDealFlow();
  const [ownershipType, setOwnershipType] = useState<DealOwnershipType>(
    deal?.investmentStats?.ownershipType ?? DealOwnershipType.INDIVIDUAL
  );
  const router = useRouter();
  const handleOwnershipTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOwnershipType(event.target.value as DealOwnershipType);
  };

  const handleUpdateDeal = async () => {
    if (!deal) return;

    // Send to Google Tag Manager
    sendGTMEvent({
      event: 'customEvent',
      dealId: deal.id,
      dealStage: deal.dealStage,
      eventCategory: 'Deal Flow',
      eventAction: `Step 3: Ownership Type`,
      eventLabel: `Ownership Type selected: ${ownershipType}`,
    });

    if (ownershipType === DealOwnershipType.INDIVIDUAL) {
      await updateDeal({
        ...deal,
        investmentStats: {
          ...deal.investmentStats,
          ownershipType: ownershipType,
        },
      });
    } else {
      await createOrganization({
        dateOfCreation: new Date(),
        ownershipType: ownershipType,
      });

      if (
        ownershipType === DealOwnershipType.MARITAL ||
        ownershipType === DealOwnershipType.JOINT
      ) {
        router.push(`/dealflow/${project?.slug}/${deal?.id}/co-investor`);
      } else {
        router.push(`/dealflow/${project?.slug}/${deal.id}/entity-details`);
      }
    }
  };

  const formatOwnershipType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Box>
      <DealFlowTitle title="Investment Details" />
      <Typography variant="body2" gutterBottom>
        How are you investing?
      </Typography>
      <RadioGroup
        aria-label="ownership-type"
        name="ownership-type"
        value={ownershipType}
        onChange={handleOwnershipTypeChange}
      >
        {Object.values(DealOwnershipType).map(type => (
          <FormControlLabel
            key={type}
            value={type}
            control={<Radio />}
            label={formatOwnershipType(type)}
          />
        ))}
      </RadioGroup>

      <DealFlowFooter onContinue={handleUpdateDeal} />
    </Box>
  );
};

export default DealFlowDetailsOwnershipType;
