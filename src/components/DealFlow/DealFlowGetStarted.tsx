import React, { useCallback } from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { steps, useDealFlow } from "./DealFlowContext";
import { DealFinancingType } from "@prisma/client";
import { type DealCreateSchema } from "@/libs/deal/schema";
import axios from "axios";
import { useRouter } from "next/navigation";

const DealFlowGetStarted: React.FC = () => {
  const { step, project, deal } = useDealFlow();
  const router = useRouter();

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
    </Box>
  );
};

export default DealFlowGetStarted;
