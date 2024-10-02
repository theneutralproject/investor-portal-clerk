import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useDealFlow } from "./DealFlowContext";

const steps = ["Type", "Amount", "Details", "Review & Sign", "Fund"];

const DealFlowHeader = () => {
  const { step } = useDealFlow();

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
      <Stepper activeStep={step - 1} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </AppBar>
  );
};

export default DealFlowHeader;
