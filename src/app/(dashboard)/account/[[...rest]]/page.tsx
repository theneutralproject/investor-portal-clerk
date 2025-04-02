'use client';

import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import AccountProfileDetails from '@/components/Account/AccountProfileDetails';
import AccountClerkProfile from '@/components/Account/AccountClerkProfile';

export default function AccountPage() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        My Account
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Neutral Profile Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This information is used for investments and financial
              transactions.
            </Typography>
            <AccountProfileDetails />
          </Paper>
        </Grid>

        <Grid item xs={12} md={12}>
          <AccountClerkProfile />
        </Grid>
      </Grid>
    </Box>
  );
}
