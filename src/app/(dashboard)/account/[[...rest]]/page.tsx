'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Divider,
  CircularProgress,
} from '@mui/material';
import AccountProfileDetails from '@/components/Account/AccountProfileDetails';
import { EncryptionCard } from '@/components/DealFlow/Details/EncryptionCard';
import AccountContactInfo from '@/components/Account/AccountContactInfo';
import axios from 'axios';
import { UserWithAddress } from '@/libs/types';
import { toast } from 'react-toastify';

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserWithAddress | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get<UserWithAddress>('/api/users');
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchUser();
  }, []);

  const handleProfileUpdate = async (updatedUser: UserWithAddress) => {
    try {
      const { data } = await axios.put<UserWithAddress>(
        '/api/users',
        updatedUser
      );
      setUser(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          My Account
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      Contact Info
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <AccountContactInfo user={user} />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      Personal Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <AccountProfileDetails
                      user={user}
                      onUpdate={handleProfileUpdate}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <EncryptionCard mt={0} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
