import { PaginatedTable } from '@/components/Tables/PaginatedTable';
import { useAdvisorClients } from '@/app/hooks/useAdvisorClients';
import { useState } from 'react';
import { Chip, Box, Typography, TableCell } from '@mui/material';

export interface IAdvisorClientsTable {
  loadRequest?: boolean;
}

export default function AdvisorClientsTable({
  loadRequest,
}: IAdvisorClientsTable) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const { data, isLoading, isError } = useAdvisorClients(
    loadRequest,
    page + 1,
    rowsPerPage
  );

  const headers = [
    'Name',
    'Email',
    'Invested Amount',
    'Types',
    'Number of Investments',
    'Earnings to Date',
    'Total Earnings Projected',
    'Total Projected Return',
  ];

  return (
    <PaginatedTable
      data={data?.clients || []}
      total={data?.pagination.total || 0}
      page={page}
      rowsPerPage={rowsPerPage}
      isLoading={isLoading}
      isError={isError}
      onPageChange={setPage}
      onRowsPerPageChange={setRowsPerPage}
      headers={headers}
      renderRow={client => (
        <>
          <TableCell>
            <Typography fontWeight="bold">{client.client.name}</Typography>
          </TableCell>
          <TableCell>{client.client.email}</TableCell>
          <TableCell>
            {client.totalInvested
              ? `$${client.totalInvested.toLocaleString()}`
              : '-'}
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {client.dealTypes.map((type: string) => (
                <Chip
                  key={type}
                  label={type.toUpperCase()}
                  size="small"
                  color={type === 'debt' ? 'primary' : 'success'}
                />
              ))}
            </Box>
          </TableCell>
          <TableCell>
            {client.numberOfInvestments > 0 ? client.numberOfInvestments : '-'}
          </TableCell>
          <TableCell>
            {client.earningsToDate
              ? `$${client.earningsToDate.toLocaleString()}`
              : '-'}
          </TableCell>
          <TableCell>
            {client.projectedEarnings
              ? `$${client.projectedEarnings.toLocaleString()}`
              : '-'}
          </TableCell>
          <TableCell>
            {client.totalProjectedReturn
              ? `$${client.totalProjectedReturn.toLocaleString()}`
              : '-'}
          </TableCell>
        </>
      )}
    />
  );
}
