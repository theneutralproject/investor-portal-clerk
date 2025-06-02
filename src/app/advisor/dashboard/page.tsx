'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useUser } from '@clerk/nextjs';
import DashboardPageBanner from '@/components/Dashboard/DashboardPageBanner';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import AdvisorClientsTable from '@/components/Tables/AdvisorClientsTable';
import { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { AdvisorClientsResponse } from '@/libs/types';
import { useMemo, useState } from 'react';

const AdvisorDashboardPage = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [clientResults, setClientResults] = useState<{
    clients: number;
    fundsAllocated: string;
  }>();
  const router = useRouter();

  const getClientResults = (data: AdvisorClientsResponse) => {
    const clients = data.clients.length;
    const fundsAllocated = data.clients.reduce(
      (sum, item) => (sum += item.totalInvested),
      0
    );
    setClientResults({
      clients,
      fundsAllocated: `$${Math.round(fundsAllocated).toLocaleString()}`,
    });
  };
  const headline = isSignedIn ? `Welcome, ${user?.firstName}` : 'Welcome';

  const onResourceCenterClick = () => {
    router.push('/advisor/faq');
  };
  const clientsText = useMemo(
    () =>
      clientResults ? (
        clientResults?.clients || 'N/A'
      ) : (
        <CircularProgress size={32} />
      ),
    [clientResults]
  );
  const fundsAllowedText = useMemo(
    () =>
      clientResults ? (
        clientResults?.fundsAllocated || 'N/A'
      ) : (
        <CircularProgress size={32} />
      ),
    [clientResults]
  );

  if (!isLoaded || user?.publicMetadata.role !== Role.ADVISOR) {
    return <DashboardSkeleton />;
  }

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
          container
          spacing={2}
          size={{
            xs: 12,
            md: 12,
          }}
          display="flex"
          sx={{ background: '#f5f5f5' }}
        >
          <Grid
            size={{
              xs: 6,
              sm: 3,
              md: 2,
            }}
            sx={{ background: 'transparent' }}
          >
            <Card sx={{ borderRadius: '8px' }}>
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    mb: 1,
                    color: 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  Clients
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: '32px',
                    fontWeight: 600,
                    color: 'rgba(0, 0, 0, 0.87)',
                  }}
                >
                  {clientsText}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              xs: 6,
              sm: 4,
              md: 3,
            }}
            sx={{ background: 'transparent' }}
          >
            <Card sx={{ borderRadius: '8px' }}>
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    mb: 1,
                    color: 'rgba(0, 0, 0, 0.6)',
                  }}
                >
                  Funds Allocated
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: '32px',
                    fontWeight: 600,
                    color: 'rgba(0, 0, 0, 0.87)',
                  }}
                >
                  {fundsAllowedText}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 5,
              md: 7,
            }}
            sx={{ background: 'transparent' }}
          >
            <Card sx={{ borderRadius: '8px' }}>
              <CardContent>
                <Grid container>
                  <Grid
                    size={{ xs: 12 }}
                    sx={{
                      display: 'flex',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '14px',
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontWeight: 500,
                      }}
                    >
                      Resource Center
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '16px',
                        color: 'rgba(29, 41, 57, 0.5)',
                        fontWeight: 400,
                      }}
                    >
                      Access articles, FAQs, template emails,
                      <br />
                      investment materials and more!
                    </Typography>
                  </Grid>
                  <Grid
                    size={{ xs: 12, sm: 6 }}
                    sx={{
                      alignContent: 'flex-end',
                      alignItems: 'flex-end',
                      textAlign: 'right',
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={onResourceCenterClick}
                      sx={{
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        color: 'rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      Resource Center
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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

                <AdvisorClientsTable
                  loadRequest={isSignedIn}
                  router={router}
                  getResults={getClientResults}
                />
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
