import React from "react";
import { Paper } from "@mui/material";
import { useDealFlow } from "./DealFlowContext";
import DealFlowGetStarted from "./DealFlowGetStarted";
import DealFlowType from "./DealFlowType";
import DealFlowAmount from "./DealFlowAmount";
import DealFlowDetails from "./DealFlowDetails";
import DealFlowDetailsOwnershipType from "./DealFlowDetailsOwnershipType";

const stepComponents = {
  "get-started": DealFlowGetStarted,
  type: DealFlowType,
  amount: DealFlowAmount,
  details: DealFlowDetails,
  "details-ownership-type": DealFlowDetailsOwnershipType,
  // Add other step components here
};

const DealFlowContainer: React.FC = () => {
  const { step, deal } = useDealFlow();

  const StepComponent = stepComponents[step as keyof typeof stepComponents];

  if (!StepComponent) {
    return <div>Invalid step</div>;
  }

  // if (!deal && step !== "get-started") {
  //   return <div>Loading...</div>;
  // }

  return (
    <Paper sx={{ p: 3, boxShadow: "unset", backgroundColor: "unset" }}>
      <StepComponent />
    </Paper>
  );
};

export default DealFlowContainer;
