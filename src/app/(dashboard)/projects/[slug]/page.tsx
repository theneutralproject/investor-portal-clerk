'use client';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import 'react-image-gallery/styles/css/image-gallery.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import posthog from 'posthog-js';
import type { ProjectWithAllNestedData } from '@/libs/types';
import InvestmentSummaryBox from '@/components/Project/Overview/InvestmentSummaryBox';
import RightSidebarCTA from '@/components/Project/NewProject/RightSidebarCTA';
import BuildingDetailsNew from '@/components/Project/Overview/BuildingDetailsNew';
import ProjectDescriptionNew from '@/components/Project/Overview/ProjectDescriptionNew';
import MarketHighlightsNew from '@/components/Project/Overview/MarketHighlightsNew';
import InvestmentCalculatorNew from '@/components/Project/Overview/InvestmentCalculatorNew';
import DocumentsNew from '@/components/Project/Overview/DocumentsNew';
import GalleryNew from '@/components/Project/Overview/GalleryNew';
import HaveQuestionsNew from '@/components/Project/Overview/HaveQuestionsNew';

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
  const searchParams = useSearchParams();
  const queryParams: QueryParams = {
    afterauth: searchParams.get('afterauth'),
    dealStage: searchParams.get('dealStage'),
    financingType: searchParams.get('financingType'),
  };

  const { user } = useUser();
  const loggedIn = !!user;

  const { isLoading: projectLoading, data: projectData } = useQuery<
    ProjectWithAllNestedData[],
    Error
  >({
    queryKey: ['project', slug],
    queryFn: () =>
      axios
        .get<ProjectWithAllNestedData[]>(`/api/public/projects?slug=${slug}`)
        .then(res => res.data),
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

  if (projectLoading || !projectData) {
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

  const projectImage =
    project.pictures.find(picture => picture.type === 'HEADER')?.url ??
    project.pictures[0]?.url;

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 70.16%, rgba(0, 0, 0, 0.40) 100%), url("${projectImage}") lightgray 0px -637.293px / 100% 294.465% no-repeat`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          color: 'white',
          textAlign: 'left',
          position: 'relative',
          padding: '20px 40px',
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontSize: '64px',
              fontWeight: 500,
            }}
          >
            {project.name}
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              color: 'white',
              fontSize: '18px',
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
        sx={{ mt: 2, background: '#f5f5f5', borderRadius: '8px' }}
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
          <ProjectDescriptionNew data={project} />
          <MarketHighlightsNew data={project} />
          <InvestmentCalculatorNew project={project} />
          {loggedIn && <DocumentsNew project={project} />}
          <GalleryNew data={project} />
          <HaveQuestionsNew />
        </Grid>
        <Grid size={4} sx={{ background: 'unset' }}>
          <RightSidebarCTA project={project} />
        </Grid>
      </Grid>
    </Container>
  );
}
