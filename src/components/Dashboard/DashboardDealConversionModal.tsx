import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  styled,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import _ from 'lodash';
import { DealWithInvestmentStats } from '@/libs/types';
import { PortfolioReturnsResponse } from '@/libs/returns/schema';
import { DealStatus } from '@prisma/client';

interface DealConversion {
  id: number;
  startDealId: number;
  endDealId: number;
  dateCreated: string;
  dateUpdated: string | null;
  startDeal: DealWithInvestmentStats;
  endDeal: DealWithInvestmentStats;
}

interface DealRow {
  id: number;
  status: string;
  type: string;
  effectiveDate: string;
  endDate: string;
  investmentPrincipal: number;
  distributions: number | null;
  accruedInterest: number | null;
}

interface DashboardDealConversionModalProps {
  conversionId: number | null;
  open: boolean;
  onClose: () => void;
}

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  borderRadius: 8,
  maxHeight: '90vh',
  overflow: 'auto',
}));

const StyledTableCell = styled(TableCell)(() => ({
  fontWeight: 'medium',
}));

const StatusIndicator = styled('span')<{ status: DealStatus }>(
  ({ theme, status }) => ({
    display: 'inline-block',
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: theme.spacing(1),
    backgroundColor:
      status === DealStatus.ACTIVE
        ? theme.palette.success.main
        : theme.palette.grey[400],
  })
);

// Helper function to map financing type to display type
const getDisplayType = (financingType: string): string => {
  const typeMap: { [key: string]: string } = {
    equity: 'Equity',
    promissory_note_now: 'Debt',
    promissory_note: 'Debt',
    debt: 'Debt',
  };

  return typeMap[financingType] || 'Unknown';
};

export const DashboardDealConversionModal: React.FC<
  DashboardDealConversionModalProps
> = ({ conversionId, open, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [conversion, setConversion] = useState<DealConversion | null>(null);
  const [conversionReturns, setConversionReturns] =
    useState<PortfolioReturnsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dealRows, setDealRows] = useState<DealRow[]>([]);

  useEffect(() => {
    if (open && conversionId) {
      fetchConversion(conversionId);
    } else {
      setConversion(null);
      setError(null);
    }
  }, [open, conversionId]);

  useEffect(() => {
    if (conversion) {
      const rows: DealRow[] = [];

      rows.push({
        id: conversion.endDeal.id,
        status: conversion.endDeal.status ?? '',
        type: getDisplayType(conversion.endDeal.investmentStats.financingType),
        effectiveDate: formatDate(conversion.endDeal.closingDate),
        endDate: formatDate(conversion.endDeal.dateMatured),
        investmentPrincipal: conversion.endDeal.investmentStats.amount,
        distributions:
          conversionReturns?.dealStats.find(
            deal => deal.dealId === conversion.endDeal.id
          )?.distributionsToDate ?? null,
        accruedInterest: -1,
      });

      rows.push({
        id: conversion.startDeal.id,
        status: conversion.startDeal.status ?? '',
        type: getDisplayType(
          conversion.startDeal.investmentStats.financingType
        ),
        effectiveDate: formatDate(conversion.startDeal.closingDate),
        endDate: formatDate(conversion.startDeal.dateMatured),
        investmentPrincipal: conversion.startDeal.investmentStats.amount,
        distributions:
          conversionReturns?.dealStats.find(
            deal => deal.dealId === conversion.startDeal.id
          )?.distributionsToDate ?? null,
        accruedInterest: -1,
      });

      // Sort rows by effective date
      rows.sort((a, b) => {
        if (b.effectiveDate === '-') {
          return -1;
        }
        if (a.effectiveDate === '-') {
          return 1;
        }
        return a.effectiveDate <= b.effectiveDate ? -1 : 1;
      });
      setDealRows(rows);
    }
  }, [conversion, conversionReturns]);

  const fetchConversion = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/deals/conversions/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch conversion: ${response.statusText}`);
      }
      const data = await response.json();
      setConversion(data.conversion);
      setConversionReturns(data.conversionReturns);
      setError(null);
    } catch (err) {
      console.error('Error fetching conversion:', err);
      setError('Failed to load conversion details');
      setConversion(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: Date | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'MM/dd/yy');
    } catch (err) {
      console.error('Error formatting date:', err);
      return '-';
    }
  };

  const formatStatus = (status: DealStatus) => {
    switch (status) {
      case DealStatus.ACTIVE:
        return 'Active';
      case DealStatus.PENDING:
        return 'Pending';
      case DealStatus.MATURED:
        return 'Matured';
      case DealStatus.LOST:
        return 'Lost';
      default:
        return 'Unknown';
    }
  };
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return `$${amount.toLocaleString()}`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="conversion-modal-title"
      aria-describedby="conversion-modal-description"
    >
      <ModalContent>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : conversion ? (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                id="conversion-modal-title"
              >
                {conversion.endDeal.investmentEntity} - Deal History
              </Typography>
              <IconButton onClick={onClose} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              TransactionID: {conversion.endDeal.transactionId}
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Effective Date</StyledTableCell>
                    <StyledTableCell>End Date</StyledTableCell>
                    <StyledTableCell>Investment Principal</StyledTableCell>
                    <StyledTableCell>Distributions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dealRows.map(row => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StatusIndicator status={row.status as DealStatus} />
                          <Typography>
                            {formatStatus(row.status as DealStatus)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.effectiveDate}</TableCell>
                      <TableCell>{row.endDate}</TableCell>
                      <TableCell>
                        {formatCurrency(row.investmentPrincipal)}
                      </TableCell>
                      <TableCell>
                        {row.distributions !== null
                          ? formatCurrency(row.distributions)
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography>No conversion data available</Typography>
          </Box>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DashboardDealConversionModal;
