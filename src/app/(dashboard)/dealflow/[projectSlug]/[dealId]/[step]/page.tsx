"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Box } from "@mui/material";
import DealFlowContainer from "@/components/DealFlow/Shared/DealFlowContainer";
import {
  DealFlowProvider,
  type StepType,
} from "@/components/DealFlow/Shared/DealFlowContext";
import DealFlowHeader from "@/components/DealFlow/Shared/DealFlowHeader";
import DealFlowSidebar from "@/components/DealFlow/Shared/DealFlowSidebar";
import Grid from "@mui/material/Grid2";

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
      <Box
        sx={{
          bgcolor: "background.paper",
          height: "100%",
          width: "100%",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <Grid container spacing={3}>
          <Grid size={9} display="flex" justifyContent="center">
            <Box
              sx={{
                width: "100%",
                maxWidth: 800,
                py: 2,
              }}
            >
              <DealFlowHeader />
              <DealFlowContainer />
            </Box>
          </Grid>

          <Grid size={3} display="flex" justifyContent="flex-end">
            <Box
              sx={{
                width: "100%",
                maxWidth: 450,
                height: "100%",
              }}
            >
              <DealFlowSidebar />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </DealFlowProvider>
  );
};

export default DealFlow;
