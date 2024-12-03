// LearnPage.tsx
"use client";

import { Box } from "@mui/material";
import DashboardPageBanner from "@/components/Dashboard/DashboardPageBanner";
import DashboardPortfolio from "@/components/Dashboard/DashboardPortfolio";
import Grid from "@mui/material/Grid2";
import InvestingWithNeutral from "@/components/Dashboard/InvestingWithNeutral";

const DashboardPage = () => {
  const loggedIn = true;
  return (
    <Box>
      <DashboardPageBanner
        background="/learnBanner.png"
        headline="Welcome to Neutral, Brent"
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={8} display="flex" justifyContent="center">
          <Box sx={{ width: "100%" }}>
            <DashboardPortfolio loggedIn={loggedIn} />
          </Box>
        </Grid>

        <Grid size={4} display="flex" justifyContent="flex-end">
          <Box sx={{ width: "100%" }}>
            <InvestingWithNeutral />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
