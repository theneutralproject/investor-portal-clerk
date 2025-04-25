'use client';

import { Box, Card, CardContent, Divider, Typography } from '@mui/material';

const AdvisorAccountPage = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ borderRadius: '8px', position: 'relative' }}>
        <CardContent>
          <Typography
            variant="body1"
            sx={{
              fontSize: '20px',
              mb: 2,
            }}
          >
            Account
          </Typography>

          <Divider sx={{ mb: 3 }} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdvisorAccountPage;
