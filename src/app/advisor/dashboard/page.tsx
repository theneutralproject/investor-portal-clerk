'use client';

import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useUser } from '@clerk/nextjs';
import DashboardPageBanner from '@/components/Dashboard/DashboardPageBanner';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import AdvisorClientsTable from '@/components/Tables/AdvisorClientsTable';
import { Role } from '@prisma/client';

const AdvisorDashboardPage = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded || user?.publicMetadata.role !== Role.ADVISOR) {
    return <DashboardSkeleton />;
  }

  const headline = isSignedIn ? `Welcome, ${user?.firstName}` : 'Welcome';
  return (
    <Box>
      <DashboardPageBanner
        background="/AdvisorDashboardHeader.jpeg"
        headline={headline}
      />
      <Grid
        container
        spacing={2}
        sx={{ mt: 2, background: '#f5f5f5', borderRadius: '8px' }}
      >
        <Grid
          size={{
            xs: 12,
            md: 12,
          }}
          display="flex"
          justifyContent="center"
          sx={{ background: '#f5f5f5' }}
        >
          <Box sx={{ width: '100%' }}>
            <Card sx={{ borderRadius: '8px', position: 'relative' }}>
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '20px',
                    mb: 2,
                  }}
                >
                  Clients
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <AdvisorClientsTable loadRequest={isSignedIn} />
                <Divider sx={{ mb: 3 }} />
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvisorDashboardPage;
