// LearnPage.tsx
"use client";

import { Box } from "@mui/material";
import DashboardPageBanner from "@/components/Dashboard/DashboardPageBanner";
import DashboardPortfolio from "@/components/Dashboard/DashboardPortfolio";
import Grid from "@mui/material/Grid2";
import InvestingWithNeutral from "@/components/Dashboard/InvestingWithNeutral";
import Questions from "@/components/Dashboard/Questions";
import CreateAccount from "@/components/Dashboard/CreateAccount";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type {
  DealWithFullOrgAndProject,
  ProjectWithAllNestedData,
} from "@/libs/types";
import DashboardProjects from "@/components/Dashboard/DashboardProjects";
import { useUser } from "@clerk/nextjs";
import CompleteInvestment from "@/components/Dashboard/CompleteInvestment";

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
    DealWithFullOrgAndProject[],
    Error
  >({
    queryKey: ["deals", "all"],
    queryFn: () =>
      axios
        .get<DealWithFullOrgAndProject[]>("/api/dashboard/deals")
        .then((res) => res.data),
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
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={8} display="flex" justifyContent="center">
          <Box sx={{ width: "100%" }}>
            <DashboardPortfolio loggedIn={loggedIn} />
            <DashboardProjects projects={data ?? []} />
          </Box>
        </Grid>

        <Grid size={4} display="flex" justifyContent="flex-end">
          <Box sx={{ width: "100%" }}>
            {!loggedIn && <CreateAccount />}
            <CompleteInvestment deals={dealsData ?? []} />
            <InvestingWithNeutral />
            <Questions />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
