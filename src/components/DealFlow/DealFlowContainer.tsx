import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { useDealFlow } from "./DealFlowContext";

const DealFlowContainer: React.FC = () => {
  const { step, setStep } = useDealFlow();

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
        <Button variant="contained" onClick={() => setStep(step + 1)}>
          Continue
        </Button>
      </Box>
    </Paper>
  );
};

export default DealFlowContainer;