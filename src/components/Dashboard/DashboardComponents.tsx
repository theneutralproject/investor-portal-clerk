import { Box, Card, Chip, styled } from '@mui/material';

// Shared styled components for dashboard elements
export const StyledCard = styled(Card)({
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  borderRadius: 8,
});

export const InvestmentCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(1),
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

export const FinanceTypeChip = styled(Chip)(
  ({ financetype }: { financetype: string }) => ({
    backgroundColor: financetype === 'debt' ? '#2196F3' : '#4CAF50',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '4px',
    height: '18px',
    padding: '0 2px',
    fontSize: '10px',
  })
);

export const SummaryTable = styled(Box)(({}) => ({
  width: '100%',
  borderCollapse: 'separate',
  paddingBottom: '0 !important',
  borderSpacing: 0,
}));

export const SummaryTableRow = styled(Box)(({}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  padding: '0 8px',
  '&.bordered': {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',

    '&:last-child': {
      borderBottom: 'none',
    },
  },
  '&.header': {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
  },
  '&.total': {
    backgroundColor: 'rgba(250, 250, 250, 1)',
    marginBottom: '0 !important',
  },
  '&.deal-card': {
    padding: '0 !important',
  },
}));

export const SummaryTableCell = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  '&.header': {
    fontWeight: 500,
    color: 'rgba(0, 0, 0, 0.87)',
    padding: theme.spacing(1.5, 2),
  },
  '&.left': {
    justifyContent: 'flex-start',
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: '12px',
  },
  '&.right': {
    justifyContent: 'flex-end',
    fontWeight: 500,
    fontSize: '12px',
  },
  '&.investment-type': {
    minWidth: '100px',
  },
  '&.table-header': {
    justifyContent: 'flex-end',
    padding: theme.spacing(2),
    textAlign: 'right',
  },
  '&.table-cell': {
    justifyContent: 'flex-end',
    padding: theme.spacing(2),
    textAlign: 'right',
  },
}));

export const ColorDot = styled(Box)({
  width: 12,
  height: 12,
  borderRadius: '50%',
  display: 'inline-block',
  marginRight: 12,
});

// Utility function for consistent currency formatting
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Utility function for consistent percentage formatting
export const formatPercentage = (value: number): string => {
  return `${value}%`;
};
