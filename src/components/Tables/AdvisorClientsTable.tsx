'use client';

import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from 'material-react-table';
import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Search from '@mui/icons-material/Search';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue';
import { useAdvisorClients } from '@/app/hooks/useAdvisorClients';

export default function AdvisorClientsTable({
  loadRequest,
  router,
}: {
  loadRequest?: boolean;
  router: AppRouterInstance;
}) {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 300,
  });

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, isError } = useAdvisorClients(
    loadRequest ?? true,
    pagination.pageIndex + 1,
    pagination.pageSize,
    debouncedSearch
  );

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
        Cell: ({ row }: any) => {
          console.log(row);
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
        accessorFn: row => row.client.email,
        id: 'email',
      },
      {
        header: 'Invested Amount',
        accessorKey: 'totalInvested',
        Cell: ({ cell }) =>
          cell.getValue()
            ? `$${Number(cell.getValue()).toLocaleString()}`
            : '-',
      },
      {
        header: 'Types',
        accessorKey: 'dealTypes',
        Cell: ({ cell }) => {
          const dealTypes = cell.getValue() as string[];
          const hasDebtDeals = dealTypes.some(type => type === 'debt');
          const hasEquityDeals = dealTypes.some(type => type !== 'debt');
          return (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {hasDebtDeals && (
                <span
                  key={'debt'}
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
              )}
              {hasEquityDeals && (
                <span
                  key={'equity'}
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
              )}
            </div>
          );
        },
      },
      {
        header: 'Number of Investments',
        accessorKey: 'numberOfInvestments',
      },
      {
        header: 'Earnings to Date',
        accessorKey: 'earningsToDate',
        Cell: ({ cell }) =>
          cell.getValue()
            ? `$${Number(cell.getValue()).toLocaleString()}`
            : '-',
      },
      {
        header: 'Total Earnings Projected',
        accessorKey: 'projectedEarnings',
        Cell: ({ cell }) =>
          cell.getValue()
            ? `$${Number(cell.getValue()).toLocaleString()}`
            : '-',
      },
      {
        header: 'Total Projected Return',
        accessorKey: 'totalProjectedReturn',
        Cell: ({ cell }) =>
          cell.getValue()
            ? `$${Number(cell.getValue()).toLocaleString()}`
            : '-',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <MaterialReactTable
        columns={columns}
        data={data?.clients ?? []}
        manualPagination
        enableGrouping={false}
        enableColumnActions={false}
        manualFiltering={false}
        enableFullScreenToggle={false}
        enableGlobalFilter={false}
        enableColumnResizing={false}
        enableDensityToggle={false}
        enableFilters={false}
        positionGlobalFilter="right"
        onPaginationChange={setPagination}
        onGlobalFilterChange={setSearch}
        rowCount={data?.pagination.total ?? 0}
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
        renderTopToolbarCustomActions={() => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '100%',
              p: 1,
            }}
          >
            <Input
              value={search}
              onChange={onSearch}
              placeholder="Search"
              size="small"
              disableUnderline
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
              sx={{
                width: 471,
                height: 36,
                backgroundColor: 'white',
                borderRadius: '8px',
                fontSize: '14px',
                paddingLeft: 1,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                '&:hover': {
                  borderColor: '#999',
                },
                '&.Mui-focused': {
                  borderColor: '#1976d2',
                },
              }}
            />
          </Box>
        )}
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
          },
        }}
        muiTableBodyRowProps={{
          sx: {
            borderBottom: '1px solid #f0f0f0',
          },
        }}
        state={{
          isLoading,
          pagination,
          showAlertBanner: isError,
        }}
        mrtTheme={() => ({
          baseBackgroundColor: '#ffffff',
        })}
      />
    </Box>
  );
}
