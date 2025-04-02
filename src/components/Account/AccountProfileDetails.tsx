'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { toast } from 'react-toastify';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import { usStates } from '@components/DealFlow/Helpers/DealFlowHelpers';
import { useValidatedForm, addressSchema } from '@/hooks/useValidatedForm';
import {
  FormTextField,
  FormAutocomplete,
} from '@components/DealFlow/Shared/FormComponents';
import { z } from 'zod';
import { UserWithAddress } from '@/libs/types';

const formatDate = (date: Date | null | undefined | string): string => {
  if (!date) return '';
  if (typeof date === 'string') {
    return date.split('T')[0] ?? '';
  }
  return date.toISOString().split('T')[0] ?? '';
};

const profileSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  ssn: z.string().refine(
    val => {
      // Check for formatted SSN: ***-**-6789
      const hasCorrectFormat = /^\*{3}-\*{2}-\d{4}$/.test(val);

      // Check for regular SSN: 9 digits
      const hasCorrectDigits = val.replace(/\D/g, '').length === 9;

      return hasCorrectFormat || hasCorrectDigits;
    },
    {
      message: 'SSN must be exactly 9 digits or in format ***-**-XXXX',
    }
  ),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: addressSchema,
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const AccountProfileDetails: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserWithAddress | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid, isDirty },
    trigger,
  } = useValidatedForm(profileSchema, {
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      ssn: '',
      dateOfBirth: '',
      address: {
        street: '',
        street2: '', //TODO
        city: '',
        state: '',
        zipcode: '',
        country: 'United States',
      },
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get<UserWithAddress>('/api/users');
        setUser(data);

        setValue('id', data.id);
        setValue('firstName', data.firstName ?? '');
        setValue('lastName', data.lastName ?? '');
        setValue('phoneNumber', data.phoneNumber ?? '');
        setValue('ssn', data.ssn ?? '');
        setValue('dateOfBirth', formatDate(data.dateOfBirth) ?? '');

        setValue('address.street', data.address?.street ?? '');
        // setValue('address.street2', data.address?.street2 ?? ''); //TODO
        setValue('address.city', data.address?.city ?? '');
        setValue('address.state', data.address?.state ?? '');
        setValue('address.zipcode', data.address?.zipcode ?? '');
        setValue('address.country', 'United States');

        trigger();
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchUser();
  }, [setValue, trigger]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
      const address = data.address ? { ...data.address } : null;

      const updatedUser = {
        ...data,
        dateOfBirth,
        address,
      };

      const { data: response } = await axios.put<UserWithAddress>(
        '/api/users',
        updatedUser
      );

      setUser(response);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {/* Personal Information Section */}
        <Grid size={6}>
          <FormTextField<ProfileFormValues>
            control={control}
            name="firstName"
            label="First Name"
            required
          />
        </Grid>
        <Grid size={6}>
          <FormTextField<ProfileFormValues>
            control={control}
            name="lastName"
            label="Last Name"
            required
          />
        </Grid>
        <Grid size={12}>
          <FormTextField<ProfileFormValues>
            control={control}
            name="phoneNumber"
            label="Phone Number"
            format="phone"
            required
          />
        </Grid>

        {/* Address Section */}
        <Grid size={12}>
          <FormTextField<ProfileFormValues>
            control={control}
            name="address.street"
            label="Address"
            required
          />
        </Grid>
        <Grid size={12}>
          <FormTextField<ProfileFormValues>
            control={control}
            name="address.street2"
            label="Address Line 2 (Optional)"
          />
        </Grid>
        <Grid size={12}>
          <FormTextField<ProfileFormValues>
            control={control}
            name="address.city"
            label="City"
            required
          />
        </Grid>
        <Grid size={6}>
          <FormAutocomplete<ProfileFormValues>
            control={control}
            name="address.state"
            label="State"
            options={usStates}
            required
          />
        </Grid>
        <Grid size={6}>
          <FormTextField<ProfileFormValues>
            control={control}
            name="address.zipcode"
            label="Zip"
            required
          />
        </Grid>
        <Grid size={12}>
          <Tooltip
            slotProps={{
              popper: {
                sx: {
                  '.MuiTooltip-tooltip': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                  },
                },
              },
            }}
            title={
              <Typography variant="body2">
                If you are investing from abroad, please get in touch with us{' '}
                <a
                  href="https://neutral.us/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  here
                </a>
              </Typography>
            }
            placement="right"
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormTextField<ProfileFormValues>
                control={control}
                name="address.country"
                label="Country"
                disabled
              />
              <InfoIcon color="disabled" fontSize="small" />
            </Box>
          </Tooltip>
        </Grid>

        {/* Additional Information Section */}
        <Grid size={12}>
          <FormTextField<ProfileFormValues>
            control={control}
            name="ssn"
            label="Social Security Number"
            required
            placeholder="___-__-____"
            format="ssn"
          />
        </Grid>
        <Grid size={12}>
          <FormTextField<ProfileFormValues>
            control={control}
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            required
            placeholder="MM/DD/YYYY"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& input::-webkit-datetime-edit': { color: 'rgba(0, 0, 0, 0.6)' },
              '& input:not([value=""])::-webkit-datetime-edit': {
                color: 'inherit',
              },
            }}
          />
        </Grid>

        <Grid size={12} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isValid || !isDirty || isLoading}
              startIcon={<SaveIcon />}
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountProfileDetails;
