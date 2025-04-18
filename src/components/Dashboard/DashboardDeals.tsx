import React from 'react';
import { Box, Card, CardContent, Typography, styled } from '@mui/material';
import type { PortfolioReturnsResponse } from '@/libs/returns/schema';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface DashboardDealsProps {
  loggedIn: boolean;
}

const StyledCard = styled(Card)({
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  borderRadius: 8,
});

const SummaryTable = styled(Box)(({}) => ({
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
}));

const SummaryTableRow = styled(Box)(({}) => ({
  display: 'flex',
  width: '100%',
  borderBottom: '1px solid rgba(224, 224, 224, 1)',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&.header': {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
  },
  '&.total': {
    backgroundColor: 'rgba(250, 250, 250, 1)',
  },
}));

const SummaryTableCell = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  textAlign: 'right',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  '&.header': {
    fontWeight: 500,
    color: 'rgba(0, 0, 0, 0.87)',
    padding: theme.spacing(1.5, 2),
  },
  '&.left': {
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(3),
  },
  '&.investment-type': {
    minWidth: '100px',
  },
}));

const ColorDot = styled(Box)({
  width: 12,
  height: 12,
  borderRadius: '50%',
  display: 'inline-block',
  marginRight: 12,
});

const DashboardDeals: React.FC<DashboardDealsProps> = ({ loggedIn }) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Early return if no data
  if (!data?.dealStats || data.dealStats.length === 0) {
    return (
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
  }

  // Calculate totals for the summary table
  const tableStats = data.tableStats || {
    equity: {
      principalInvested: 0,
      accruedToDate: 0,
      earnedToDate: 0,
      earningsProjected: 0,
      projectedReturn: 0,
    },
    debt: {
      principalInvested: 0,
      accruedToDate: 0,
      earnedToDate: 0,
      earningsProjected: 0,
      projectedReturn: 0,
    },
  };

  const totalPrincipal =
    tableStats.equity.principalInvested + tableStats.debt.principalInvested;
  const totalAccrued =
    tableStats.equity.accruedToDate + tableStats.debt.accruedToDate;
  const totalEarned =
    tableStats.equity.earnedToDate + tableStats.debt.earnedToDate;
  const totalProjectedEarnings =
    tableStats.equity.earningsProjected + tableStats.debt.earningsProjected;
  const totalProjectedReturn =
    tableStats.equity.projectedReturn + tableStats.debt.projectedReturn;

  return (
    <>
      {/* Summary Table */}
      <StyledCard>
        <CardContent sx={{ p: '0 !important' }}>
          <SummaryTable>
            {/* Header Row */}
            <SummaryTableRow className="header">
              <SummaryTableCell
                className="header left investment-type"
                sx={{ flex: 1.5 }}
              >
                {/* Empty cell for the first column */}
              </SummaryTableCell>
              <SummaryTableCell className="header">
                <Typography
                  sx={{
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  Principal
                  <br />
                  Invested
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell className="header">
                <Typography
                  sx={{
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  Accrued to
                  <br />
                  Date
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell className="header">
                <Typography
                  sx={{
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  Earned to
                  <br />
                  Date
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell className="header">
                <Typography
                  sx={{
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  Projected
                  <br />
                  Earnings
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell className="header">
                <Typography
                  sx={{
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  Projected
                  <br />
                  Return
                </Typography>
              </SummaryTableCell>
            </SummaryTableRow>

            {/* Equity Row */}
            <SummaryTableRow>
              <SummaryTableCell
                className="left investment-type"
                sx={{ flex: 1.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ColorDot sx={{ bgcolor: '#4CAF50' }} />
                  <Typography
                    sx={{
                      color: 'rgba(0, 0, 0, 0.87)',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    Equity
                  </Typography>
                </Box>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography variant="body2">
                  {formatCurrency(tableStats.equity.principalInvested)}
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography variant="body2">
                  {formatCurrency(Math.round(tableStats.equity.accruedToDate))}
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography variant="body2">
                  {tableStats.equity.earnedToDate > 0
                    ? formatCurrency(tableStats.equity.earnedToDate)
                    : '-'}
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography variant="body2">
                  {formatCurrency(
                    Math.round(tableStats.equity.earningsProjected)
                  )}
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography variant="body2">
                  {formatCurrency(
                    Math.round(tableStats.equity.projectedReturn)
                  )}
                </Typography>
              </SummaryTableCell>
            </SummaryTableRow>

            {/* Debt Row */}
            <SummaryTableRow>
              <SummaryTableCell
                className="left investment-type"
                sx={{ flex: 1.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ColorDot sx={{ bgcolor: '#2196F3' }} />
                  <Typography
                    sx={{
                      color: 'rgba(0, 0, 0, 0.87)',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    Debt
                  </Typography>
                </Box>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography variant="body2">
                  {formatCurrency(tableStats.debt.principalInvested)}
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography variant="body2">
                  {tableStats.debt.accruedToDate > 0
                    ? formatCurrency(Math.round(tableStats.debt.accruedToDate))
                    : '-'}
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography variant="body2">
                  {tableStats.debt.earnedToDate > 0
                    ? formatCurrency(Math.round(tableStats.debt.earnedToDate))
                    : '$0'}
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography variant="body2">
                  {formatCurrency(
                    Math.round(tableStats.debt.earningsProjected)
                  )}
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography variant="body2">
                  {formatCurrency(Math.round(tableStats.debt.projectedReturn))}
                </Typography>
              </SummaryTableCell>
            </SummaryTableRow>

            {/* Total Row */}
            <SummaryTableRow className="total">
              <SummaryTableCell
                className="left investment-type"
                sx={{ flex: 1.5 }}
              >
                <Typography
                  sx={{
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  Total
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography
                  sx={{
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {formatCurrency(totalPrincipal)}
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography
                  sx={{
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {formatCurrency(Math.round(totalAccrued))}
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography
                  sx={{
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {totalEarned > 0
                    ? formatCurrency(Math.round(totalEarned))
                    : '$0'}
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography
                  sx={{
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {formatCurrency(Math.round(totalProjectedEarnings))}
                </Typography>
              </SummaryTableCell>
              <SummaryTableCell>
                <Typography
                  sx={{
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {formatCurrency(Math.round(totalProjectedReturn))}
                </Typography>
              </SummaryTableCell>
            </SummaryTableRow>
          </SummaryTable>
        </CardContent>
      </StyledCard>

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
