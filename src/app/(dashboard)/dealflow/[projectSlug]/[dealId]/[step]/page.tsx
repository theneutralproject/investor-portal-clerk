"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Grid } from "@mui/material";
import DealFlowContainer from "@/components/DealFlow/Shared/DealFlowContainer";
import {
  DealFlowProvider,
  type StepType,
} from "@/components/DealFlow/Shared/DealFlowContext";
import DealFlowHeader from "@/components/DealFlow/Shared/DealFlowHeader";
import DealFlowSidebar from "@/components/DealFlow/Shared/DealFlowSidebar";

const DealFlow = () => {
  const { projectSlug, dealId, step } = useParams();

  if (!projectSlug || !dealId) {
    return <div>Error: Missing project slug or deal ID</div>;
  }

  return (
    <DealFlowProvider
      projectSlug={projectSlug as string}
      dealId={dealId as string}
      initialStep={step as StepType}
    >
      <Grid
        container
        spacing={2}
        sx={{ backgroundColor: "white", height: "100%" }}
      >
        <Grid item xs={12} md={9}>
          <DealFlowHeader />
          <DealFlowContainer />
        </Grid>
        <Grid item xs={12} md={3}>
          <DealFlowSidebar />
        </Grid>
      </Grid>
    </DealFlowProvider>
  );
};

export default DealFlow;
