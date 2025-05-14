'use client';

import { use } from 'react';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import { useUser } from '@clerk/nextjs';
import AdvisorDocumentsTable from '@/components/Tables/AdvisorDocumentsTable';
import { NextClientPage } from '@/types/page';

const AdvisorClientPage = ({ params }: NextClientPage) => {
  const { slug: id } = use(params);
  const { isSignedIn, isLoaded } = useUser();

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

                <AdvisorDocumentsTable
                  loadRequest={isSignedIn}
                  hiddenFilters={['client']}
                  hiddenColumns={['clientName']}
                  clientId={parseInt(id, 10)}
                />
                <Divider sx={{ mb: 3 }} />
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
