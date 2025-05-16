import React from 'react';
import { CardContent, Typography } from '@mui/material';
import type { PortfolioReturnsResponse } from '@/libs/returns/schema';
import DashboardCurrentInvestments from './DashboardCurrentInvestments';
import { StyledCard } from './DashboardComponents';
import DashboardSummary from './DashboardSummary';

interface DashboardDealsProps {
  loggedIn: boolean;
  data?: PortfolioReturnsResponse;
}

const EmptyInvestmentCard = () => (
  <StyledCard sx={{ height: '300px' }}>
    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        You don&apos;t have any investments
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Browse active projects below to get started
      </Typography>
    </CardContent>
  </StyledCard>
);

const DashboardDeals: React.FC<DashboardDealsProps> = ({ data }) => {
  // Early return if no data
  if (!data?.dealStats || data.dealStats.length === 0) {
    return <EmptyInvestmentCard />;
  }

  return (
    <>
      {/* Summary Table */}
      <DashboardSummary data={data} />
      <DashboardCurrentInvestments data={data} />

      <Typography
        variant="subtitle2"
        sx={{ mt: 2, fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.5)' }}
      >
        The financial projections on the Neutral Investor Portal are estimates
        based on current assumptions and are updated monthly for transparency.
        However, they are not guarantees and may change due to market
        conditions. Real estate investments are illiquid, and past performance
        does not ensure future results. Returns depend on factors like property
        performance, investment timing, and economic conditions. All figures are
        illustrative, and Neutral is not a cryptocurrency platform.
      </Typography>
    </>
  );
};

export default DashboardDeals;
