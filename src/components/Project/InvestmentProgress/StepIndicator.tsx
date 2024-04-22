import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import StepAvatar from "@/components/StepAvatar";

function StepIndicator({
  stepNumber,
  label,
  dealStage,
  totalSteps, // Added totalSteps to determine if it is the last step
}: {
  stepNumber: number;
  label: string;
  dealStage: number;
  totalSteps: number;
}) {
  const theme = useTheme();

  // Calculate the step properties based on dealStage and stepNumber
  const isComplete = stepNumber < dealStage;
  const isLastStep = stepNumber === totalSteps;
  const isCurrentStep = stepNumber === dealStage;

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <StepAvatar isComplete={isComplete} stepNumber={stepNumber} />

        <Typography
          variant="subtitle2"
          sx={{
            ml: theme.spacing(2),
            fontWeight: isCurrentStep ? 550 : 400,
            color: isCurrentStep ? "#000000DE" : "#00000099",
          }}
        >
          {label}
        </Typography>
      </Box>
      {!isLastStep && (
        <Box
          sx={{
            marginTop: "6px",
            marginBottom: "6px",
            height: "20px",
            width: "2px",
            bgcolor: "#BDBDBD",
            marginLeft: "11px",
          }}
        />
      )}
    </Box>
  );
}

export default StepIndicator;
