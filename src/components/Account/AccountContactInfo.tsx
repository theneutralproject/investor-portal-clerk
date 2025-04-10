'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { FormTextField } from '@components/DealFlow/Shared/FormComponents';
import { z } from 'zod';
import { UserWithAddress } from '@/libs/types';

const contactSchema = z.object({
  email: z.string().email(),
  phoneNumber: z.string(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface AccountContactInfoProps {
  user: UserWithAddress | null;
}

const AccountContactInfo: React.FC<AccountContactInfoProps> = ({ user }) => {
  const { control, setValue } = useValidatedForm(contactSchema, {
    defaultValues: {
      email: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('email', user.email ?? '');
      setValue('phoneNumber', user.phoneNumber ?? '');
    }
  }, [user, setValue]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={12}>
          <FormTextField<ContactFormValues>
            control={control}
            name="email"
            label="Email"
            disabled
          />
        </Grid>

        <Grid size={12}>
          <FormTextField<ContactFormValues>
            control={control}
            name="phoneNumber"
            label="Phone Number"
            format="phone"
            disabled
          />
        </Grid>
        <Grid size={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: '0.875rem' }}
              fontWeight="medium"
            >
              Need to change your contact info?
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
              If your email or phone number has changed, please email{' '}
              <a href="mailto:invest@neutral.us">
                <b>invest@neutral.us</b>
              </a>{' '}
              and our team will update your account accordingly.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountContactInfo;
