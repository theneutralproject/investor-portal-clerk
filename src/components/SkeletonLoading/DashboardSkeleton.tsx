import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';

const DashboardSkeleton = () => {
  // Create arrays with fixed length to avoid spread operator
  const portfolioMetrics = Array(4).fill(null);
  const projectSkeletons = Array(3).fill(null);

  return (
    <Box sx={{ background: '#f5f5f5', borderRadius: '8px' }}>
      {/* Banner Skeleton */}
      <Skeleton variant="rectangular" width="100%" height={200} />

      <Grid container spacing={2} sx={{ mt: 2, background: '#f5f5f5' }}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ background: '#f5f5f5' }}>
          <Card>
            <CardContent>
              {/* Portfolio Title Skeleton */}
              <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />

              {/* Portfolio Metrics Skeleton */}
              <Grid container spacing={4} sx={{ mb: 4 }}>
                {portfolioMetrics.map((_, index) => (
                  <Grid size={{ xs: 6, md: 3 }} key={index}>
                    <Skeleton variant="text" width="100%" height={24} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </Grid>
                ))}
              </Grid>

              {/* Chart Skeleton */}
              <Skeleton
                variant="rectangular"
                width="100%"
                height={300}
                sx={{ mt: 4 }}
              />
            </CardContent>
          </Card>

          {/* Projects Section Skeleton */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Skeleton variant="text" width={100} height={32} sx={{ mb: 2 }} />
              {projectSkeletons.map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton variant="rectangular" width="100%" height={120} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ background: '#f5f5f5' }}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton
                variant="text"
                width="100%"
                height={60}
                sx={{ mt: 2 }}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardSkeleton;
