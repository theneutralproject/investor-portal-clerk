'use client';
import React, { useState, Suspense, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Container,
  CircularProgress,
  Autocomplete,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { ReferralSource, REFERRAL_SOURCES } from '@/libs/hubspot/utils.client';
import { useRedirect } from '@/app/context/RedirectContext';
import { sendGTMEvent } from '@next/third-parties/google';

function ReferralForm(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUser();
  const { doRedirect } = useRedirect();

  const updateUserAndHubspot = async (
    source: ReferralSource
  ): Promise<void> => {
    const userId = user?.id ?? '';
    const emailAddress =
      user?.primaryEmailAddress?.emailAddress?.toString() ?? 'unknown';

    sendGTMEvent({
      userId,
      eventCategory: 'Account',
      event: 'Account Signup',
      eventLabel: `New Account Signup by ${emailAddress}`,
    });

    try {
      const email =
        user?.primaryEmailAddress?.emailAddress ??
        user?.emailAddresses?.[0]?.emailAddress;

      if (!email) {
        throw new Error('User email address not found');
      }

      await axios.put('/api/users', {
        email,
        properties: { referral_source: source },
        referralSource: source,
      });
    } catch (error) {
      console.error('Error updating user information:', error);
    }

    doRedirect({});
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (!referralSource) return;

    setIsLoading(true);
    await updateUserAndHubspot(referralSource.value as ReferralSource);
  };

  const handleSkip = async (): Promise<void> => {
    setIsLoading(true);
    await updateUserAndHubspot(ReferralSource.OTHER);
  };

  // Format options for autocomplete
  const autocompleteOptions = useMemo(() => {
    return REFERRAL_SOURCES.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  type AutocompleteOption = (typeof autocompleteOptions)[0];

  const [referralSource, setReferralSource] =
    useState<AutocompleteOption | null>(null);

  return (
    <Container sx={{ maxWidth: '500px !important' }}>
      <Typography variant="body2" sx={{ textAlign: 'center', mb: 1 }}>
        Create Your Account
      </Typography>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: '28px', mb: 3, textAlign: 'center' }}
      >
        How Did You Hear About Us?
      </Typography>
      <Card elevation={2}>
        <CardContent>
          <Autocomplete<AutocompleteOption>
            options={autocompleteOptions}
            getOptionLabel={option => option.name}
            value={referralSource}
            onChange={(_, newValue) => setReferralSource(newValue)}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            renderInput={params => (
              <TextField
                {...params}
                label="Select referral source"
                placeholder="Start typing to search..."
                variant="outlined"
                fullWidth
              />
            )}
          />
        </CardContent>
      </Card>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="text"
          onClick={handleSkip}
          disabled={isLoading}
          sx={{ color: 'grey.500' }}
        >
          Skip
        </Button>
        <Button
          type="submit"
          variant="neutralRustTerracotta"
          disabled={!referralSource || isLoading}
          onClick={handleSubmit}
          startIcon={
            isLoading && <CircularProgress size={20} color="inherit" />
          }
        >
          Continue
        </Button>
      </Box>
    </Container>
  );
}

const Referral: React.FC = () => {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      }
    >
      <ReferralForm />
    </Suspense>
  );
};

export default Referral;
