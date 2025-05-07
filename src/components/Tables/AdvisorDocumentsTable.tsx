'use client';

import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from 'material-react-table';
import { Box, Input, InputAdornment, Button } from '@mui/material';
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue';
import { useState, useMemo } from 'react';
import { useAdvisorDocuments } from '@/app/hooks/useAdvisorDocuments';
import { Search } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';

export default function AdvisorDocumentsTable({
  loadRequest,
}: {
  loadRequest?: boolean;
}) {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, isError } = useAdvisorDocuments(
    loadRequest ?? true,
    debouncedSearch
  );

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Type',
        accessorKey: 'type',
      },
      {
        header: 'Client',
        accessorKey: 'clientName',
      },
      {
        header: 'Date Added',
        accessorKey: 'dateCreated',
        Cell: ({ cell }) =>
          cell.getValue()
            ? new Date(cell.getValue() as string).toLocaleDateString('en-US')
            : '-',
      },
      {
        header: '',
        id: 'download',
        Cell: ({ row }) => (
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            sx={{
              opacity: '0.7',
            }}
            startIcon={<DownloadIcon />}
            href={row.original.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </Button>
        ),
      },
    ],
    []
  );

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <MaterialReactTable
        columns={columns}
        data={data?.documents ?? []}
        manualPagination
        manualFiltering
        enableFullScreenToggle={false}
        enableGlobalFilter={false}
        enableRowSelection
        enableGrouping
        enableFacetedValues
        enableBatchRowSelection
        positionGlobalFilter="right"
        onPaginationChange={setPagination}
        onGlobalFilterChange={setSearch}
        enableColumnResizing={false}
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
            justifyContent: 'left',
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
        state={{
          isLoading,
          pagination,
          showAlertBanner: isError,
        }}
        mrtTheme={() => ({
          baseBackgroundColor: '#ffffff',
        })}
        initialState={{
          columnPinning: {
            left: ['mrt-row-expand', 'mrt-row-select'],
            right: ['mrt-row-actions'],
          },
        }}
        renderTopToolbar={({ table }) => {
          const handleDownload = () => {
            table.getSelectedRowModel().flatRows.map(row => {
              alert('deactivating ' + row.getValue('name'));
            });
          };

          return (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center', // optional, centers vertically
                p: 1,
                width: '100%',
              }}
            >
              <Box sx={{ p: 1 }}>
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
              <Box sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    disabled={
                      !table.getIsAllRowsSelected() &&
                      !table.getIsSomeRowsSelected()
                    }
                    onClick={handleDownload}
                    variant="outlined"
                    size="small"
                    sx={{
                      height: '36px',
                    }}
                    startIcon={<DownloadIcon />}
                  >
                    Download Selected ({table.getSelectedRowModel().rows.length}
                    )
                  </Button>
                </Box>
              </Box>
            </Box>
          );
        }}
      />
    </Box>
  );
}
