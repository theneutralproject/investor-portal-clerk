'use client';

import { use } from 'react';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import { useUser } from '@clerk/nextjs';
import AdvisorDocumentsTable from '@/components/Tables/AdvisorDocumentsTable';
import { NextClientPage } from '@/types/page';
import DashboardSummary from '@/components/Dashboard/DashboardSummary';
import DashboardPortfolio from '@/components/Dashboard/DashboardPortfolio';
import { PortfolioReturnsResponse } from '@/libs/returns/schema';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const AdvisorClientPage = ({ params }: NextClientPage) => {
  const { slug: id } = use(params);
  const { isSignedIn, isLoaded } = useUser();
  const { data } = useQuery<PortfolioReturnsResponse, Error>({
    queryKey: ['advisor', 'client-returns', id],
    queryFn: async () => {
      const response = await axios.get<PortfolioReturnsResponse>(
        `/api/advisors/clients/${id}/returns`
      );
      return response.data;
    },
    enabled: isSignedIn,
  });

  if (!isLoaded) return <DashboardSkeleton />;

  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          background: '#f5f5f5',
          borderRadius: '8px',
          display: 'flex',
        }}
      >
        <Grid
          size={{
            xs: 12,
            md: 7,
          }}
          justifyContent="center"
          sx={{ background: '#f5f5f5' }}
        >
          <Box sx={{ width: '100%', mb: 2 }}>
            <Card sx={{ borderRadius: '8px', position: 'relative' }}>
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '20px',
                    mb: 2,
                  }}
                >
                  Investments
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <DashboardPortfolio loggedIn={isSignedIn} data={data} />
                <DashboardSummary data={data} />
              </CardContent>
            </Card>
          </Box>
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
                  Documents
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <AdvisorDocumentsTable
                  loadRequest={isSignedIn}
                  hiddenFilters={['client']}
                  hiddenColumns={['clientName']}
                  clientId={parseInt(id, 10)}
                />
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 4,
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
                  Personal Info
                </Typography>

                <Divider sx={{ mb: 3 }} />
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvisorClientPage;
