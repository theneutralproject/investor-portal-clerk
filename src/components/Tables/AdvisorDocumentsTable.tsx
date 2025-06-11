'use client';

import {
  MaterialReactTable,
  MRT_Cell,
  MRT_Row,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from 'material-react-table';
import { Box, Input, InputAdornment, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue';
import { useState, useMemo, useEffect } from 'react';
import { useAdvisorDocuments } from '@/app/hooks/useAdvisorDocuments';
import DownloadIcon from '@mui/icons-material/Download';
import Search from '@mui/icons-material/Search';
import { AdvisorDocument } from '@/libs/types';
import FilterMenu from '../Shared/FilterMenu';
import { Close } from '@mui/icons-material';

type FileRow = {
  name: string;
  type: string;
  clientName: string;
  dateCreated: string;
  downloadUrl: string;
};

type FilterType = 'type' | 'client';
type ColumnId = 'name' | 'type' | 'clientName' | 'dateCreated' | 'download';

export default function AdvisorDocumentsTable({
  loadRequest,
  hiddenColumns = [],
  hiddenFilters = [],
  clientId,
}: {
  loadRequest?: boolean;
  hiddenColumns?: ColumnId[];
  hiddenFilters?: FilterType[];
  clientId?: number;
}) {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, isError } = useAdvisorDocuments(
    loadRequest ?? true,
    clientId,
    debouncedSearch
  );

  const [clientFilter, setClientFilter] = useState<string>();
  const [typeFilter, setTypeFilter] = useState<string>();
  const [documents, setDocuments] = useState<AdvisorDocument[]>(
    data?.documents || []
  );

  const columns = useMemo<MRT_ColumnDef<FileRow>[]>(
    () =>
      [
        {
          header: 'Name',
          accessorKey: 'name',
          id: 'name',
        },
        {
          header: 'Type',
          accessorKey: 'type',
          id: 'type',
        },
        {
          header: 'Client',
          accessorKey: 'clientName',
          id: 'clientName',
        },
        {
          header: 'Date Added',
          accessorKey: 'dateCreated',
          id: 'dateCreated',
          Cell: ({ cell }: { cell: MRT_Cell<FileRow> }) =>
            cell.getValue()
              ? new Date(cell.getValue() as string).toLocaleDateString('en-US')
              : '-',
        },
        {
          header: '',
          id: 'download',
          Cell: ({ row }: { row: MRT_Row<FileRow> }) => (
            <a
              href={row.original.downloadUrl}
              download
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              <Button
                variant="outlined"
                size="small"
                color="inherit"
                sx={{ opacity: '0.7' }}
                startIcon={<DownloadIcon />}
              >
                Download
              </Button>
            </a>
          ),
        },
      ].filter(
        column =>
          typeof column.id === 'string' &&
          !hiddenColumns.includes(column.id as ColumnId)
      ),
    [hiddenColumns]
  );

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const handleClearFilters = () => {
    setClientFilter('');
    setTypeFilter('');
  };

  useEffect(() => {
    if (data?.documents.length) {
      setDocuments(data.documents);
    }
  }, [data?.documents]);

  useEffect(() => {
    if (!data?.documents.length) {
      return;
    }
    let tempDocuments = data?.documents || [];
    if (clientFilter) {
      tempDocuments = tempDocuments?.filter(
        doc => doc.clientName === clientFilter
      );
    }
    if (typeFilter) {
      tempDocuments = tempDocuments?.filter(doc => doc.type === typeFilter);
    }
    setDocuments(tempDocuments);
  }, [clientFilter, data?.documents, typeFilter]);

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <MaterialReactTable
        columns={columns}
        data={documents ?? []}
        manualPagination
        enableRowSelection
        enableFacetedValues
        enableBatchRowSelection
        enableGrouping={false}
        enableColumnActions={false}
        manualFiltering={false}
        enableFullScreenToggle={false}
        enableGlobalFilter={false}
        enableColumnResizing={false}
        enableDensityToggle={false}
        positionGlobalFilter="right"
        onPaginationChange={setPagination}
        onGlobalFilterChange={setSearch}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            border: '1px solid #e0e0e0',
            overflowX: 'auto', // ensures table can scroll horizontally if needed
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
        renderTopToolbar={({ table }) => {
          const handleDownload = () => {
            const selectedRows = table.getSelectedRowModel().flatRows;

            selectedRows.forEach(row => {
              const url = row.original.downloadUrl;
              const name = row.original.name;

              const link = document.createElement('a');
              link.href = url;
              link.download = name; // use file name if desired
              link.target = '_blank';
              link.rel = 'noopener noreferrer';

              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });
          };

          return (
            <Grid
              container
              spacing={2}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center', // optional, centers vertically
                p: 1,
                width: '100%',
              }}
            >
              <Grid sx={{ p: 1 }}>
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
                    width: '100%',
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
              </Grid>
              <Grid sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                  {!hiddenFilters.includes('client') && (
                    <FilterMenu
                      name={'Client'}
                      items={data?.clients || []}
                      onFilterChange={setClientFilter}
                      selectedItem={clientFilter}
                    />
                  )}
                  {!hiddenFilters.includes('type') && (
                    <FilterMenu
                      name={'Type'}
                      items={data?.types || []}
                      onFilterChange={setTypeFilter}
                      selectedItem={typeFilter}
                    />
                  )}
                  {(typeFilter || clientFilter) && (
                    <Button
                      onClick={handleClearFilters}
                      variant="outlined"
                      size="small"
                      sx={{
                        height: '36px',
                        border: 'none',
                        color: 'rgba(25, 118, 210, 1)',
                      }}
                      endIcon={<Close />}
                    >
                      Clear Filters
                    </Button>
                  )}
                  {(table.getIsAllRowsSelected() ||
                    table.getIsSomeRowsSelected()) && (
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
                      Download Selected (
                      {table.getSelectedRowModel().rows.length})
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          );
        }}
      />
    </Box>
  );
}
