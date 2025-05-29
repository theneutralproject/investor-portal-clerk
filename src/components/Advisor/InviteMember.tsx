'use client';

import React from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { z } from 'zod';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { FormTextField } from '@components/DealFlow/Shared/FormComponents';

const inviteSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  role: z.literal('ADMIN'),
  phoneNumber: z.string().min(9, 'Phone Number is required'),
});

export type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteMemberFormProps {
  onInvite: (data: InviteFormValues) => Promise<void>;
  onCancel?: () => void;
}

const InviteMemberForm: React.FC<InviteMemberFormProps> = ({
  onInvite,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty, isSubmitting, isLoading },
  } = useValidatedForm(inviteSchema, {
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: 'ADMIN',
    },
  });

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  const onSubmit = async (data: InviteFormValues) => {
    await onInvite(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        minWidth: 480,
        px: 2,
        pt: 2,
      }}
    >
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 6,
          }}
        >
          <FormTextField<InviteFormValues>
            control={control}
            name="firstName"
            label="First Name"
            required
            variant="standard"
          />
        </Grid>
        <Grid
          size={{
            xs: 6,
          }}
        >
          <FormTextField<InviteFormValues>
            control={control}
            name="lastName"
            label="Last Name"
            required
            variant="standard"
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
          }}
        >
          <FormTextField<InviteFormValues>
            control={control}
            name="email"
            label="Email"
            required
            variant="standard"
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
          }}
        >
          <FormTextField<InviteFormValues>
            control={control}
            name="phoneNumber"
            label="Phone Number"
            required
            variant="standard"
          />
          <Typography mt={3} color={'rgba(0, 0, 0, 0.38)'} fontSize={'0.75ren'}>
            Please invite only trusted individuals within your organization. By
            clicking “Send Invite,” you acknowledge that you are authorizing
            this individual to access confidential investor information and
            firm-level data. You are solely responsible for managing access and
            ensuring that all invited users comply with applicable privacy and
            data protection laws. Neutral is not liable for any actions taken by
            users added to your firm’s account, including but not limited to
            unauthorized data sharing or misuse.
          </Typography>
        </Grid>
        <Grid
          size={{
            xs: 12,
          }}
        >
          <Divider
            sx={{
              width: '120%',
              ml: '-20px',
            }}
          />
          <Box
            display="flex"
            justifyContent="flex-end"
            gap={1}
            mt={1}
            mb={1}
            mr={-1}
          >
            <Button
              onClick={handleCancel}
              disabled={isSubmitting || isLoading}
              variant="outlined"
              size="medium"
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.87)',
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="medium"
              disabled={!isValid || !isDirty || isSubmitting || isLoading}
              loading={isSubmitting || isLoading}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
            >
              Send Invite
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InviteMemberForm;
