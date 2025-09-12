import React, { useState } from 'react';
import {
  Box,
  CardContent,
  CardMedia,
  Typography,
  Grid,
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

interface DashboardCurrentInvestmentsProps {
  data: PortfolioReturnsResponse;
}

type CardDealStats = ReturnsDealStats & {
  count: number;
  interestRates: number[];
};

const getInterestRateRange = (interestRates: number[]) => {
  const min = Math.min(...interestRates);
  const max = Math.max(...interestRates);
  return min === max ? `${max}%` : `${min}% - ${max}%`;
};

const groupDealsByProjectAndFinanceType = (dealStats: ReturnsDealStats[]) => {
  const groupedDeals: {
    [key: string]: ReturnsDealStats & {
      count: number;
      interestRates: number[];
    };
  } = {};

  dealStats.map(deal => {
    const key = `${deal.project.id}-${deal.financingType}`;

    if (groupedDeals[key]) {
      groupedDeals[key].committedAmount += deal.committedAmount || 0;
      groupedDeals[key].distributionsToDate += deal.distributionsToDate || 0;
      groupedDeals[key].equityAccruedPreferredReturn +=
        deal.equityAccruedPreferredReturn || 0;
      groupedDeals[key].count += 1;
      groupedDeals[key].interestRates.push(
        deal.debtInterestRatePercentage ||
          deal.equityAccruedPreferredReturnPercentage
      );
    } else {
      groupedDeals[key] = {
        ...deal,
        count: 1,
        interestRates: [
          deal.debtInterestRatePercentage ||
            deal.equityAccruedPreferredReturnPercentage,
        ],
      };
    }
  });

  return Object.values(groupedDeals);
};

const DashboardCurrentInvestments: React.FC<
  DashboardCurrentInvestmentsProps
> = ({ data }) => {
  const [showAllDeals, setShowAllDeals] = useState(false);

  const cardsPerRow = 3;
  const deals = groupDealsByProjectAndFinanceType(data.dealStats);
  const displayedDeals = showAllDeals ? deals : deals.slice(0, cardsPerRow);
  const hasMoreDeals = deals.length > cardsPerRow;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="body1"
        sx={{
          fontSize: '16px',
          fontWeight: '600',
          mb: 2,
        }}
      >
        Current Investments ({data.dealStats.length})
      </Typography>

      <Grid container spacing={3}>
        {displayedDeals.map((deal: CardDealStats) => {
          // Find card image
          const cardImage =
            deal.project.pictures?.find(pic => pic.type === 'CARD') ||
            deal.project.pictures?.find(pic => pic.type === 'HEADER') ||
            (deal.project.pictures && deal.project.pictures.length > 0
              ? deal.project.pictures[0]
              : null);
          const numberOfDealsText =
            deal.financingType === 'debt' ? 'Deals' : 'Positions';

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
                      <>
                        <SummaryTableRow className="deal-card">
                          <SummaryTableCell className="left">
                            Interest Rate:
                          </SummaryTableCell>
                          <SummaryTableCell className="right">
                            {getInterestRateRange(deal.interestRates)}
                          </SummaryTableCell>
                        </SummaryTableRow>
                        <SummaryTableRow className="deal-card">
                          <SummaryTableCell className="left">
                            Interest Earned to Date:
                          </SummaryTableCell>
                          <SummaryTableCell className="right">
                            {formatCurrency(deal.distributionsToDate)}
                          </SummaryTableCell>
                        </SummaryTableRow>
                      </>
                    ) : (
                      <>
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
                        No. of {numberOfDealsText}:
                      </SummaryTableCell>
                      <SummaryTableCell className="right">
                        {deal.count}
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
