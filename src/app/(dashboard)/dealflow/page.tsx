"use client";
import React from "react";

import { Grid } from "@mui/material";
import DealFlowContainer from "@/components/DealFlow/DealFlowContainer";
import { DealFlowProvider } from "@/components/DealFlow/DealFlowContext";
import DealFlowHeader from "@/components/DealFlow/DealFlowHeader";
import DealFlowSidebar from "@/components/DealFlow/DealFlowSidebar";

const DealFlow = () => {
  return (
    <DealFlowProvider>
      <Grid container spacing={2} sx={{ backgroundColor: "white", height: "100%" }}>
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
