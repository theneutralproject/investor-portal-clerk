import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  type DealWithOrgMembersAndProject,
  type DealWithFullOrgAndProject,
} from '@/libs/types';
import { useRouter } from 'next/navigation';
import { DealFinancingType } from '@prisma/client';

interface CompleteInvestmentProps {
  deals: DealWithOrgMembersAndProject[];
}

const ContinueButton = styled(Button)(({}) => ({
  backgroundColor: 'white',
  color: 'black',
  borderRadius: '24px',
  textTransform: 'none',
  padding: '8px 24px',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const ProjectCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: '2px 10px',
  marginBottom: theme.spacing(1),
  width: '100%',
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 4,
  borderRadius: 2,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  marginTop: theme.spacing(1),
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#4CAF50',
  },
}));

export const getProjectPicture = (deal: DealWithFullOrgAndProject): string => {
  const headerPicture = deal.project.pictures.find(
    picture => picture.type === 'HEADER'
  );

  if (headerPicture?.url) {
    return headerPicture.url;
  }

  // Fallback to first picture if no header
  return (
    deal.project.pictures[0]?.url ??
    `/projects/${deal.project.slug}/thumbnail.jpg`
  );
};

const isDealCompleted = (dealStage: number): boolean => {
  if (dealStage >= 5) {
    return true;
  } else {
    return false;
  }
};

/**
 * Deal Stage Reference:
 * 0 = Get Started
 * 2 = review
 * 3 = review
 * 4 = fund
 * 5 = fund
 *
 */

const getNextStep = (deal: DealWithFullOrgAndProject): string => {
  switch (deal.dealStage) {
    case 0:
      return 'get-started';
    case 1:
      return 'details';
    case 2:
    case 3:
      return 'review';
    case 4:
    case 5:
      return 'fund';
    default:
      return 'get-started';
  }
};

const getNextStepDisplay = (deal: DealWithFullOrgAndProject): string => {
  switch (deal.dealStage) {
    case 1:
      return 'Next Step: Details';
    case 2:
      return 'Next Step: Review & Sign';
    case 3:
      return 'Next Step: Review & Sign';
    case 4:
      return 'Next Step: Fund';
    case 5:
      return 'Completed';
    default:
      return 'Next Step: Get Started';
  }
};

const getDealProgress = (deal: DealWithOrgMembersAndProject): number => {
  const MAX_DEAL_STAGE = 5;
  return (deal.dealStage / MAX_DEAL_STAGE) * 100;
};

const InProgressDeal = ({
  deal,
  handleContinue,
}: {
  deal: DealWithOrgMembersAndProject;
  handleContinue: (deal: DealWithOrgMembersAndProject) => void;
}) => {
  return (
    <Box key={deal.id} sx={{ mb: 3 }}>
      <ProjectCard>
        <Avatar
          src={getProjectPicture(deal as DealWithFullOrgAndProject)}
          alt={deal.project.name}
          sx={{
            width: 56,
            height: 56,
            borderRadius: '8px',
          }}
          variant="square"
        />

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {deal.project.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            {getNextStepDisplay(deal as DealWithFullOrgAndProject)}
          </Typography>
          <StyledLinearProgress
            variant="determinate"
            value={getDealProgress(deal)}
          />
        </Box>

        <ContinueButton
          variant="contained"
          onClick={() => handleContinue(deal)}
        >
          CONTINUE
        </ContinueButton>
      </ProjectCard>
    </Box>
  );
};

const CompletedDeal = ({ deal }: { deal: DealWithOrgMembersAndProject }) => {
  return (
    <Box key={deal.id} sx={{ mb: 3 }}>
      <ProjectCard>
        <Avatar
          src={getProjectPicture(deal as DealWithFullOrgAndProject)}
          alt={deal.project.name}
          sx={{
            width: 56,
            height: 56,
            borderRadius: '8px',
          }}
          variant="square"
        />

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {deal?.organization?.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              ${deal?.investmentStats?.amount.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              {deal?.organization?.ownershipType
                ?.toLowerCase()
                .replace(/^\w/, c => c.toUpperCase())}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              {deal?.investmentStats?.financingType === DealFinancingType.equity
                ? 'Equity'
                : 'Debt'}
            </Typography>
          </Box>
        </Box>
      </ProjectCard>
    </Box>
  );
};
const CompleteInvestment: React.FC<CompleteInvestmentProps> = ({ deals }) => {
  const router = useRouter();

  const handleContinue = (deal: DealWithOrgMembersAndProject) => {
    const nextStep = getNextStep(deal as DealWithFullOrgAndProject);
    router.push(`/dealflow/${deal.project.slug}/${deal.id}/${nextStep}`);
  };
  if (deals.length === 0) {
    return null;
  }

  const header = deals?.every(deal => isDealCompleted(deal.dealStage))
    ? 'Investments'
    : 'Complete Your Investment';
  return (
    <Card
      sx={{
        backgroundColor: 'black',
        borderRadius: '8px',
        color: 'white',
        mb: 2,
      }}
    >
      <CardContent>
        <Typography
          variant="body1"
          sx={{
            fontSize: '20px',
            mb: 2,
          }}
        >
          {header}
        </Typography>

        <Divider sx={{ mb: 2, borderColor: '#3C3C3C' }} />

        {deals
          .sort((a, b) => a.id - b.id)
          .map(deal =>
            isDealCompleted(deal.dealStage) ? (
              <CompletedDeal key={deal.id} deal={deal} />
            ) : (
              <InProgressDeal
                key={deal.id}
                deal={deal}
                handleContinue={handleContinue}
              />
            )
          )}
      </CardContent>
    </Card>
  );
};

export default CompleteInvestment;
