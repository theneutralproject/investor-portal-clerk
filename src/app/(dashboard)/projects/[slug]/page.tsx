"use client";
import ImageGallery from "react-image-gallery";
import { Box, Container, Grid, Hidden } from "@mui/material";
import "react-image-gallery/styles/css/image-gallery.css";
import "./dealPage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { DealFinancingType, type Deal } from "@prisma/client";
import ProjectHeader from "@/components/Project/ProjectHeader";
import { InvestTab } from "@/components/Project/Invest/InvestTab";
import { ProjectDocTab } from "@/components/Project/ProjectDocs/ProjectDocTab";
import InvestmentProgress from "@/components/Project/InvestmentProgress/InvestmentProgress";
import { OverviewTab } from "@/components/Project/Overview/OverviewTab";
import SuccessfulInvestor from "@/components/Project/InvestmentProgress/SuccessfulInvestor";
import { FundTab } from "@/components/Project/Fund/FundTab";
import { type ProjectWithPictures } from "@/libs/prisma";
import useMediaQuery from "@mui/material/useMediaQuery";
import { theme } from "@/components/Shell/NeutralThemeProvider";
import { useSearchParams } from "next/navigation";
import {
  type DealCreateSchema,
  type DealUpdateSchema,
} from "@/app/api/utils-module/_globals";

export type PageProps = {
  params: {
    slug: string;
  };
};

export default function Page({ params: { slug } }: PageProps) {
  const [tabValue, setTabValue] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (event: React.ChangeEvent<object>, newValue: number) => {
    setTabValue(newValue);
  };

  const searchParams = useSearchParams();

  const queryParams = {
    afterauth: searchParams.get("afterauth"),
    dealStage: searchParams.get("dealStage"),
    financingType: searchParams.get("financingType"),
  };

  const { isLoading: projectLoading, data: projectData } = useQuery<
    ProjectWithPictures[],
    Error
  >({
    queryKey: ["project", slug],
    queryFn: () =>
      axios
        .get<ProjectWithPictures[]>(`/api/projects?id=${slug}`)
        .then((res) => res.data),
  });

  const {
    isLoading: dealLoading,
    data: dealData,
    refetch: refetchDeal,
  } = useQuery<Deal | null, Error>({
    queryKey: ["deal", slug],
    queryFn: () =>
      axios
        .get<Deal | null>(`/api/deals?projectId=${slug}`)
        .then((res) => res.data),
  });

  useEffect(() => {
    const updateOrCreateDeal = async (project: ProjectWithPictures) => {
      let typedFinancingType: keyof typeof DealFinancingType = "equity";
      if (queryParams.financingType in DealFinancingType) {
        typedFinancingType =
          queryParams.financingType as keyof typeof DealFinancingType;
      }

      const minDealStage = parseInt(queryParams.dealStage, 10);

      if (dealData) {
        if (
          dealData.dealStage >= minDealStage &&
          dealData.financingType === queryParams.financingType
        )
          return;

        const dealUpdateData: DealUpdateSchema = {
          hubspotId: dealData.hubspotId,
          financingType: DealFinancingType[typedFinancingType],
        };
        if (minDealStage > dealData.dealStage) {
          dealUpdateData.dealStage = minDealStage;
        }

        await axios.put(`/api/deals`, dealUpdateData);
      } else {
        const dealCreateData: DealCreateSchema = {
          financingType: DealFinancingType[typedFinancingType],
          projectId: project.id,
          dealStage: minDealStage,
        };
        await axios.post(`/api/deals`, dealCreateData);
      }

      void refetchDeal();
    };

    if (projectData && dealData !== undefined) {
      if (queryParams.dealStage && queryParams.financingType) {
        void updateOrCreateDeal(projectData[0]);
      }
    }
  }, [dealData, projectData]);

  if (projectLoading || dealLoading) {
    return <div>Loading...</div>;
  }

  if (!projectData || !Array.isArray(projectData) || projectData.length === 0) {
    return <div>No data available</div>;
  }

  const project = projectData[0];
  const deal = dealData ?? null;
  const dealStage = deal?.dealStage ?? 0;

  const percentRaised = Math.round(
    (project.investmentRaised / project.investmentGoal) * 100
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
