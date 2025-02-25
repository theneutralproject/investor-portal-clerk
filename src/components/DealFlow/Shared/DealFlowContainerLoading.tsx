import React from 'react';
import { Box, Skeleton, Divider } from '@mui/material';

const DealFlowContainerLoading = () => {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Header and Learn More button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Skeleton variant="text" width={300} height={50} />
        <Skeleton variant="rounded" width={150} height={40} />
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Generic Content Area */}
      <Box sx={{ mb: 5 }}>
        {/* Content Blocks */}
        {[1, 2].map((_, index) => (
          <Box
            key={index}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 3,
              mb: 3,
            }}
          >
            <Skeleton variant="rectangular" width="100%" height={120} />
          </Box>
        ))}
      </Box>

      {/* Bottom Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Skeleton variant="rounded" width={140} height={50} />
        <Skeleton variant="rounded" width={140} height={50} />
      </Box>
    </Box>
  );
};

export default DealFlowContainerLoading;
