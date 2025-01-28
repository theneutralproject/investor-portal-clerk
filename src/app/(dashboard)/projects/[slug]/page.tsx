'use client';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import 'react-image-gallery/styles/css/image-gallery.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
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
import CreateAccount from '@/components/Dashboard/CreateAccount';
import { theme } from '@/components/Shell/NeutralThemeProvider';
import MobileCTA from '@/components/Project/NewProject/MobileCTA';
import { useDashboard } from '@/components/Dashboard/DashboardContext';
import CompleteInvestment from '@/components/Dashboard/CompleteInvestment';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import { usePostHog } from 'posthog-js/react';
import { POSTHOG_EVENTS } from '@/app/CSPostHogProvider';
import { useRouter } from 'next/navigation';
export type PageProps = {
  params: {
    slug: string;
  };
};

export default function Page({ params: { slug } }: PageProps) {
  const { loggedIn, user, deals } = useDashboard();
  const posthog = usePostHog();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    posthog.capture(POSTHOG_EVENTS.PROJECT_PAGE_VIEWED, {
      current_url: window.location.href,
      user_id: user?.id,
      logged_in: loggedIn,
    });
  }, [user, loggedIn, posthog]);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.hash === '#documents'
    ) {
      setTimeout(() => {
        const documentsSection = document.getElementById('documents');
        if (documentsSection) {
          documentsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [projectData]);

  if (projectLoading || !projectData) return <DashboardSkeleton />;

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

  const handleInvest = () => {
    posthog.capture(POSTHOG_EVENTS.PROJECT_INVEST_CLICKED, {
      project_id: project.id,
      project_name: project.name,
    });
    router.push(`/dealflow/${project.slug}/new/get-started`);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ paddingBottom: isMobile ? '150px' : undefined }}
    >
      <Box
        sx={{
          background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 70.16%, rgba(0, 0, 0, 0.40) 100%), url("${projectImage}") lightgray 0px -637.293px / 100% 294.465% no-repeat`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: isMobile ? '200px' : '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          color: 'white',
          textAlign: 'left',
          position: 'relative',
          padding: isMobile ? '10px 20px' : '20px 40px',
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

      {isMobile && <MobileCTA project={project} onInvest={handleInvest} />}

      {/* Overall container, 2 column layout */}
      <Grid
        container
        spacing={2}
        direction={{ xs: 'column-reverse', md: 'row' }}
        sx={{ mt: 2, background: '#f5f5f5', borderRadius: '8px' }}
      >
        <Grid
          size={{ xs: 12, md: 8 }}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          bgcolor="#f5f5f5"
        >
          <Card sx={{ position: 'relative' }}>
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
          <Box sx={{ position: 'relative' }}>
            <Box
              id="documents"
              sx={{ position: 'absolute', top: -80, left: 0 }}
            />
            {loggedIn && <DocumentsNew project={project} />}
          </Box>
          <GalleryNew data={project} />
          <HaveQuestionsNew />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ background: 'unset' }}>
          {!isMobile && (
            <CompleteInvestment
              deals={deals?.filter(
                deal => deal.projectId === project.id && deal.dealStage < 5
              )}
            />
          )}
          <RightSidebarCTA project={project} onInvest={handleInvest} />
          {!isMobile && (
            <CompleteInvestment
              deals={deals?.filter(
                deal => deal.projectId === project.id && deal.dealStage >= 5
              )}
            />
          )}

          {!loggedIn && <CreateAccount />}
        </Grid>
      </Grid>
    </Container>
  );
}
