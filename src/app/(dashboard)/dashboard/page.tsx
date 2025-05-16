// LearnPage.tsx
'use client';

import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DashboardPageBanner from '@/components/Dashboard/DashboardPageBanner';
import DashboardPortfolio from '@/components/Dashboard/DashboardPortfolio';
import Grid from '@mui/material/Grid2';
import InvestingWithNeutral from '@/components/Dashboard/InvestingWithNeutral';
import Questions from '@/components/Dashboard/Questions';
import CreateAccount from '@/components/Dashboard/CreateAccount';
import DashboardProjects from '@/components/Dashboard/DashboardProjects';
import CompleteInvestment from '@/components/Dashboard/CompleteInvestment';
import DashboardDeals from '@/components/Dashboard/DashboardDeals';
import DashboardNews from '@/components/Dashboard/DashboardNews';
import { theme } from '@/components/Shell/NeutralThemeProvider';
import { useDashboard } from '@/components/Dashboard/DashboardContext';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import { DealStage } from '@/libs/deal/schema';
import RecentActivity from '@/components/Dashboard/RecentActivity';
import { PortfolioReturnsResponse } from '@/libs/returns/schema';

const DashboardPage = () => {
  const { loggedIn, user, projects, deals, isLoading } = useDashboard();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  if (isLoading) return <DashboardSkeleton />;

  const headline = loggedIn
    ? `Welcome to Neutral, ${user?.firstName}`
    : 'Welcome to Neutral';
  return (
    <Box>
      <DashboardPageBanner
        background="/DashboardHeader.jpeg"
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
            md: 8,
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
                  Portfolio
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <DashboardPortfolio loggedIn={loggedIn} data={data} />
                <DashboardDeals loggedIn={loggedIn} data={data} />
              </CardContent>
            </Card>
            <DashboardProjects projects={projects ?? []} />
            <DashboardNews />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} display="flex" justifyContent="flex-end">
          <Box sx={{ width: '100%', backgroundColor: '#f5f5f5' }}>
            {!loggedIn && <CreateAccount />}
            {deals && deals.length > 0 && !isMobile && (
              <CompleteInvestment
                deals={deals?.filter(deal => deal.dealStage < DealStage.CLOSED)}
              />
            )}
            <InvestingWithNeutral />
            <RecentActivity />
            <Questions />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
