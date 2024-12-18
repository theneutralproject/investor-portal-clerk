// LearnPage.tsx
"use client";

import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import DashboardPageBanner from "@/components/Dashboard/DashboardPageBanner";
import DashboardPortfolio from "@/components/Dashboard/DashboardPortfolio";
import Grid from "@mui/material/Grid2";
import InvestingWithNeutral from "@/components/Dashboard/InvestingWithNeutral";
import Questions from "@/components/Dashboard/Questions";
import CreateAccount from "@/components/Dashboard/CreateAccount";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type {
  DealWithOrgMembersAndProject,
  ProjectWithAllNestedData,
} from "@/libs/types";
import DashboardProjects from "@/components/Dashboard/DashboardProjects";
import { useUser } from "@clerk/nextjs";
import CompleteInvestment from "@/components/Dashboard/CompleteInvestment";
import DashboardDeals from "@/components/Dashboard/DashboardDeals";

const DashboardPage = () => {
  const { user } = useUser();

  const loggedIn = !!user;

  const { isLoading, data } = useQuery<ProjectWithAllNestedData[], Error>({
    queryKey: ["project", "all"],
    queryFn: () =>
      axios
        .get<ProjectWithAllNestedData[]>("/api/projects")
        .then((res) => res.data),
  });

  const { isLoading: dealsLoading, data: dealsData } = useQuery<
    DealWithOrgMembersAndProject[],
    Error
  >({
    queryKey: ["deals", "all"],
    queryFn: () =>
      axios
        .get<DealWithOrgMembersAndProject[]>("/api/dashboard/deals")
        .then((res) => res.data),
    enabled: loggedIn,
  });

  if (isLoading || dealsLoading) return <div>Loading...</div>;

  const headline = loggedIn
    ? `Welcome to Neutral, ${user?.firstName}`
    : "Welcome to Neutral";
  return (
    <Box>
      <DashboardPageBanner
        background="/DashboardHeader.jpeg"
        headline={headline}
      />
      <Grid
        container
        spacing={2}
        sx={{ mt: 2, background: "#f5f5f5", borderRadius: "8px" }}
      >
        <Grid
          size={8}
          display="flex"
          justifyContent="center"
          sx={{ background: "#f5f5f5" }}
        >
          <Box sx={{ width: "100%" }}>
            <Card sx={{ borderRadius: "8px", position: "relative" }}>
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "20px",
                    mb: 2,
                  }}
                >
                  Portfolio
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <DashboardPortfolio loggedIn={loggedIn} />
                <DashboardDeals loggedIn={loggedIn} />
              </CardContent>
            </Card>
            <DashboardProjects projects={data ?? []} />
          </Box>
        </Grid>

        <Grid size={4} display="flex" justifyContent="flex-end">
          <Box sx={{ width: "100%" }}>
            {!loggedIn && <CreateAccount />}
            {dealsData && dealsData.length > 0 && (
              <CompleteInvestment deals={dealsData} />
            )}
            <InvestingWithNeutral />
            <Questions />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
