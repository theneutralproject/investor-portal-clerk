'use client';

import React, { useState } from 'react';
import { Repeat } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { FormTextField } from '@components/DealFlow/Shared/FormComponents';
import {
  AdvisorFirmUpdateSchema,
  zAdvisorFirmUpdateSchema,
} from '@/libs/advisorFirm/schema';
import { FormFileUpload } from '../DealFlow/Shared/FormFileUpload';
import { useQueryClient } from '@tanstack/react-query';

interface AdvisorFirmInfoFormProps {
  onSave?: (data: AdvisorFirmUpdateSchema) => void;
  onCancel?: () => void;
  defaultValues: { name?: string; file?: File; logoUrl?: string };
}

export const AdvisorFirmInfoFormSkeleton = () => (
  <Card sx={{ borderRadius: '8px' }}>
    <CardContent>
      <Skeleton variant="text" width={160} height={30} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
      <Skeleton variant="text" width={160} height={20} sx={{ mb: 1 }} />
      <Skeleton variant="rectangular" height={110} width={290} />
      <Skeleton
        variant="rectangular"
        width={130}
        height={40}
        sx={{ mt: 3, ml: 'auto' }}
      />
    </CardContent>
  </Card>
);

const AdvisorFirmInfoForm: React.FC<AdvisorFirmInfoFormProps> = ({
  onCancel,
  defaultValues,
}) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useValidatedForm(zAdvisorFirmUpdateSchema, {
    defaultValues: {
      name: defaultValues.name || '',
      file: defaultValues.file,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  const onSave = async (data: AdvisorFirmUpdateSchema): Promise<void> => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      if (data.name) {
        formData.append('name', data.name);
      }

      if (data.file instanceof File) {
        formData.append('file', data.file);
      }

      const response = await axios.put('/api/advisors', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success('Updated company info successfully');
        queryClient.invalidateQueries({ queryKey: ['advisor'] });
        reset({
          file: data.file,
          name: data.name,
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update company info');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: AdvisorFirmUpdateSchema) => {
    await onSave(data);
  };

  if (isSubmitting) return <AdvisorFirmInfoFormSkeleton />;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: '20px',
              mb: 2,
            }}
          >
            Company Info
          </Typography>
          <FormTextField<AdvisorFirmUpdateSchema>
            control={control}
            name="name"
            label="Company Name"
            required
            variant="standard"
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
          }}
        >
          <FormFileUpload<AdvisorFirmUpdateSchema>
            control={control}
            name="file"
            label="Company Logo"
            defaultValue={defaultValues.logoUrl}
            icon={<Repeat />}
          />
        </Grid>
        {isDirty && (
          <Grid
            size={{
              xs: 12,
            }}
          >
            <Box display="flex" justifyContent="flex-end" gap={1} mr={-1}>
              <Button
                onClick={handleCancel}
                variant="outlined"
                size="medium"
                sx={{
                  display: isDirty ? 'block' : 'none',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.87)',
                  textTransform: 'none',
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="medium"
                sx={{
                  display: !isValid || !isDirty ? 'none' : 'block',
                  backgroundColor: 'black',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                  textTransform: 'none',
                }}
              >
                Save
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AdvisorFirmInfoForm;
