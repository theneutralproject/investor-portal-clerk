import React from "react";
import { Box, Typography } from "@mui/material";
import { useDealFlow } from "./DealFlowContext";
import DealFlowFooter from "./DealFlowFooter";

const DealFlowGetStarted: React.FC = ({}) => {
  const { createDeal } = useDealFlow();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Get Started
      </Typography>
      <Typography variant="body1" paragraph>
        Watch a brief overview about the investing process.
      </Typography>
      <Typography variant="body2" paragraph>
        In this video, Nate, CEO of Neutral, provides an overview of the
        investment process.
      </Typography>
      <DealFlowFooter onBack={() => null} onContinue={createDeal} />
    </Box>
  );
};

export default DealFlowGetStarted;
