import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PortfolioReturnsResponse } from '@/libs/returns/schema';
import {
  ColorDot,
  StyledCard,
  SummaryTable,
  SummaryTableRow,
  SummaryTableCell,
  formatCurrency,
} from './DashboardComponents';

export interface IDashboardSummaryProps {
  data: PortfolioReturnsResponse;
}
export const DashboardSummary = ({ data }: IDashboardSummaryProps) => {
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
    <StyledCard>
      <CardContent sx={{ p: '0 !important' }}>
        <Box
          sx={{
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '3px',
            },
          }}
        >
          <Box
            sx={{
              minWidth: { xs: '650px', sm: '100%' },
              width: '100%',
            }}
          >
            <SummaryTable>
              {/* Header Row */}
              <SummaryTableRow className="header">
                <SummaryTableCell
                  className="header left investment-type"
                  sx={{ flex: 1.5 }}
                >
                  {/* Empty cell for the first column */}
                </SummaryTableCell>
                <SummaryTableCell className="header table-header">
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
                <SummaryTableCell className="header table-header">
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
                <SummaryTableCell className="header table-header">
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
                <SummaryTableCell className="header table-header">
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
                <SummaryTableCell className="header table-header">
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
              <SummaryTableRow className="bordered">
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
                <SummaryTableCell className="table-cell">
                  <Typography variant="body2">
                    {formatCurrency(tableStats.equity.principalInvested)}
                  </Typography>
                </SummaryTableCell>
                <SummaryTableCell className="table-cell">
                  <Typography variant="body2">
                    {formatCurrency(
                      Math.round(tableStats.equity.accruedToDate)
                    )}
                  </Typography>
                </SummaryTableCell>
                <SummaryTableCell className="table-cell">
                  <Typography variant="body2">
                    {tableStats.equity.earnedToDate > 0
                      ? formatCurrency(tableStats.equity.earnedToDate)
                      : '-'}
                  </Typography>
                </SummaryTableCell>
                <SummaryTableCell className="table-cell">
                  <Typography variant="body2">
                    {formatCurrency(
                      Math.round(tableStats.equity.earningsProjected)
                    )}
                  </Typography>
                </SummaryTableCell>
                <SummaryTableCell className="table-cell">
                  <Typography variant="body2">
                    {formatCurrency(
                      Math.round(tableStats.equity.projectedReturn)
                    )}
                  </Typography>
                </SummaryTableCell>
              </SummaryTableRow>

              {/* Debt Row */}
              <SummaryTableRow className="bordered">
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
                <SummaryTableCell className="table-cell">
                  <Typography variant="body2">
                    {formatCurrency(tableStats.debt.principalInvested)}
                  </Typography>
                </SummaryTableCell>
                <SummaryTableCell className="table-cell">
                  <Typography variant="body2">
                    {tableStats.debt.accruedToDate > 0
                      ? formatCurrency(
                          Math.round(tableStats.debt.accruedToDate)
                        )
                      : '-'}
                  </Typography>
                </SummaryTableCell>
                <SummaryTableCell className="table-cell">
                  <Typography variant="body2">
                    {tableStats.debt.earnedToDate > 0
                      ? formatCurrency(Math.round(tableStats.debt.earnedToDate))
                      : '$0'}
                  </Typography>
                </SummaryTableCell>
                <SummaryTableCell className="table-cell">
                  <Typography variant="body2">
                    {formatCurrency(
                      Math.round(tableStats.debt.earningsProjected)
                    )}
                  </Typography>
                </SummaryTableCell>
                <SummaryTableCell className="table-cell">
                  <Typography variant="body2">
                    {formatCurrency(
                      Math.round(tableStats.debt.projectedReturn)
                    )}
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
                <SummaryTableCell className="table-cell">
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
                <SummaryTableCell className="table-cell">
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
                <SummaryTableCell className="table-cell">
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
                <SummaryTableCell className="table-cell">
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
                <SummaryTableCell className="table-cell">
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
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default DashboardSummary;
