import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DealFlowFooter from '@components/DealFlow/Shared/DealFlowFooter';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
import { usStates } from '@components/DealFlow/Helpers/DealFlowHelpers';
import { formatDate } from '@components/DealFlow/Details/DealFlowEntityDetails';
import { type Address } from '@prisma/client';
import InfoIcon from '@mui/icons-material/Info';
import DealFlowTitle from '@components/DealFlow/Shared/DealFlowTitle';
import { EncryptionCard } from './EncryptionCard';
import {
  useDealFlowDetailsForm,
  DealFlowDetailsFormValues,
} from '../../../hooks/useValidatedForm';
import { FormTextField, FormAutocomplete } from '../Shared/FormComponents';
import Logger from '@/libs/logger';
import { sendGTMEvent } from '@next/third-parties/google';

const DealFlowDetails: React.FC = () => {
  const { user, updateUser, isLoading } = useDealFlow();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useDealFlowDetailsForm();

  useEffect(() => {
    if (user) {
      // Set form values from user data
      setValue('id', user.id);
      setValue('firstName', user.firstName ?? '');
      setValue('lastName', user.lastName ?? '');
      setValue('phoneNumber', user.phoneNumber ?? '');
      setValue('ssn', user.ssn ?? '');
      setValue('dateOfBirth', formatDate(user.dateOfBirth) ?? '');

      // Set address values
      setValue('address.street', user.address?.street ?? '');
      setValue('address.city', user.address?.city ?? '');
      setValue('address.state', user.address?.state ?? '');
      setValue('address.zipcode', user.address?.zipcode ?? '');
      setValue('address.country', 'United States');
    }
  }, [user, setValue]);

  const onSubmit = (data: DealFlowDetailsFormValues) => {
    try {
      const dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
      const address = data.address ? ({ ...data.address } as Address) : null;

      void updateUser({ ...data, dateOfBirth, address });

      // Send to Google Tag Manager
      sendGTMEvent({
        dealId: 'n/a',
        dealStage: 1,
        eventCategory: 'Deal Flow',
        event: `Step 3: Investor Details Submission`,
        eventLabel: `Investor Details submitted`,
      });
    } catch (error) {
      Logger.error(error, null, {
        message: 'Submission error:',
      });
    }
  };

  if (isLoading) {
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
    <Box>
      <DealFlowTitle title="Personal Details" />
      <Grid container spacing={2}>
        {/* Personal Information Section */}
        <Grid size={6}>
          <FormTextField<DealFlowDetailsFormValues>
            control={control}
            name="firstName"
            label="First Name"
            required
          />
        </Grid>
        <Grid size={6}>
          <FormTextField<DealFlowDetailsFormValues>
            control={control}
            name="lastName"
            label="Last Name"
            required
          />
        </Grid>
        <Grid size={12}>
          <FormTextField<DealFlowDetailsFormValues>
            control={control}
            name="phoneNumber"
            label="Phone Number"
            format="phone"
            required
          />
        </Grid>

        {/* Address Section */}
        <Grid size={12}>
          <FormTextField<DealFlowDetailsFormValues>
            control={control}
            name="address.street"
            label="Address"
            required
          />
        </Grid>
        <Grid size={12}>
          <FormTextField<DealFlowDetailsFormValues>
            control={control}
            name="address.street2"
            label="Address Line 2 (Optional)"
          />
        </Grid>
        <Grid size={12}>
          <FormTextField<DealFlowDetailsFormValues>
            control={control}
            name="address.city"
            label="City"
            required
          />
        </Grid>
        <Grid size={6}>
          <FormAutocomplete<DealFlowDetailsFormValues>
            control={control}
            name="address.state"
            label="State"
            options={usStates}
            required
          />
        </Grid>
        <Grid size={6}>
          <FormTextField<DealFlowDetailsFormValues>
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
              <FormTextField<DealFlowDetailsFormValues>
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
          <FormTextField<DealFlowDetailsFormValues>
            control={control}
            name="ssn"
            label="Social Security Number"
            required
            placeholder="___-__-____"
            format="ssn"
          />
        </Grid>
        <Grid size={12}>
          <FormTextField<DealFlowDetailsFormValues>
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

        <Grid size={12}>
          <EncryptionCard />
        </Grid>
      </Grid>

      <DealFlowFooter
        onContinue={handleSubmit(onSubmit)}
        isContinueDisabled={!isValid}
      />
    </Box>
  );
};

export default DealFlowDetails;
