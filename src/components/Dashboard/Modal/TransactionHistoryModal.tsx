import * as React from 'react';
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { InfoOutlined } from '@mui/icons-material';
import {
  BillPayment,
  DealStatsPosition,
  FinanceBreakdown,
  RampBillStatus,
} from '@/libs/transactions/schema';
import { FinanceTypeChip, formatCurrency } from '../DashboardComponents';

export interface TransactionHistoryModalProps {
  open: boolean;
  onClose: () => void;
  project: { id: number; name: string };
  financingType: 'equity' | 'debt';
  data: FinanceBreakdown;
}

// ---------- Helpers ----------
const usd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    n
  );

const mdY = (iso: Date | string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    : '';

function StatusChip({ status }: { status: RampBillStatus }) {
  const color = ['APPROVED', 'PAID'].includes(status) ? 'success' : 'warning';
  return (
    <Chip
      label={status}
      size="small"
      color={color as any}
      variant="filled"
      sx={{
        fontWeight: 600,
        color: 'white',
        borderRadius: '4px',
        height: '18px',
        padding: '0 2px',
        fontSize: '10px',
      }}
    />
  );
}

const TransactionHistoryTable = ({
  payments,
  financingType,
}: {
  payments: BillPayment[];
  financingType: 'equity' | 'debt';
}) => {
  if (financingType === 'equity') {
    return (
      <Alert
        severity="info"
        sx={{
          backgroundColor: 'rgba(250, 250, 250, 1)',
          color: 'rgba(158, 158, 158, 1)',
        }}
        icon={
          <InfoOutlined
            fontSize="inherit"
            sx={{ color: 'rgba(158, 158, 158, 1)', marginTop: '5px' }}
          />
        }
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
          color="rgba(0, 0, 0, 0.87)"
        >
          Why No Distributions Yet?
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 1, fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}
        >
          {
            'Most equity investments don’t generate distributions in the early years. This is typical, as your capital is supporting the project’s growth and long-term value. Distributions usually begin once the property is fully operational and generating steady income. Questions? We’re here to help.'
          }
        </Typography>
      </Alert>
    );
  }

  if (!payments.length) {
    return (
      <Alert
        severity="info"
        sx={{
          backgroundColor: 'rgba(250, 250, 250, 1)',
          color: 'rgba(0, 0, 0, 0.87)',
        }}
        icon={
          <InfoOutlined
            fontSize="inherit"
            sx={{ color: 'rgba(158, 158, 158, 1)' }}
          />
        }
      >
        <Typography variant="body1" sx={{ mb: 1, fontSize: '14px' }}>
          No payments have been processed to date.
        </Typography>
      </Alert>
    );
  }
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="transactions table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="caption" fontWeight={700}>
                Date
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="caption" fontWeight={700}>
                Amount
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="caption" fontWeight={700}>
                Status
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="caption" fontWeight={700}>
                Payment Method
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="caption" fontWeight={700}>
                Memo
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((t, idx) => (
            <TableRow key={idx} hover>
              <TableCell>{mdY(t.paymentDate)}</TableCell>
              <TableCell>{usd(t.amount)}</TableCell>
              <TableCell>
                <StatusChip status={t.status} />
              </TableCell>
              <TableCell>{t.paymentMethod}</TableCell>
              <TableCell>{t.memo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PositionsTable = ({
  positions,
  financingType,
}: {
  positions: DealStatsPosition[];
  financingType: 'debt' | 'equity';
}) => {
  if (!positions.length) {
    return (
      <Alert severity="info">
        You dont have any investment on this project.
      </Alert>
    );
  }
  const returnRateColumnName =
    financingType === 'debt' ? 'Interest Rate' : 'Preferred Return Rate';

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
      <Table size="small" aria-label="positions table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 120 }}></TableCell>
            <TableCell>
              <Typography variant="caption" fontWeight={700}>
                Closing Date
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="caption" fontWeight={700}>
                Principal Invested
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="caption" fontWeight={700}>
                {returnRateColumnName}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.map(position => (
            <TableRow key={position.dealId} hover>
              <TableCell>
                <Chip
                  label={`ID: ${position.dealId}`}
                  size="small"
                  variant="filled"
                />
              </TableCell>
              <TableCell>{mdY(position.closingDate)}</TableCell>
              <TableCell>{formatCurrency(position.committedAmount)}</TableCell>
              <TableCell>
                {position.debtInterestRatePercentage ||
                  position.equityAccruedPreferredReturnPercentage}
                %
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default function TransactionHistoryModal({
  open,
  onClose,
  data,
  project,
  financingType,
}: TransactionHistoryModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5" fontWeight={700}>
            {project.name}
          </Typography>
          <FinanceTypeChip
            label={financingType.toUpperCase()}
            financetype={financingType}
            size="small"
          />
        </Stack>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Positions */}
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          Positions
        </Typography>
        <PositionsTable
          positions={data.positions}
          financingType={financingType}
        />

        {/* Transaction History */}
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          Transaction History
        </Typography>
        <TransactionHistoryTable
          payments={data.payments}
          financingType={financingType}
        />
      </DialogContent>
    </Dialog>
  );
}
