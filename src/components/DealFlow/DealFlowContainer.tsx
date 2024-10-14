import React, { useCallback } from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { steps, useDealFlow } from "./DealFlowContext";
import { DealFinancingType } from "@prisma/client";
import { type DealCreateSchema } from "@/libs/deal/schema";
import axios from "axios";
import { useRouter } from "next/navigation";
import DealFlowGetStarted from "./DealFlowGetStarted";

const DealFlowContainer: React.FC = () => {
  const { step, project, deal } = useDealFlow();
  const router = useRouter();

  const stepIndex = steps.findIndex((stepObj) => stepObj.value === step);
  const previousStep = steps[stepIndex - 1];
  const nextStep = steps[stepIndex + 1];

  const createDeal = useCallback(async () => {
    if (!project) return;

    const dealCreateData: DealCreateSchema = {
      financingType: DealFinancingType.equity,
      projectId: project.id,
    };

    try {
      const { data } = await axios.post<{ id: string }>(
        "/api/deals",
        dealCreateData
      );
      router.push(`/dealflow/${project.slug}/${data.id}`);
    } catch (error) {
      console.error("Error creating deal:", error);
    }
  }, [project, router]);

  const getButtonStates = useCallback(() => {
    if (step === "get-started") {
      return { backDisabled: true, continueDisabled: false };
    }
    if (step === "type") {
      return { backDisabled: false, continueDisabled: !deal?.financingType };
    }
    return { backDisabled: false, continueDisabled: true };
  }, [step, deal?.financingType]);

  const handleBack = useCallback(() => {
    if (previousStep) {
      router.push(
        `/dealflow/${project?.slug}/${deal?.id}/${previousStep.value}`
      );
    }
  }, [router, project?.slug, deal?.id, previousStep]);

  const handleContinue = useCallback(() => {
    if (step === "get-started") {
      createDeal();
    } else if (nextStep) {
      router.push(`/dealflow/${project?.slug}/${deal?.id}/${nextStep.value}`);
    }
  }, [router, project?.slug, deal?.id, nextStep]);

  const { backDisabled, continueDisabled } = getButtonStates();

  const getStepComponent = () => {
    if (step === "get-started") {
      return <DealFlowGetStarted />;
    }
  };

  return (
    <Paper sx={{ p: 3, boxShadow: "unset", backgroundColor: "unset" }}>
      {getStepComponent()}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" onClick={handleBack} disabled={backDisabled}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={continueDisabled}
        >
          Continue
        </Button>
      </Box>
    </Paper>
  );
};

export default DealFlowContainer;
