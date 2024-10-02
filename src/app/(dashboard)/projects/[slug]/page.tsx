"use client";
import ImageGallery from "react-image-gallery";
import { Box, Container, Grid, Hidden } from "@mui/material";
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
import type { DealWithInvestmentStats, ProjectWithAllNestedData } from "@/libs/prisma";
import useMediaQuery from "@mui/material/useMediaQuery";
import { theme } from "@/components/Shell/NeutralThemeProvider";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";
import type { DealUpdateSchema, DealCreateSchema } from "@/libs/deal/schema";

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
      posthog.identify(primaryEmailAddress?.toString(), { email: primaryEmailAddress?.toString(), firstname: firstName, lastname: lastName, id: id });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [user, queryParams.afterauth])

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
          dealData.financingType === queryParams.financingType
        )
          return;

        const dealUpdateData: Partial<DealUpdateSchema> = {
          hubspotId: dealData.hubspotId,
          investmentStats: {
            financingType: DealFinancingType[typedFinancingType],
            ...(minDealStage > dealData.dealStage && { dealStage: minDealStage }),
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
    (project.investmentStats.investmentRaised / project.investmentStats.investmentGoal) * 100
  );

  const images = project.pictures
    .map((picture) => ({
      original: picture.url,
      thumbnail: picture.url,
      type: picture.type,
    }))
    .filter((picture) => picture.type !== "CARD")
    .sort((a) => (a.type === "HEADER" ? -1 : 1));

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
    <Container maxWidth="lg" sx={{ p: isMobile ? 1 : 0 }}>
      <Hidden smDown>
        <ImageGallery
          items={images}
          showNav={false}
          showPlayButton={false}
          showFullscreenButton={false}
          additionalClass="app-image-gallery"
        />
      </Hidden>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ position: "sticky", top: "60px", zIndex: 1100 }}>
            <ProjectHeader
              data={project}
              percentRaised={percentRaised}
              tabValue={tabValue}
              onTabChange={handleChange}
              dealStage={dealStage}
            />
          </Box>
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
