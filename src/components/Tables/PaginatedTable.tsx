'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Box,
  Typography,
  styled,
} from '@mui/material';

interface PaginatedTableProps<T> {
  data: T[];
  total: number;
  page: number;
  rowsPerPage: number;
  isLoading: boolean;
  isError: boolean;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  headers: string[];
  renderRow: (item: T) => React.ReactNode;
}

const StyledTableCell = styled(TableCell)(() => ({
  fontWeight: 'bold',
}));

export function PaginatedTable<T>({
  data,
  total,
  page,
  rowsPerPage,
  isLoading,
  isError,
  onPageChange,
  onRowsPerPageChange,
  headers,
  renderRow,
}: PaginatedTableProps<T>) {
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box textAlign="center" p={4}>
        <Typography color="error">Error loading data.</Typography>
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Box textAlign="center" p={4}>
        <Typography>No results found.</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'white' }}>
              {headers.map((header, idx) => (
                <StyledTableCell key={idx}>{header}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={idx}>{renderRow(item)}</TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e =>
          onRowsPerPageChange(parseInt(e.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Paper>
  );
}
