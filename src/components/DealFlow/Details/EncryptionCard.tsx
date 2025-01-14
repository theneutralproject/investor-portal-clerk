import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

export const EncryptionCard = () => {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: 500, color: 'text.primary' }}
          >
            256-Bit Encryption
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mt: 0.5,
            pl: '28px',
          }}
        >
          Neutral uses industry-standard 256-bit encryption to ensure that your
          data remains private and secure.
        </Typography>
      </CardContent>
    </Card>
  );
};
