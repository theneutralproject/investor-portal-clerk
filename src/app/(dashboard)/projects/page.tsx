'use client';

import ProjectCard from '@/components/Project/ProjectCard';
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { toast } from 'react-toastify';

import ProjectPageBanner from '@/components/Project/ProjectPageBanner';
import { theme } from '@/components/Shell/NeutralThemeProvider';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { useSearchParams } from 'next/navigation';
import { useDashboard } from '@/components/Dashboard/DashboardContext';

const Dashboard = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { user, projects, isLoading } = useDashboard();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (user && searchParams.get('afterauth')) {
      const { id, primaryEmailAddress, firstName, lastName } = user;
      posthog.identify(primaryEmailAddress?.toString(), {
        email: primaryEmailAddress?.toString(),
        firstname: firstName,
        lastname: lastName,
        id: id,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
    if (searchParams.get('event') == 'viewing_complete') {
      console.log('The user viewed the docusign doc');
      toast.success('🥳 Congratulations on signing your investment document!');
    }
    const docusigntoken = searchParams.get('code');
    if (docusigntoken) {
      console.log(
        'TODO: redirect user to the correct URL. Need to implement urls for tabs first.'
      );
      // TODO: store the project url that the docusign login was initiated from in ironsession, and then return there
    }
  }, [user, searchParams]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!projects || !Array.isArray(projects)) {
    return <div>No data available</div>;
  }

  return (
    <Box>
      <ProjectPageBanner
        background="/projectBanner.png"
        headline={`Welcome, ${user?.firstName ?? 'User'}`}
        description="And welcome to a more sustainable tomorrow. Thank you for your interest in investing with Neutral. We believe in the power of thoughtful investment to positively impact your portfolio and the planet. Exploring the projects below allows you to discover innovative, sustainable, and regenerative development solutions."
      />

      <Typography
        variant="h5"
        sx={{ mt: 4, textAlign: isMobile ? 'center' : 'unset' }}
      >
        All Projects
      </Typography>
      <Grid
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', sm: 'flex-start' },
        }}
      >
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
