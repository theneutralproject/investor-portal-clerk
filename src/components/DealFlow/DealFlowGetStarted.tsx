import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DealCreateSchema } from "@/libs/deal/schema";
import { DealFinancingType } from "@prisma/client";
import axios from "axios";
import { useDealFlow } from "./DealFlowContext";
import { useRouter } from "next/navigation";

interface DealFlowGetStartedProps {
  onBack: () => void;
  onContinue: () => void;
}

const DealFlowGetStarted: React.FC<DealFlowGetStartedProps> = ({
  onBack,
  onContinue,
}) => {
  const { project } = useDealFlow();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createDeal = async () => {
    if (!project) return;
    setIsLoading(true);

    const dealCreateData: DealCreateSchema = {
      financingType: DealFinancingType.equity,
      projectId: project.id,
    };

    try {
      const { data } = await axios.post<{ id: string }>(
        "/api/deals",
        dealCreateData
      );
      router.push(`/dealflow/${project?.slug}/${data.id}/type`);
    } catch (error) {
      console.error("Error creating deal:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button variant="contained" onClick={createDeal} disabled={isLoading}>
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default DealFlowGetStarted;
