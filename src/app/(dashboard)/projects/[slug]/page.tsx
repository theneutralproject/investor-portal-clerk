"use client";
import ImageGallery from "react-image-gallery";
import { Box, Container, Grid, Hidden } from "@mui/material";
import "react-image-gallery/styles/css/image-gallery.css";
import "./dealPage.css";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { type Deal } from "@prisma/client";
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

  const { isLoading, data } = useQuery<ProjectWithPictures[], Error>({
    queryKey: ["project", slug],
    queryFn: () =>
      axios
        .get<ProjectWithPictures[]>(`/api/projects?id=${slug}`)
        .then((res) => res.data),
  });

  const { isLoading: dealLoading, data: dealData } = useQuery<
    Deal | null,
    Error
  >({
    queryKey: ["deal", slug],
    queryFn: () =>
      axios
        .get<Deal | null>(`/api/deals?projectId=${slug}`)
        .then((res) => res.data),
  });

  // Handle loading state
  if (isLoading || dealLoading) {
    return <div>Loading...</div>;
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  const project = data[0]!;

  const dealStage = dealData?.dealStage ?? 0;

  const percentRaised = Math.round(
    (project.investmentRaised / project.investmentGoal) * 100
  );

  const images = project.pictures
    .map((picture) => ({
      original: picture.url,
      thumbnail: picture.url,
      type: picture.type, // Add the type to the mapped object
    }))
    .filter((picture) => picture.type !== "CARD")
    .sort((a) => (a.type === "HEADER" ? -1 : 1));

  const investorStatusBox = () => {
    return (
      <Box
        sx={{
          position: isMobile ? "relative" : "sticky", // Sticky positioning only if not mobile
          top: isMobile ? 0 : "60px", // Adjust top position based on mobile or not
          mt: isMobile ? 2 : 0, // Adjust margin top based on mobile or not
        }}
      >
        {dealStage > 3 ? (
          <SuccessfulInvestor project={project} />
        ) : (
          <InvestmentProgress
            project={project}
            dealStage={dealStage}
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
            {tabValue === 1 && (
              <ProjectDocTab project={project} dealStage={dealStage} />
            )}
            {tabValue === 2 && (
              <InvestTab project={project} dealStage={dealStage} />
            )}
            {tabValue === 3 && <FundTab project={project} deal={dealData!} />}
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
