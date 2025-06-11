'use client';

import { useState, useEffect } from 'react';
import Search from '@mui/icons-material/Search';
import { MaterialReactTable, MRT_Cell } from 'material-react-table';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Input,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { AdvisorEmployeeRole, User } from '@prisma/client';
import { Add, DeleteOutline } from '@mui/icons-material';

import { AdvisorEmployeeAndUser } from '@/libs/types';
import { useAdvisorEmployees } from '@/app/hooks/useAdvisorEmployees';
import Modal from '../Shared/Modal';
import InviteMemberForm, { InviteFormValues } from '../Advisor/InviteMember';

const ROLE_TO_TEXT = {
  [AdvisorEmployeeRole.ADMIN]: 'Admin',
  [AdvisorEmployeeRole.STAFF]: 'Staff',
};

export default function AdvisorEmployeesTable({
  loadRequest,
}: {
  loadRequest?: boolean;
}) {
  const { data, isLoading, isError } = useAdvisorEmployees(loadRequest);
  const [isLoadingMemberAction, setIsLoadingMemberAction] =
    useState<boolean>(false);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const [employees, setEmployees] = useState<AdvisorEmployeeAndUser[]>(
    data || []
  );
  const [openModal, setOpenModal] = useState(false);
  const toggleModal = (isOpen: boolean) => () => setOpenModal(isOpen);

  const handleDeleteMember = (employeeId: number) => () => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      onRemoveMember(employeeId);
    }
  };

  const columns = [
    {
      header: 'Name',
      accessorKey: 'user',
      id: 'user',
      maxSize: 209,
      Cell: ({ cell }: { cell: MRT_Cell<AdvisorEmployeeAndUser> }) => {
        const user = cell.getValue() as User;
        return [user.firstName, user.lastName].join(' ');
      },
    },
    {
      header: 'Email',
      accessorKey: 'user.email',
      id: 'user.email',
      maxSize: 250,
    },
    {
      header: 'Role',
      accessorKey: 'role',
      id: 'role',
      maxSize: 90,
      Cell: ({ cell }: { cell: MRT_Cell<AdvisorEmployeeAndUser> }) => {
        const role = cell.getValue() as AdvisorEmployeeRole;
        return (
          <Chip
            key={`role-${cell.row.original.id}`}
            color="default"
            size="small"
            variant="filled"
            label={ROLE_TO_TEXT[role]}
          />
        );
      },
    },
    {
      header: 'Date Added',
      accessorKey: 'user.dateCreated',
      maxSize: 90,
      id: 'dateCreated',
      Cell: ({ cell }: { cell: MRT_Cell<AdvisorEmployeeAndUser> }) =>
        cell.getValue()
          ? new Date(cell.getValue() as string).toLocaleDateString('en-US')
          : '-',
    },
    {
      header: '',
      id: 'remove',
      size: 68,
      Cell: ({ cell }: { cell: MRT_Cell<AdvisorEmployeeAndUser> }) => (
        <Tooltip title={'Remove member'}>
          <IconButton
            color="inherit"
            sx={{
              height: '30px',
              width: '36px',
              opacity: '0.7',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: 0,
              float: 'right',
            }}
            onClick={handleDeleteMember(cell.row.original.id)}
          >
            <DeleteOutline sx={{ width: 1 }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    if (data?.length) {
      setEmployees(data);
    }
  }, [data]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const onInviteMember = async (data: InviteFormValues) => {
    setIsLoadingMemberAction(true);
    try {
      const { role, ...user } = data;
      const payload = {
        user,
        role,
      };
      const response = await axios.post('/api/advisors/employees', payload);
      if (response.status === 201) {
        toast.success(`Invited new member ${data.firstName} ${data.lastName}`);
        queryClient.invalidateQueries({ queryKey: ['advisor', 'employees'] }); // refetch members
        toggleModal(false)(); // close modal
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to invite member');
    } finally {
      setIsLoadingMemberAction(false);
    }
  };

  const onRemoveMember = async (employeeId: number) => {
    setIsLoadingMemberAction(true);
    try {
      const response = await axios.delete(
        `/api/advisors/employees/${employeeId}`
      );
      if (response.status === 200) {
        toast.success(`Removed team member`);
        queryClient.invalidateQueries({ queryKey: ['advisor', 'employees'] });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to remove member');
    } finally {
      setIsLoadingMemberAction(false);
    }
  };

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
          isLoading: isLoading || isLoadingMemberAction,
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
        renderTopToolbar={() => {
          return (
            <Grid
              container
              spacing={2}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
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
                  onClick={toggleModal(true)}
                >
                  Invite User
                </Button>
              </Grid>
            </Grid>
          );
        }}
      />
      <Modal
        open={openModal}
        onClose={toggleModal(false)}
        title={'Invite Team Member'}
        aria-labelledby="Invite Employee Modal"
        aria-describedby="This Modal opens a form to add a employee to the firm"
      >
        <InviteMemberForm
          onCancel={toggleModal(false)}
          onInvite={onInviteMember}
        />
      </Modal>
    </Box>
  );
}
