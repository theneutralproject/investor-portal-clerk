import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  MAJOR_STEPS,
  steps,
  useDealFlow,
} from "@components/DealFlow/Shared/DealFlowContext";

const DealFlowHeader = () => {
  const { step } = useDealFlow();

  // Find the current step object
  const currentStepObj = steps.find((stepObj) => stepObj.value === step);
  console.log(currentStepObj);

  // Get the majorParent of the current step
  const majorParent = currentStepObj?.majorParent ?? step;

  // Find the index of the active major step
  const activeStepIndex = MAJOR_STEPS.findIndex(
    (stepObj) => stepObj.value === majorParent
  );

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
      <Stepper activeStep={activeStepIndex} alternativeLabel>
        {MAJOR_STEPS.map((stepObj, index) => (
          <Step key={stepObj.value}>
            <StepLabel
              StepIconProps={{
                active: majorParent === stepObj.value,
                completed: index < activeStepIndex,
                style: {
                  color: index <= activeStepIndex ? "#327b34" : undefined,
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: majorParent === stepObj.value ? "bold" : "normal",
                  color: index <= activeStepIndex ? "black" : undefined,
                }}
              >
                {stepObj.display}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </AppBar>
  );
};

export default DealFlowHeader;
