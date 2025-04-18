import React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { CreateAccountButton, SignInButton } from './CreateAccount';

import PortfolioMetric from './PortfolioMetric';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { PortfolioReturnsResponse } from '@/libs/returns/schema';
import { getMetrics } from './Portfolio/portfolioHelpers';
import { DASHBOARD_POSTFOLIO_TEST_ID } from 'e2e/testIds';

const DashboardPortfolio: React.FC<{ loggedIn: boolean }> = ({ loggedIn }) => {
  const { data } = useQuery<PortfolioReturnsResponse, Error>({
    queryKey: ['dashboard', 'portfolio'],
    queryFn: async () => {
      const response = await axios.get<PortfolioReturnsResponse>(
        '/api/dashboard/returns'
      );
      return response.data;
    },
    enabled: loggedIn,
  });

  const metrics = getMetrics(data || null);
  return (
    <div data-testid={`${DASHBOARD_POSTFOLIO_TEST_ID}`}>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <PortfolioMetric
              toDateValue={metric.toDateValue}
              projectedTotalValue={metric.projectedTotalValue}
              label={metric.label}
              color={metric.color}
              tooltipDisabled={true}
            />
          </Grid>
        ))}
      </Grid>

      {!loggedIn && (
        <Box
          sx={{
            position: 'absolute',
            top: 80,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(4px)',
            borderRadius: '8px',
          }}
          data-testid={`${DASHBOARD_POSTFOLIO_TEST_ID}-create-account`}
        >
          <Stack spacing={3} alignItems="center" maxWidth="600px" p={4}>
            <Typography variant="body1" align="center" fontWeight="500">
              Invest in Tomorrow, Today
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              color="text.secondary"
            >
              We believe in the power of thoughtful investment to positively
              impact your portfolio and the planet. Explore the projects below
              to discover innovative, sustainable, and regenerative development
              solutions. Sign in or create your account to get started.
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <div data-testid={`${DASHBOARD_POSTFOLIO_TEST_ID}-sign-up`}>
                <CreateAccountButton
                  variant="neutralYellow"
                  data-testid={`${DASHBOARD_POSTFOLIO_TEST_ID}-sign-up-btn`}
                />
              </div>
              <div data-testid={`${DASHBOARD_POSTFOLIO_TEST_ID}-sign-in`}>
                <SignInButton
                  variant="text"
                  data-testid={`${DASHBOARD_POSTFOLIO_TEST_ID}-sign-in-btn`}
                />
              </div>
            </Stack>
          </Stack>
        </Box>
      )}
    </div>
  );
};

export default DashboardPortfolio;
