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
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ReferralSource } from '@/libs/hubspot/utils';
import { type HubspotContactCreateUpdateSchema } from '@/libs/hubspot/schema';

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
  const { user } = useUser();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!referralSource) return;

    setIsLoading(true);

    try {
      const userResponse = await axios.put('/api/users', { referralSource });
      const data = userResponse.data;
      const email = user?.primaryEmailAddress
        ? user.primaryEmailAddress.emailAddress
        : (user?.emailAddresses[0]?.emailAddress ?? null);
      if (!email) {
        throw new Error('User email address not found');
      }

      const hubspotId = data?.hubspotId;
      if (!hubspotId) {
        throw new Error('User hubspotId not found');
      }

      const hsUser: HubspotContactCreateUpdateSchema = {
        email,
        properties: { referral_source: referralSource },
      };

      await axios.put(`/api/users/${hubspotId}`, hsUser);
    } catch (error) {
      console.error('Error updating user information:', error);
    }

    router.push('/dashboard');
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
              {Object.entries(ReferralSource).map(([key, value]) => (
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
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
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
