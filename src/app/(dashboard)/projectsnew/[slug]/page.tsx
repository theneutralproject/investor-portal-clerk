"use client";
import ImageGallery from "react-image-gallery";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Hidden,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import "react-image-gallery/styles/css/image-gallery.css";
import "./dealPage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { DealFinancingType } from "@prisma/client";
import ProjectHeader from "@/components/Project/ProjectHeader";
import { InvestTab } from "@/components/Project/Invest/InvestTab";
import { ProjectDocTab } from "@/components/Project/ProjectDocs/ProjectDocTab";
import InvestmentProgress from "@/components/Project/InvestmentProgress/InvestmentProgress";
import { OverviewTab } from "@/components/Project/Overview/OverviewTab";
import SuccessfulInvestor from "@/components/Project/InvestmentProgress/SuccessfulInvestor";
import { FundTab } from "@/components/Project/Fund/FundTab";
import useMediaQuery from "@mui/material/useMediaQuery";
import { theme } from "@/components/Shell/NeutralThemeProvider";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";
import type { DealUpdateSchema, DealCreateSchema } from "@/libs/deal/schema";
import type {
  ProjectWithAllNestedData,
  DealWithInvestmentStats,
} from "@/libs/types";
import InvestmentSummaryBox from "@/components/Project/Overview/InvestmentSummaryBox";
import RightSidebarCTA from "@/components/Project/NewProject/RightSidebarCTA";
import BuildingDetails from "@/components/Project/Overview/BuildingDetails";
import BuildingDetailsNew from "@/components/Project/Overview/BuildingDetailsNew";

export type PageProps = {
  params: {
    slug: string;
  };
};

interface QueryParams {
  afterauth: string | null;
  dealStage: string | null;
  financingType: string | null;
}

export default function Page({ params: { slug } }: PageProps) {
  const [tabValue, setTabValue] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const searchParams = useSearchParams();
  const queryParams: QueryParams = {
    afterauth: searchParams.get("afterauth"),
    dealStage: searchParams.get("dealStage"),
    financingType: searchParams.get("financingType"),
  };

  const { user } = useUser();

  const handleChange = (event: React.ChangeEvent<object>, newValue: number) => {
    setTabValue(newValue);
  };

  const { isLoading: projectLoading, data: projectData } = useQuery<
    ProjectWithAllNestedData[],
    Error
  >({
    queryKey: ["project", slug],
    queryFn: () =>
      axios
        .get<ProjectWithAllNestedData[]>(`/api/projects?slug=${slug}`)
        .then((res) => res.data),
  });

  const {
    isLoading: dealLoading,
    data: dealData,
    refetch: refetchDeal,
  } = useQuery<DealWithInvestmentStats | null, Error>({
    queryKey: ["deal", slug],
    queryFn: () =>
      axios
        .get<DealWithInvestmentStats | null>(`/api/deals?slug=${slug}`)
        .then((res) => res.data),
  });

  useEffect(() => {
    if (user && queryParams.afterauth) {
      const { id, primaryEmailAddress, firstName, lastName } = user;
      posthog.identify(primaryEmailAddress?.toString(), {
        email: primaryEmailAddress?.toString(),
        firstname: firstName,
        lastname: lastName,
        id: id,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [user, queryParams.afterauth]);

  useEffect(() => {
    const updateOrCreateDeal = async (project: ProjectWithAllNestedData) => {
      const typedFinancingType = (
        queryParams.financingType &&
        queryParams.financingType in DealFinancingType
          ? queryParams.financingType
          : "equity"
      ) as keyof typeof DealFinancingType;

      const minDealStage = parseInt(queryParams.dealStage ?? "0", 10);

      if (dealData) {
        if (
          dealData.dealStage >= minDealStage &&
          dealData.investmentStats.financingType === queryParams.financingType
        )
          return;

        const dealUpdateData: Partial<DealUpdateSchema> = {
          hubspotId: dealData.hubspotId,
          investmentStats: {
            financingType: DealFinancingType[typedFinancingType],
            ...(minDealStage > dealData.dealStage && {
              dealStage: minDealStage,
            }),
          },
        };

        await axios.put("/api/deals", dealUpdateData);
      } else {
        const dealCreateData: DealCreateSchema = {
          financingType: DealFinancingType[typedFinancingType],
          projectId: project.id,
          dealStage: minDealStage,
        };
        await axios.post("/api/deals", dealCreateData);
      }

      void refetchDeal();
    };

    if (
      projectData?.[0] &&
      dealData !== undefined &&
      queryParams.dealStage &&
      queryParams.financingType
    ) {
      void updateOrCreateDeal(projectData[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealData, projectData, queryParams.dealStage, queryParams.financingType]);

  if (projectLoading || dealLoading || !projectData) {
    return <div>Loading...</div>;
  }

  if (
    !projectData ||
    !Array.isArray(projectData) ||
    projectData.length === 0 ||
    !projectData[0]
  ) {
    return <div>No data available</div>;
  }

  const project = projectData[0];

  const deal = dealData ?? null;
  const dealStage = deal?.dealStage ?? 0;

  const percentRaised = Math.round(
    (project.investmentStats.investmentRaised /
      project.investmentStats.investmentGoal) *
      100
  );

  const projectImage =
    project.pictures.find((picture) => picture.type === "HEADER")?.url ??
    project.pictures[0]?.url;

  const investorStatusBox = () => {
    return (
      <Box
        sx={{
          position: isMobile ? "relative" : "sticky",
          top: isMobile ? 0 : "60px",
          mt: isMobile ? 2 : 0,
        }}
      >
        {dealStage > 3 ? (
          <SuccessfulInvestor project={project} />
        ) : (
          <InvestmentProgress
            project={project}
            deal={deal}
            currentTab={tabValue}
            setTabValue={setTabValue}
          />
        )}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 70.16%, rgba(0, 0, 0, 0.40) 100%), url("${projectImage}") lightgray 0px -637.293px / 100% 294.465% no-repeat`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          color: "white",
          textAlign: "left",
          position: "relative",
          padding: "20px 40px",
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontSize: "64px",
              fontWeight: 500,
            }}
          >
            {project.name}
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              color: "white",
              fontSize: "18px",
              fontWeight: 400,
            }}
          >
            {project.location}
          </Typography>
        </Box>
      </Box>

      {/* Overall container, 2 column layout */}
      <Grid
        container
        spacing={2}
        sx={{ mt: 2, background: "#f5f5f5", borderRadius: "8px" }}
      >
        <Grid
          size={8}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          bgcolor="#f5f5f5"
        >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Investment Summary
              </Typography>
              <Divider sx={{ mt: 2, mb: 2 }} />

              <InvestmentSummaryBox data={project} />
            </CardContent>
          </Card>

          <BuildingDetailsNew data={project} />
        </Grid>
        <Grid size={4} sx={{ background: "unset" }}>
          <RightSidebarCTA project={project} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          {isMobile && investorStatusBox()}
          <Container disableGutters>
            {tabValue === 0 && <OverviewTab data={project} />}
            {tabValue === 1 && <ProjectDocTab project={project} deal={deal!} />}
            {tabValue === 2 && <InvestTab project={project} deal={deal!} />}
            {tabValue === 3 && <FundTab project={project} deal={deal!} />}
          </Container>
        </Grid>

        {!isMobile && (
          <Grid item xs={12} md={4}>
            {investorStatusBox()}
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
