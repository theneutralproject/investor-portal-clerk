import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { type DealWithFullOrgAndProject } from "@/libs/types";
import { useRouter } from "next/navigation";

interface CompleteInvestmentProps {
  deals: DealWithFullOrgAndProject[];
}

const ContinueButton = styled(Button)(({}) => ({
  backgroundColor: "white",
  color: "black",
  borderRadius: "24px",
  textTransform: "none",
  padding: "8px 24px",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
}));

const ProjectCard = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: "2px 10px",
  marginBottom: theme.spacing(1),
  width: "100%",
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 4,
  borderRadius: 2,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  marginTop: theme.spacing(1),
  "& .MuiLinearProgress-bar": {
    backgroundColor: "#4CAF50",
  },
}));

const getProjectPicture = (deal: DealWithFullOrgAndProject): string => {
  const headerPicture = deal.project.pictures.find(
    (picture) => picture.type === "HEADER"
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
      return "get-started";
    case 2:
    case 3:
      return "review";
    case 4:
    case 5:
      return "fund";
    default:
      return "get-started";
  }
};

const getNextStepDisplay = (deal: DealWithFullOrgAndProject): string => {
  switch (deal.dealStage) {
    case 0:
      return "Next Step: Get Started";
    case 2:
      return "Next Step: Review & Sign";
    case 3:
      return "Next Step: Review & Sign";
    case 4:
      return "Next Step: Fund";
    default:
      return "Completed";
  }
};

const getDealProgress = (deal: DealWithFullOrgAndProject): number => {
  const MAX_DEAL_STAGE = 5;
  return (deal.dealStage / MAX_DEAL_STAGE) * 100;
};

const CompleteInvestment: React.FC<CompleteInvestmentProps> = ({ deals }) => {
  const router = useRouter();

  const handleContinue = (deal: DealWithFullOrgAndProject) => {
    const nextStep = getNextStep(deal);
    router.push(`/dealflow/${deal.project.slug}/${deal.id}/${nextStep}`);
  };

  return (
    <Card
      sx={{
        backgroundColor: "black",
        borderRadius: "8px",
        color: "white",
        mb: 2,
      }}
    >
      <CardContent>
        <Typography
          variant="body1"
          sx={{
            fontSize: "20px",
            mb: 2,
          }}
        >
          Complete Your Investment
        </Typography>

        <Divider sx={{ mb: 2, borderColor: "#3C3C3C" }} />

        <Typography
          variant="body1"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            mb: 2,
          }}
        >
          Add funds to complete your investment
        </Typography>

        {deals
          .filter((deal) => !isDealCompleted(deal.dealStage))
          .sort((a, b) => a.id - b.id)
          .map((deal) => (
            <Box key={deal.id} sx={{ mb: 3 }}>
              <ProjectCard>
                <Avatar
                  src={getProjectPicture(deal)}
                  alt={deal.project.name}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "8px",
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
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {getNextStepDisplay(deal)}
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
          ))}
      </CardContent>
    </Card>
  );
};

export default CompleteInvestment;
