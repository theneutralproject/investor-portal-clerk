import React from 'react';
import {
  Box,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Divider,
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

const DashboardCurrentInvestments: React.FC<
  DashboardCurrentInvestmentsProps
> = ({ data }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="body1"
        sx={{
          fontSize: '20px',
          mb: 2,
        }}
      >
        Current Investments
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {data.dealStats.map((deal: ReturnsDealStats) => {
          // Find card image
          const cardImage =
            deal.project.pictures?.find(pic => pic.type === 'CARD') ||
            deal.project.pictures?.find(pic => pic.type === 'HEADER') ||
            (deal.project.pictures && deal.project.pictures.length > 0
              ? deal.project.pictures[0]
              : null);

          return (
            <Grid item xs={6} sm={6} md={4} key={deal.dealId}>
              <InvestmentCard>
                <Box sx={{ p: 2, pb: 0 }}>
                  <FinanceTypeChip
                    label={deal.financingType.toUpperCase()}
                    financetype={deal.financingType}
                    size="small"
                  />
                  <Typography
                    variant="h6"
                    component="h2"
                    fontWeight="bold"
                    gutterBottom
                  >
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
                    <SummaryTableRow>
                      <SummaryTableCell className="left">
                        Principal Invested:
                      </SummaryTableCell>
                      <SummaryTableCell className="right">
                        {formatCurrency(deal.committedAmount)}
                      </SummaryTableCell>
                    </SummaryTableRow>

                    {deal.financingType === 'debt' ? (
                      <SummaryTableRow>
                        <SummaryTableCell className="left">
                          Interest Rate:
                        </SummaryTableCell>
                        <SummaryTableCell className="right">
                          {formatPercentage(deal.debtInterestRatePercentage)}
                        </SummaryTableCell>
                      </SummaryTableRow>
                    ) : (
                      <>
                        <SummaryTableRow>
                          <SummaryTableCell className="left">
                            Equity Multiple:
                          </SummaryTableCell>
                          <SummaryTableCell className="right">
                            {deal.project.targetEquityMultiple.toFixed(1)}x
                          </SummaryTableCell>
                        </SummaryTableRow>
                        <SummaryTableRow>
                          <SummaryTableCell className="left">
                            Accrued Preferred Return:
                          </SummaryTableCell>
                          <SummaryTableCell className="right">
                            {formatPercentage(
                              deal.equityAccruedPreferredReturnPercentage
                            )}
                          </SummaryTableCell>
                        </SummaryTableRow>
                        <SummaryTableRow>
                          <SummaryTableCell className="left">
                            Accrued to Date:
                          </SummaryTableCell>
                          <SummaryTableCell className="right">
                            {formatCurrency(deal.equityAccruedPreferredReturn)}
                          </SummaryTableCell>
                        </SummaryTableRow>
                      </>
                    )}

                    <SummaryTableRow>
                      <SummaryTableCell className="left">
                        Earned to Date:
                      </SummaryTableCell>
                      <SummaryTableCell className="right">
                        {formatCurrency(deal.distributionsToDate)}
                      </SummaryTableCell>
                    </SummaryTableRow>

                    <SummaryTableRow>
                      <SummaryTableCell className="left">
                        Projected Earnings:
                      </SummaryTableCell>
                      <SummaryTableCell className="right">
                        {formatCurrency(
                          deal.distributionsProjected - deal.committedAmount
                        )}
                      </SummaryTableCell>
                    </SummaryTableRow>

                    <SummaryTableRow>
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
    </Box>
  );
};

export default DashboardCurrentInvestments;
