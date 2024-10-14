import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { steps, useDealFlow } from "./DealFlowContext";

const DealFlowHeader = () => {
  const { step } = useDealFlow();

  const stepIndex = steps.findIndex((stepObj) => stepObj.value === step);

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ boxShadow: "unset", backgroundColor: "unset" }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          The Edison / Invest
        </Typography>
      </Toolbar>
      <Stepper activeStep={stepIndex} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.value}>
            <StepLabel>{step.display}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </AppBar>
  );
};

export default DealFlowHeader;
