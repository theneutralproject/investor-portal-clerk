'use client';

import { useState, useEffect } from 'react';
import { User } from '@sentry/nextjs';
import Search from '@mui/icons-material/Search';
import { MaterialReactTable, MRT_Cell } from 'material-react-table';
import { Box, Button, Chip, Input, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AdvisorEmployeeAndUser } from '@/libs/types';
import { useAdvisorEmployees } from '@/app/hooks/useAdvisorEmployees';
import { Add } from '@mui/icons-material';

export default function AdvisorEmployeesTable({
  loadRequest,
}: {
  loadRequest?: boolean;
}) {
  const { data, isLoading, isError } = useAdvisorEmployees(loadRequest);
  const [search, setSearch] = useState('');

  const [employees, setEmployees] = useState<AdvisorEmployeeAndUser[]>(
    data || []
  );

  const columns = [
    {
      header: 'Name',
      accessorKey: 'user',
      id: 'user',
      Cell: ({ cell }: { cell: MRT_Cell<AdvisorEmployeeAndUser> }) => {
        const user = cell.getValue() as User;
        return [user.firstName, user.lastName].join(' ');
      },
    },
    {
      header: 'Email',
      accessorKey: 'user.email',
      id: 'user.email',
    },
    {
      header: 'Role',
      accessorKey: 'role',
      id: 'role',
      Cell: ({ cell }: { cell: MRT_Cell<AdvisorEmployeeAndUser> }) => {
        const role = cell.getValue() as string;
        return (
          <Chip
            key={role}
            color="default"
            size="small"
            variant="filled"
            label={role}
          />
        );
      },
    },
    {
      header: 'Date Added',
      accessorKey: 'dateAdded',
      id: 'dateCreated',
      Cell: ({ cell }: { cell: MRT_Cell<AdvisorEmployeeAndUser> }) =>
        cell.getValue()
          ? new Date(cell.getValue() as string).toLocaleDateString('en-US')
          : '-',
    },
  ];

  useEffect(() => {
    if (data?.length) {
      setEmployees(data);
    }
  }, [data]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <MaterialReactTable
        columns={columns}
        data={
          employees?.filter(emp => {
            const fullName = [emp.user.firstName, emp.user.lastName]
              .join(' ')
              .toLowerCase();
            return (
              fullName.includes(search.toLowerCase()) ||
              emp.user.email.toLowerCase().includes(search.toLowerCase()) ||
              emp.role.toLowerCase().includes(search.toLowerCase())
            );
          }) ?? []
        }
        enableFacetedValues
        enableColumnFilterModes
        enableColumnActions={false}
        manualFiltering
        enableFullScreenToggle={false}
        enableGlobalFilter
        enableColumnResizing={false}
        enableDensityToggle={false}
        positionGlobalFilter="right"
        onGlobalFilterChange={setSearch}
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
          showGlobalFilter: true,
          globalFilter: search,
        }}
        mrtTheme={() => ({
          baseBackgroundColor: '#ffffff',
        })}
        muiSearchTextFieldProps={{
          size: 'small',
          variant: 'outlined',
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
        renderTopToolbar={() => {
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
              <Grid
                size={{
                  xs: 6,
                  md: 6,
                }}
              >
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
              </Grid>
              <Grid
                size={{
                  xs: 6,
                  md: 6,
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: '100%',
                  p: 1,
                }}
              >
                <Button
                  variant="outlined"
                  size="medium"
                  endIcon={<Add />}
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.87)',
                    textTransform: 'none',
                  }}
                >
                  Invite User
                </Button>
              </Grid>
            </Grid>
          );
        }}
      />
    </Box>
  );
}
