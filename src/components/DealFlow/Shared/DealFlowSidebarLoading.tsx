import React from 'react';
import {
  Box,
  CardContent,
  Skeleton,
  Typography,
  Divider,
  Stack,
} from '@mui/material';

/**
 * DealFlowSidebarLoading component
 *
 * A skeleton loading state for investment deal flow sidebar
 * Shows loading state for investment details, contact info, and type
 */
const DealFlowSidebarLoading = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', p: 2 }}>
        <Skeleton
          variant="rectangular"
          width={80}
          height={80}
          sx={{ borderRadius: 1 }}
        />
        <Box sx={{ ml: 2, width: '100%' }}>
          <Skeleton variant="text" width="70%" height={36} />
          <Skeleton variant="text" width="40%" height={24} />
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Skeleton
              variant="rectangular"
              width={70}
              height={32}
              sx={{ borderRadius: 16 }}
            />
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Details section */}
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          <Skeleton variant="text" width={100} />
        </Typography>

        <Stack spacing={1.5}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="50%" height={24} />
          <Skeleton variant="text" width="70%" height={24} />
        </Stack>
      </CardContent>

      <Divider />

      {/* Investment type section */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={100} height={24} sx={{ ml: 2 }} />
      </Box>
    </Box>
  );
};

export default DealFlowSidebarLoading;
