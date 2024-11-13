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
  const { step, project } = useDealFlow();

  // Find the current step object
  const currentStepObj = steps.find((stepObj) => stepObj.value === step);

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
        <Typography variant="body1" sx={{ flexGrow: 1, color: "#00000099" }}>
          {project?.name || "Neutral"}
          <span style={{ color: "#000000DE" }}> / Invest</span>
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
