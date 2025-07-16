'use client';

import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import React, { useEffect, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useAdvisorClients } from '@/app/hooks/useAdvisorClients';
import { AdvisorClientsResponse } from '@/libs/types';
import { isEqual } from 'lodash';
import { DealFinancingType } from '@prisma/client';

export default function AdvisorClientsTable({
  loadRequest,
  router,
  getResults,
}: {
  router: AppRouterInstance;
  loadRequest?: boolean;
  getResults?: (data: AdvisorClientsResponse) => void;
}) {
  const { data, isLoading, isError } = useAdvisorClients(loadRequest ?? true);
  const lastDataRef = useRef<AdvisorClientsResponse | null>(null);

  useEffect(() => {
    if (!data || isLoading || isError || !getResults) return;

    if (!isEqual(data, lastDataRef.current)) {
      lastDataRef.current = data;
      getResults(data);
    }
  }, [data, isLoading, isError, getResults]);

  const handleClientClick =
    (clientId: number) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      router.push(`/advisor/clients/${clientId}`);
    };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: 'Name',
        id: 'name',
        accessorKey: 'client.name',
        enableGlobalFilter: true,
        maxSize: 120,
        grow: true,
        Cell: ({ row }: any) => {
          return (
            <a
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={handleClientClick(row.original.organization.id)}
              title="Go to client page"
            >
              {row.original.client.name}
            </a>
          );
        },
      },
      {
        header: 'Email',
        accessorKey: 'client.email',
        enableGlobalFilter: true,
        id: 'email',
        maxSize: 156,
        grow: true,
      },
      {
        header: 'Invested Amount',
        accessorKey: 'totalInvested',
        maxSize: 156,
        Cell: ({ cell }) =>
          cell.getValue()
            ? `$${Math.round(Number(cell.getValue())).toLocaleString()}`
            : '-',
      },
      {
        header: 'Types',
        accessorKey: 'dealTypes',
        id: 'dealTypes',
        enableGlobalFilter: true,
        maxSize: 156,
        Cell: ({ row }) => {
          const financingType: string = row.original.dealTypes;
          const financingTypes = financingType.split(' ');

          if (financingType === '') return '';

          const hasEquity = financingTypes.includes(DealFinancingType.equity);
          const hasDebt = financingTypes.some(
            dealType => dealType !== DealFinancingType.equity
          );

          const tags = [];
          if (hasEquity) {
            tags.push(
              <span
                key="equity"
                style={{
                  backgroundColor: '#2e7d32',
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                }}
              >
                EQUITY
              </span>
            );
          }

          if (hasDebt) {
            tags.push(
              <span
                key="debt"
                style={{
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                }}
              >
                DEBT
              </span>
            );
          }

          return <div style={{ display: 'flex', gap: '5px' }}>{tags}</div>;
        },
      },
      {
        header: 'Number of Investments',
        maxSize: 156,
        accessorKey: 'numberOfInvestments',
      },
      {
        header: 'Earnings to Date',
        maxSize: 156,
        grow: true,
        accessorKey: 'earningsToDate',
        Cell: ({ cell }) =>
          cell.getValue()
            ? `$${Math.round(Number(cell.getValue())).toLocaleString()}`
            : '-',
      },
      {
        header: 'Total Earnings Projected',
        maxSize: 156,
        grow: true,
        accessorKey: 'projectedEarnings',
        Cell: ({ cell }) =>
          cell.getValue()
            ? `$${Math.round(Number(cell.getValue())).toLocaleString()}`
            : '-',
      },
      {
        header: 'Total Projected Return',
        maxSize: 156,
        grow: true,
        accessorKey: 'totalProjectedReturn',
        Cell: ({ cell }) =>
          cell.getValue()
            ? `$${Math.round(Number(cell.getValue())).toLocaleString()}`
            : '-',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const tableData = useMemo(() => {
    return (
      data?.clients.map(row => ({
        ...row,
        dealTypes: row.dealTypes.join(' '), // transform for global filter
      })) ?? []
    );
  }, [data]);

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <MaterialReactTable
        columns={columns}
        data={tableData || []}
        enableGlobalFilter
        enablePagination
        manualPagination={false}
        manualFiltering={false}
        enableGrouping={false}
        enableColumnActions={false}
        enableFullScreenToggle={false}
        enableColumnResizing={false}
        enableDensityToggle={false}
        positionGlobalFilter="left"
        layoutMode="grid-no-grow"
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            border: '1px solid #e0e0e0',
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            fontSize: '0.75rem',
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            color: 'rgba(0, 0, 0, 0.87)',
            justifyContent: 'right',
            '&:nth-of-type(1)': {
              justifyContent: 'left',
            },
            '&:nth-of-type(2)': {
              justifyContent: 'left',
            },
          },
        }}
        muiSearchTextFieldProps={{
          placeholder: 'Search',
          style: {
            width: 471,
            height: 36,
            backgroundColor: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            paddingLeft: 1,
          },
          sx: {
            '&:hover': {
              borderColor: '#999',
            },
            '&.Mui-focused': {
              borderColor: '#1976d2',
            },
          },
          variant: 'outlined',
        }}
        muiTableHeadCellProps={{
          sx: {
            fontWeight: 'bold',
            fontSize: '0.75rem',
            padding: '8px 0px',
            color: 'rgba(0, 0, 0, 0.87)',
            '& .Mui-TableHeadCell-Content': {
              alignItems: 'baseline',
              justifyContent: 'space-evenly',
              '& .Mui-TableHeadCell-Content-Labels > .MuiBadge-root': {
                alignSelf: 'flex-start',
                paddingTop: '2px',
              },
            },
            '&:nth-of-type(3) .Mui-TableHeadCell-Content, \
              &:nth-of-type(5) .Mui-TableHeadCell-Content, \
              &:nth-of-type(6) .Mui-TableHeadCell-Content, \
              &:nth-of-type(7) .Mui-TableHeadCell-Content, \
              &:nth-of-type(8) .Mui-TableHeadCell-Content': {
              justifyContent: 'flex-end',
            },
          },
        }}
        muiTableBodyRowProps={{
          sx: {
            borderBottom: '1px solid #f0f0f0',
          },
        }}
        initialState={{
          pagination: {
            pageSize: 100,
            pageIndex: 0,
          },
        }}
        state={{
          isLoading,
          showAlertBanner: isError,
          showGlobalFilter: true,
        }}
        mrtTheme={() => ({
          baseBackgroundColor: '#ffffff',
        })}
        filterFns={{
          myCustomFilterFn: (row, columnId, filterValue) => {
            const value = row.getValue<any>(columnId);

            const filter = filterValue.toLowerCase();

            if (columnId === 'dealTypes') {
              const dealTypes = value.split(' ');
              if (filter === 'debt') {
                return dealTypes.some(
                  (dealType: DealFinancingType | string) =>
                    dealType !== '' && dealType !== DealFinancingType.equity
                );
              }

              return dealTypes.some((v: string) =>
                String(v).toLowerCase().includes(filter)
              );
            }

            return String(value).toLowerCase().includes(filter);
          },
        }}
        globalFilterFn="myCustomFilterFn"
      />
    </Box>
  );
}
