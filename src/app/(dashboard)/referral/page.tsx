'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  Container,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ReferralSource } from '@/libs/hubspot/utils.client';

const normalizeLabel = (label: string) => {
  return label
    .split('_')
    .map(word =>
      word === 'SLASH'
        ? '/'
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');
};

const Referral: React.FC = () => {
  const [referralSource, setReferralSource] = useState<ReferralSource | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const redirectUrl = searchParams.get('redirectUrl');

  const updateUserAndHubspot = async (source: ReferralSource) => {
    try {
      const email =
        user?.primaryEmailAddress?.emailAddress ??
        user?.emailAddresses[0]?.emailAddress;

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

    router.push(redirectUrl ? redirectUrl : '/dashboard');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!referralSource) return;

    setIsLoading(true);
    await updateUserAndHubspot(referralSource);
  };

  const handleSkip = async () => {
    setIsLoading(true);
    setReferralSource(ReferralSource.UNKNOWN);
    await updateUserAndHubspot(ReferralSource.UNKNOWN);
  };

  return (
    <Container sx={{ maxWidth: '500px !important' }}>
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        Create Your Account
      </Typography>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: '28px', mb: 2, textAlign: 'center' }}
      >
        How Did You Hear About Us?
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <RadioGroup
              value={referralSource}
              onChange={e =>
                setReferralSource(e.target.value as ReferralSource)
              }
            >
              {Object.entries(ReferralSource)
                .filter(([key]) => key !== 'UNKNOWN')
                .map(([key, value]) => (
                  <FormControlLabel
                    key={key}
                    value={value}
                    control={<Radio />}
                    label={normalizeLabel(key)}
                  />
                ))}
            </RadioGroup>
          </form>
        </CardContent>
      </Card>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
          variant="neutralYellow"
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
};

export default Referral;
