import React, { useMemo, useState } from 'react';
import { Box, Typography, Button, Grid2 as Grid } from '@mui/material';
import type {
  PortfolioReturnsResponse,
  ReturnsDealStats,
} from '@/libs/returns/schema';
import { useTransactionToken } from '@/app/hooks/useTransactionToken';
import { useTransactionHistory } from '@/app/hooks/useTransactionHistory';
import { buildProjectFinanceBreakdown } from '@/libs/transactions/utils.client';
import InvestmentCardItem from './InvestmentCardItem';
import TransactionHistoryModal from './Modal/TransactionHistoryModal';
import { FinanceBreakdown } from '@/libs/transactions/schema';

interface DashboardCurrentInvestmentsProps {
  data: PortfolioReturnsResponse;
}

type GroupedDeal = ReturnsDealStats & {
  count: number;
  interestRates: number[];
};

const groupDealsByProjectAndFinanceType = (dealStats: ReturnsDealStats[]) => {
  const groupedDeals: { [x: string]: GroupedDeal } = {};

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

const CARDS_PER_ROW = 3;

const DashboardCurrentInvestments: React.FC<
  DashboardCurrentInvestmentsProps
> = ({ data }) => {
  const [showAllDeals, setShowAllDeals] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<{
    financingType: 'equity' | 'debt';
    data: FinanceBreakdown;
    project: { id: number; name: string };
  } | null>();
  const [openTransactionModal, setOpenTransactionModal] = useState(false);

  const deals = useMemo(
    () => groupDealsByProjectAndFinanceType(data.dealStats),
    [data.dealStats]
  );

  const hasMoreDeals = deals.length > CARDS_PER_ROW;

  const displayedDeals = useMemo(
    () => (showAllDeals ? deals : deals.slice(0, CARDS_PER_ROW)),
    [showAllDeals, deals]
  );

  const {
    isLoading: isLoadingTransactionToken,
    data: transactionToken,
    error: tokenError,
  } = useTransactionToken({ enabled: data?.dealStats?.length > 0 });

  const {
    isLoading: isLoadingTransactionHistory,
    data: transactionHistory,
    error: historyError,
  } = useTransactionHistory({ enabled: Boolean(transactionToken) });

  const transactionHistoryByProject = useMemo(() => {
    return transactionHistory
      ? buildProjectFinanceBreakdown(data.dealStats, transactionHistory.data)
      : {};
  }, [transactionHistory, data.dealStats]);

  const isLoadingTransactions =
    isLoadingTransactionToken || isLoadingTransactionHistory;
  const errorTransactions = tokenError || historyError;

  const handleViewTransactionHistoryClick = (
    financingType: 'equity' | 'debt',
    data: FinanceBreakdown,
    project: { id: number; name: string }
  ) => {
    setSelectedInvestment({
      financingType,
      data,
      project,
    });
    setOpenTransactionModal(true);
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
    setSelectedInvestment(null);
  };

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
        {displayedDeals.map(deal => (
          <Grid size={{ xs: 12, sm: 4 }} key={deal.dealId}>
            <InvestmentCardItem
              deal={deal}
              isLoading={isLoadingTransactions}
              error={errorTransactions}
              transactionHistoryByProject={transactionHistoryByProject}
              onViewTransactionHistory={handleViewTransactionHistoryClick}
            />
          </Grid>
        ))}
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
      {selectedInvestment && (
        <TransactionHistoryModal
          data={selectedInvestment?.data}
          financingType={selectedInvestment?.financingType}
          open={openTransactionModal}
          onClose={handleCloseTransactionModal}
          project={selectedInvestment.project}
        />
      )}
    </Box>
  );
};

export default DashboardCurrentInvestments;
