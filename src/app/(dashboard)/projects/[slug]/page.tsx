"use client";
import ImageGallery from "react-image-gallery";
import { Box, Container, Grid, Hidden } from "@mui/material";
import "react-image-gallery/styles/css/image-gallery.css";
import "./dealPage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { DealFinancingType, Project, type Deal } from "@prisma/client";
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
import posthog from "posthog-js";
import { useUser } from "@clerk/nextjs";
import { DealCreateSchema, DealUpdateSchema } from "@/app/api/utils-module/_globals";

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
  const { user } = useUser();

  const queryParams = {
    afterauth: searchParams.get('afterauth') || null,
    dealStage: searchParams.get('dealStage') || null,
    financingType: searchParams.get('financingType') || null,
  }

  // register user in posthog
  useEffect(() => {
    if (user && queryParams.afterauth) {
      const { id, primaryEmailAddress, firstName, lastName } = user;
      posthog.identify(primaryEmailAddress?.toString(), { email: primaryEmailAddress?.toString(), firstname: firstName, lastname: lastName, id: id });
    }
  }, [user, queryParams.afterauth])



  const projectQueryFn = () =>
    axios
      .get<ProjectWithPictures[]>(`/api/projects?id=${slug}`)
      .then((res) => res.data);

  const { isLoading, data } = useQuery<ProjectWithPictures[], Error>({
    queryKey: ["project", slug],
    queryFn: projectQueryFn
  });

  const dealQueryFn = () => {
    console.log("dealQueryFn", queryParams.financingType);

    return axios
      .get<Deal | null>(`/api/deals?projectId=${slug}`)
      .then((res) => res.data);
  }

  const { isLoading: dealLoading, data: dealData } = useQuery<
    Deal | null,
    Error
  >({
    queryKey: ["deal", slug],
    queryFn: dealQueryFn
  });

  let project : ProjectWithPictures | null = null;
  let deal = dealData ?? null;
  let dealStage = deal?.dealStage ?? 0;

  // update/ create the deal to provide access to more documents, if queryparams say so
  useEffect(() => {
    if (project && queryParams.dealStage && queryParams.financingType) {

      let typedFinancingType: keyof typeof DealFinancingType = "equity";
      if (queryParams.financingType in DealFinancingType) {
        typedFinancingType = queryParams.financingType as keyof typeof DealFinancingType;
      }

      // the user should get access to financing docs but a deal might not yet exist.
      // check if it exists, and potentially create one on the fly

      const minDealStage = parseInt(queryParams.dealStage, 10);
      if (deal) {
        console.log("GOT DEAL TO UPDATE", deal)
        // check if existing deal needs to be updated to present the correct financing docs to the user:
        if (deal.dealStage >= minDealStage && deal?.financingType === queryParams.financingType) return;
        else {
          const dealData: DealUpdateSchema = {
            hubspotId: deal.hubspotId,
            financingType: DealFinancingType[typedFinancingType],
          }
          if (minDealStage > deal.dealStage) dealData.dealStage = minDealStage;

          axios.put(`/api/deals`, dealData).then((res) => {
            deal = res.data;
            dealStage = deal!.dealStage;
          });
        }
      }
      else {
        // create a new deal
        const dealCreationData: DealCreateSchema = {
          financingType: DealFinancingType[typedFinancingType],
          projectId: project.id,
          dealStage: minDealStage
        }
        axios.post(`/api/deals`, dealCreationData).then((res) => {
          console.log("Deal has been created");
          deal = res.data;
          dealStage = deal!.dealStage;
        });
      }
    }
  }, [dealData, project,])


  // Handle loading state
  if (isLoading || dealLoading) {
    return <div>Loading...</div>;
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  project = data[0]!;

  const percentRaised = Math.round(
    (project!.investmentRaised / project!.investmentGoal) * 100
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
            {tabValue === 1 && (
              <ProjectDocTab project={project} deal={deal!} />
            )}
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
