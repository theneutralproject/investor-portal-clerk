import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { useDealFlow } from "./DealFlowContext";
import { DealFinancingType } from "@prisma/client";
import { type DealCreateSchema } from "@/libs/deal/schema";
import axios from "axios";
import { useRouter } from "next/navigation";

const DealFlowContainer: React.FC = () => {
  const { step, setStep, project } = useDealFlow();
  const router = useRouter();

  const createDeal = async () => {
    if (!project) {
      return;
    }
    const dealCreateData: DealCreateSchema = {
      financingType: DealFinancingType.equity,
      projectId: project.id,
    };
    try {
      const response = await axios.post("/api/deals", dealCreateData);
      const dealId: string = (response.data as { id: string }).id;

      // Redirect to the deal flow page
      router.push(`/dealflow/${project.slug}/${dealId}`);
    } catch (error) {
      console.error("Error creating deal:", error);
    }
  };

  return (
    <Paper sx={{ p: 3, boxShadow: "unset", backgroundColor: "unset" }}>
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
        <Button
          variant="outlined"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          Back
        </Button>
        <Button variant="contained" onClick={createDeal}>
          Continue
        </Button>
      </Box>
    </Paper>
  );
};

export default DealFlowContainer;
