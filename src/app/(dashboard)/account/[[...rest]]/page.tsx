'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
} from '@mui/material';
import AccountProfileDetails from '@/components/Account/AccountProfileDetails';
import AccountClerkProfile from '@/components/Account/AccountClerkProfile';
import { EncryptionCard } from '@/components/DealFlow/Details/EncryptionCard';

export default function AccountPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          My Account
        </Typography>

        <Grid container spacing={3} direction="column">
          <Grid item xs={12}>
            <Card
              sx={{
                boxShadow: 2,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Personal Information
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  This information is used for investments and financial
                  transactions.
                </Typography>
                <AccountProfileDetails />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <AccountClerkProfile />
          </Grid>

          <Grid item xs={12}>
            <EncryptionCard />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
