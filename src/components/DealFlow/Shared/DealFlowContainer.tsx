import React from "react";
import { Paper, Box, Typography, CircularProgress } from "@mui/material";
import {
  stepComponents,
  useDealFlow,
} from "@components/DealFlow/Shared/DealFlowContext";

const DealFlowContainer: React.FC = () => {
  const { step, deal, organization } = useDealFlow();

  const StepComponent = stepComponents[step as keyof typeof stepComponents];

  if (!StepComponent) {
    return <div>Invalid step</div>;
  }

  if ((!deal || !organization) && step !== "get-started") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="50vh"
      >
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        boxShadow: "unset",
        backgroundColor: "unset",
        margin: "0 auto",
      }}
    >
      <StepComponent />
    </Paper>
  );
};

export default DealFlowContainer;
