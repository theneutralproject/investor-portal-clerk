import {
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Box,
} from "@mui/material";

import { type Project } from "@prisma/client";
import ProgressBar from "./ProgressBar";
import StepIndicator from "./StepIndicator";
import useIncrementDealMutation from "@/app/hooks/useIncrementDealMutation";
import HubspotScheduleCall from "@/components/HubspotScheduleCall";

const INVESTMENT_STEPS = [
  "Schedule a Call with an Advisor",
  "Review Project Documents",
  "Sign Investment Agreements",
  "Fund Your Investment",
];

const InvestmentProgress: React.FC<{
  project: Project;
  dealStage: number;
  currentTab: number;
  setTabValue: (number: number) => void;
}> = ({ project, dealStage, currentTab, setTabValue }) => {
  const { mutate: mutateDeal } = useIncrementDealMutation(project.id);

  const generateCTAButton = () => {
    if (dealStage === 0) {
      return <HubspotScheduleCall />;
    }

    if (dealStage === 1) {
      if (currentTab === 1) {
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#000000DE" }}>
              Review Project Documents
            </Typography>
            <Typography variant="caption">
              Watch the video or download each of the documents to continue to
              the next step.
            </Typography>
          </Box>
        );
      } else {
        return (
          <Button
            variant="neutralBlack"
            fullWidth
            onClick={() => setTabValue(1)}
          >
            Review Project Docs
          </Button>
        );
      }
    }

    if (dealStage === 2) {
      if (currentTab === 2) {
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#000000DE" }}>
              Review Invest Documents
            </Typography>
            <Typography variant="caption">
              Watch the video or download each of the documents to continue to
              the next step.
            </Typography>
          </Box>
        );
      } else {
        return (
          <Button
            variant="neutralBlack"
            fullWidth
            onClick={() => setTabValue(2)}
          >
            Sign Agreements
          </Button>
        );
      }
    }

    if (dealStage === 3) {
      if (currentTab === 3) {
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#000000DE" }}>
              Decide how to Fund Your Investment
            </Typography>
            <Typography variant="caption">
              Follow the steps to decide when and how to fund your investment.
            </Typography>
          </Box>
        );
      } else {
        return (
          <Button
            variant="neutralBlack"
            fullWidth
            onClick={() => setTabValue(3)}
          >
            Fund Investment
          </Button>
        );
      }
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6">Investment Progress:</Typography>
          <Typography variant="caption">
            Next Step: {INVESTMENT_STEPS[dealStage]}
          </Typography>
          <ProgressBar dealStage={dealStage} />

          <Divider sx={{ mt: 2, mb: 2 }} />

          {INVESTMENT_STEPS.map((step, index) => (
            <StepIndicator
              dealStage={dealStage}
              key={index}
              totalSteps={3}
              label={step}
              stepNumber={index}
            />
          ))}

          <Divider sx={{ mt: 2, mb: 2 }} />

          {generateCTAButton()}
        </CardContent>
      </Card>

      <Button sx={{ mt: "100px" }} onClick={() => mutateDeal("reset")}>
        Reset
      </Button>

      <Button sx={{ mt: "100px" }} onClick={() => mutateDeal("increment")}>
        Increment
      </Button>
    </>
  );
};

export default InvestmentProgress;
