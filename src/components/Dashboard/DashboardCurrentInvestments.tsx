import React, { useState } from 'react';
import {
  Box,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Divider,
  Button,
} from '@mui/material';
import type {
  PortfolioReturnsResponse,
  ReturnsDealStats,
} from '@/libs/returns/schema';
import {
  InvestmentCard,
  FinanceTypeChip,
  SummaryTableRow,
  SummaryTableCell,
  formatCurrency,
  formatPercentage,
} from './DashboardComponents';
import { format } from 'date-fns';

interface DashboardCurrentInvestmentsProps {
  data: PortfolioReturnsResponse;
}

const DashboardCurrentInvestments: React.FC<
  DashboardCurrentInvestmentsProps
> = ({ data }) => {
  const [showAllDeals, setShowAllDeals] = useState(false);

  const cardsPerRow = 3;
  const displayedDeals = showAllDeals
    ? data.dealStats
    : data.dealStats.slice(0, cardsPerRow);
  const hasMoreDeals = data.dealStats.length > cardsPerRow;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="body1"
        sx={{
          fontSize: '20px',
          mb: 2,
        }}
      >
        Current Investments ({data.dealStats.length})
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {displayedDeals.map((deal: ReturnsDealStats) => {
          // Find card image
          const cardImage =
            deal.project.pictures?.find(pic => pic.type === 'CARD') ||
            deal.project.pictures?.find(pic => pic.type === 'HEADER') ||
            (deal.project.pictures && deal.project.pictures.length > 0
              ? deal.project.pictures[0]
              : null);

          return (
            <Grid item xs={12} sm={4} key={deal.dealId}>
              <InvestmentCard>
                <Box sx={{ p: 2, pb: 0 }}>
                  <FinanceTypeChip
                    label={deal.financingType.toUpperCase()}
                    financetype={deal.financingType}
                    size="small"
                  />
                  <Typography variant="h6" component="h2" fontWeight="bold">
                    {deal.project.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Closed: {format(new Date(deal.closingDate), 'MMM d, yyyy')}
                  </Typography>
                </Box>

                {cardImage && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={cardImage.url}
                    alt={deal.project.name}
                  />
                )}

                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <SummaryTableRow className="deal-card">
                      <SummaryTableCell className="left">
                        Principal Invested:
                      </SummaryTableCell>
                      <SummaryTableCell className="right">
                        {formatCurrency(deal.committedAmount)}
                      </SummaryTableCell>
                    </SummaryTableRow>

                    {deal.financingType === 'debt' ? (
                      <SummaryTableRow className="deal-card">
                        <SummaryTableCell className="left">
                          Interest Rate:
                        </SummaryTableCell>
                        <SummaryTableCell className="right">
                          {formatPercentage(deal.debtInterestRatePercentage)}
                        </SummaryTableCell>
                      </SummaryTableRow>
                    ) : (
                      <>
                        <SummaryTableRow className="deal-card">
                          <SummaryTableCell className="left">
                            Equity Multiple:
                          </SummaryTableCell>
                          <SummaryTableCell className="right">
                            {deal.project.targetEquityMultiple.toFixed(1)}x
                          </SummaryTableCell>
                        </SummaryTableRow>
                        <SummaryTableRow className="deal-card">
                          <SummaryTableCell className="left">
                            Accrued Preferred Return:
                          </SummaryTableCell>
                          <SummaryTableCell className="right">
                            {formatPercentage(
                              deal.equityAccruedPreferredReturnPercentage
                            )}
                          </SummaryTableCell>
                        </SummaryTableRow>
                        <SummaryTableRow className="deal-card">
                          <SummaryTableCell className="left">
                            Accrued to Date:
                          </SummaryTableCell>
                          <SummaryTableCell className="right">
                            {formatCurrency(deal.equityAccruedPreferredReturn)}
                          </SummaryTableCell>
                        </SummaryTableRow>
                      </>
                    )}

                    <SummaryTableRow className="deal-card">
                      <SummaryTableCell className="left">
                        Earned to Date:
                      </SummaryTableCell>
                      <SummaryTableCell className="right">
                        {formatCurrency(deal.distributionsToDate)}
                      </SummaryTableCell>
                    </SummaryTableRow>

                    <SummaryTableRow className="deal-card">
                      <SummaryTableCell className="left">
                        Projected Earnings:
                      </SummaryTableCell>
                      <SummaryTableCell className="right">
                        {formatCurrency(
                          deal.distributionsProjected - deal.committedAmount
                        )}
                      </SummaryTableCell>
                    </SummaryTableRow>

                    <SummaryTableRow className="deal-card">
                      <SummaryTableCell className="left">
                        Projected Return:
                      </SummaryTableCell>
                      <SummaryTableCell
                        className="right"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {formatCurrency(deal.distributionsProjected)}
                      </SummaryTableCell>
                    </SummaryTableRow>
                  </Box>
                </CardContent>
              </InvestmentCard>
            </Grid>
          );
        })}
      </Grid>

      {hasMoreDeals && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="neutralRustTerracotta"
            onClick={() => setShowAllDeals(!showAllDeals)}
          >
            {showAllDeals ? 'Show Less' : 'View All Investments'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DashboardCurrentInvestments;
