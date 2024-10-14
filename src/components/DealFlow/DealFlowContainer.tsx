import React, { useCallback } from "react";
import { Paper, Box, Button } from "@mui/material";
import { steps, useDealFlow } from "./DealFlowContext";
import { useRouter } from "next/navigation";
import DealFlowGetStarted from "./DealFlowGetStarted";
import DealFlowType from "./DealFlowType";
import DealFlowAmount from "./DealFlowAmount";

const stepComponents = {
  "get-started": DealFlowGetStarted,
  type: DealFlowType,
  amount: DealFlowAmount,
  // Add other step components here
};

const DealFlowContainer: React.FC = () => {
  const { step, project, deal } = useDealFlow();
  const router = useRouter();

  const stepIndex = steps.findIndex((stepObj) => stepObj.value === step);
  const previousStep = steps[stepIndex - 1];
  const nextStep = steps[stepIndex + 1];

  const handleBack = useCallback(() => {
    if (previousStep) {
      router.push(
        `/dealflow/${project?.slug}/${deal?.id}/${previousStep.value}`
      );
    }
  }, [router, project?.slug, deal?.id, previousStep]);

  const handleContinue = useCallback(() => {
    if (nextStep) {
      router.push(`/dealflow/${project?.slug}/${deal?.id}/${nextStep.value}`);
    }
  }, [router, project?.slug, deal?.id, nextStep]);

  const StepComponent = stepComponents[step as keyof typeof stepComponents];

  if (!StepComponent) {
    return <div>Invalid step</div>;
  }

  if (!deal && step !== "get-started") {
    return <div>Loading...</div>;
  }

  return (
    <Paper sx={{ p: 3, boxShadow: "unset", backgroundColor: "unset" }}>
      <StepComponent onBack={handleBack} onContinue={handleContinue} />
    </Paper>
  );
};

export default DealFlowContainer;
