'use client';

import {
  MaterialReactTable,
  MRT_Cell,
  type MRT_ColumnDef,
} from 'material-react-table';
import { Box } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { OrganizationWithDealsAndStats } from '@/libs/types';
import { useAdvisorClientInvestments } from '@/app/hooks/useAdvisorClientInvestments';
import { DealFinancingType } from '@prisma/client';

type ColumnId =
  | 'dealId'
  | 'organizationName'
  | 'amount'
  | 'financingType'
  | 'closingDate';

type FileRow = Pick<OrganizationWithDealsAndStats, ColumnId>;

export default function AdvisorClientInvestmentsTable({
  loadRequest,
  hiddenColumns = [],
  clientId,
}: {
  loadRequest?: boolean;
  hiddenColumns?: ColumnId[];
  clientId?: number;
}) {
  const { data, isLoading, isError } = useAdvisorClientInvestments(
    loadRequest ?? true,
    clientId
  );

  const [deals, setDeals] = useState<OrganizationWithDealsAndStats[]>(
    data?.deals || []
  );

  const columns = useMemo<MRT_ColumnDef<FileRow>[]>(
    () =>
      [
        {
          header: 'ID',
          accessorKey: 'dealId',
          id: 'dealId',
        },
        {
          header: 'Entity',
          accessorKey: 'organizationName',
          id: 'organizationName',
        },
        {
          header: 'Amount',
          accessorKey: 'amount',
          id: 'amount',
          Cell: ({ cell }: { cell: MRT_Cell<FileRow> }) =>
            cell.getValue()
              ? `$${Number(cell.getValue()).toLocaleString()}`
              : '-',
        },
        {
          header: 'Type',
          accessorKey: 'financingType',
          id: 'financingType',
          Cell: ({ cell }: { cell: MRT_Cell<FileRow> }) => {
            const financingType = cell.getValue() as string;
            const isEquity = financingType === DealFinancingType.equity;
            const dealType = isEquity ? 'equity' : 'debt';
            const dealText = dealType.toUpperCase();
            const dealColor = isEquity ? '#2e7d32' : '#1976d2';
            return (
              <span
                key={dealType}
                style={{
                  backgroundColor: dealColor,
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                }}
              >
                {dealText}
              </span>
            );
          },
        },
        {
          header: 'Close Date',
          accessorKey: 'closingDate',
          id: 'closingDate',
          Cell: ({ cell }: { cell: MRT_Cell<FileRow> }) =>
            cell.getValue()
              ? new Date(cell.getValue() as string).toLocaleDateString('en-US')
              : '-',
        },
      ].filter(
        column =>
          typeof column.id === 'string' &&
          !hiddenColumns.includes(column.id as ColumnId)
      ),
    [hiddenColumns]
  );

  useEffect(() => {
    if (data?.deals.length) {
      setDeals(data.deals);
    }
  }, [data?.deals]);

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <MaterialReactTable
        columns={columns}
        data={deals ?? []}
        renderTopToolbar={false}
        manualFiltering={false}
        enableColumnFilters={false}
        enableHiding={false}
        enableKeyboardShortcuts={false}
        enableFilters={false}
        manualPagination={false}
        enableRowSelection={false}
        enableFacetedValues={false}
        enableBatchRowSelection={false}
        enableGrouping={false}
        enableColumnActions={false}
        enableFullScreenToggle={false}
        enableGlobalFilter={false}
        enableColumnResizing={false}
        enableDensityToggle={false}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            border: '1px solid #e0e0e0',
            overflowX: 'auto',
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            fontSize: '0.75rem',
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            color: 'rgba(0, 0, 0, 0.87)',
            justifyContent: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 160,
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            fontWeight: 'bold',
            fontSize: '0.75rem',
            padding: ' 0px',
            color: 'rgba(0, 0, 0, 0.87)',
            textAlign: 'left',
            '& .Mui-TableHeadCell-Content': {
              alignItems: 'baseline',
              paddingLeft: '16px',
              textAlign: 'left',
              '& .Mui-TableHeadCell-Content-Labels > .MuiBadge-root': {
                alignSelf: 'flex-start',
                paddingTop: '2px',
              },
            },
          },
        }}
        muiTableBodyRowProps={{
          sx: {
            borderBottom: '1px solid #f0f0f0',
          },
        }}
        muiTableProps={{
          sx: {
            caption: {
              captionSide: 'top',
            },
          },
        }}
        state={{
          isLoading,
          showAlertBanner: isError,
        }}
        mrtTheme={() => ({
          baseBackgroundColor: '#ffffff',
        })}
      />
    </Box>
  );
}
