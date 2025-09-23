import { ReturnsDealStats } from '@/libs/returns/schema';
import {
  FinanceBreakdown,
  ProjectFinanceBreakdownByProjectId,
} from '@/libs/transactions/schema';
import React from 'react';
import {
  FinanceTypeChip,
  formatCurrency,
  formatPercentage,
  InvestmentCard,
  SummaryTableCell,
  SummaryTableRow,
} from './DashboardComponents';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { DASHBOARD_PROJECTS_TEST_ID } from 'e2e/testIds';
import Alert from '@mui/material/Alert';

type CardDealStats = ReturnsDealStats & {
  count: number;
  interestRates: number[];
};

const getInterestRateRange = (interestRates: number[]) => {
  const min = Math.min(...interestRates);
  const max = Math.max(...interestRates);
  return min === max ? `${max}%` : `${min}% - ${max}%`;
};

const InvestmentCardItem = React.memo(function InvestmentCardItem({
  deal,
  isLoading,
  error,
  transactionHistoryByProject,
  onViewTransactionHistory,
}: {
  deal: CardDealStats;
  isLoading: boolean;
  transactionHistoryByProject: ProjectFinanceBreakdownByProjectId; // tailor the type
  error?: Error | null;
  onViewTransactionHistory: (
    financingType: 'equity' | 'debt',
    data: FinanceBreakdown,
    project: { id: number; name: string }
  ) => void;
}) {
  const cardImage =
    deal.project.pictures?.find(pic => pic.type === 'CARD') ||
    deal.project.pictures?.find(pic => pic.type === 'HEADER') ||
    (deal.project.pictures?.[0] ?? null);

  const numberOfDealsText =
    deal.financingType === 'debt' ? 'Deals' : 'Positions';

  const handleViewClick = () => {
    if (!deal || !deal.project || !deal.financingType) return;
    const data =
      transactionHistoryByProject[deal.project.id]?.[deal.financingType];
    if (!data) return;

    onViewTransactionHistory(deal.financingType, data, deal.project);
  };

  return (
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
          loading="lazy"
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
            <SummaryTableCell className="right">{deal.count}</SummaryTableCell>
          </SummaryTableRow>

          {error ? (
            <Alert severity="error">
              An error ocurred loading transactions
            </Alert>
          ) : (
            <Button
              aria-label={`View ${deal.project.name} payment history`}
              variant="grayPill"
              sx={{ height: '30px', mt: 1 }}
              loading={isLoading}
              data-testid={`${DASHBOARD_PROJECTS_TEST_ID}-current-investment-card-item-btn`}
              onClick={handleViewClick}
            >
              VIEW
            </Button>
          )}
        </Box>
      </CardContent>
    </InvestmentCard>
  );
});

export default InvestmentCardItem;
