import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useDealFlow } from '@/components/DealFlow/Shared/DealFlowContext';
import { useRouter } from 'next/navigation';
import { usStates } from '@/components/DealFlow/Helpers/DealFlowHelpers';
import DealFlowDocumentUpload from '@/components/DealFlow/Shared/DealFlowDocumentUpload';
import DealFlowFooter from '../Shared/DealFlowFooter';
import DealFlowTitle from '@components/DealFlow/Shared/DealFlowTitle';
import { DealDocumentType } from '@prisma/client';
import { EncryptionCard } from './EncryptionCard';
import {
  isOrganizationReadOnly,
  LockedEntityAlert,
} from './DealFlowCoInvestor';
import {
  useEntityDetailsForm,
  EntityDetailsFormValues,
} from '../../../hooks/useValidatedForm';
import { FormTextField, FormAutocomplete } from '../Shared/FormComponents';

const REQUIRED_DOCUMENTS = [
  {
    display: 'Certificate of Formation',
    key: 'organization-certificate-of-formation',
  },
  {
    display: 'Operating Agreement',
    key: 'organization-operating-agreement',
  },
];

export const formatDate = (date: Date | null | undefined | string): string => {
  if (!date) return '';
  if (typeof date === 'string') {
    return date.split('T')[0] ?? '';
  }
  return date.toISOString().split('T')[0] ?? '';
};

const DealFlowEntityDetails: React.FC = () => {
  const {
    organization,
    updateOrganization,
    project,
    deal,
    organizationsOwned,
  } = useDealFlow();
  const router = useRouter();
  const organizationReadOnly = isOrganizationReadOnly(
    organizationsOwned,
    organization
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
    trigger,
  } = useEntityDetailsForm();

  useEffect(() => {
    if (organization) {
      // Set form values from organization data
      setValue('id', organization.id);
      setValue('name', organization.name ?? '');
      setValue('tin', organization.tin ?? '');
      setValue('dateOfCreation', formatDate(organization.dateOfCreation));
      setValue('juristication', organization.juristication ?? '');
      trigger();
    }
  }, [organization, setValue, trigger]);

  const handleContinue = async (data: EntityDetailsFormValues) => {
    try {
      if (organization?.id) {
        const updatedData = {
          ...data,
          dateOfCreation: data.dateOfCreation
            ? new Date(data.dateOfCreation)
            : undefined,
        };

        const response = await updateOrganization(organization.id, updatedData);

        if (response.success) {
          router.push(
            `/dealflow/${project?.slug}/${deal?.id}/entity-details-co-investor`
          );
        }
      }
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };

  const allRequiredDocumentsAreUploaded = () => {
    const orgDocuments = organization?.document ?? [];
    const requiredKeys = REQUIRED_DOCUMENTS.map(doc => doc.key);

    return requiredKeys.every(requiredKey => {
      const matchingDocs = orgDocuments.filter(doc => doc.key === requiredKey);
      return matchingDocs.length > 0;
    });
  };

  return (
    <Box>
      <DealFlowTitle title="Ownership Information" />

      {organizationReadOnly && <LockedEntityAlert />}

      <Grid container spacing={2}>
        <Grid size={6}>
          <FormTextField<EntityDetailsFormValues>
            control={control}
            name="name"
            label="Name of Entity"
            required
            disabled={organizationReadOnly}
          />
        </Grid>

        <Grid size={6}>
          <FormTextField<EntityDetailsFormValues>
            control={control}
            name="tin"
            label="Tax Identification Number (TIN)"
            disabled={organizationReadOnly}
          />
        </Grid>

        <Grid size={6}>
          <FormTextField<EntityDetailsFormValues>
            control={control}
            name="dateOfCreation"
            label="Date of Creation"
            type="date"
            required
            disabled={organizationReadOnly}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& input::-webkit-datetime-edit': { color: 'rgba(0, 0, 0, 0.6)' },
              '& input:not([value=""])::-webkit-datetime-edit': {
                color: 'inherit',
              },
            }}
          />
        </Grid>

        <Grid size={6}>
          <FormAutocomplete<EntityDetailsFormValues>
            control={control}
            name="juristication"
            label="Jurisdiction of Registration"
            options={usStates}
            required
            disabled={organizationReadOnly}
          />
        </Grid>
      </Grid>

      <DealFlowDocumentUpload
        documents={REQUIRED_DOCUMENTS}
        type="organization"
        dealDocumentType={DealDocumentType.INVESTMENT_DOCUMENT}
      />
      <EncryptionCard />
      <DealFlowFooter
        onContinue={handleSubmit(handleContinue)}
        isContinueDisabled={
          (!isValid || !allRequiredDocumentsAreUploaded()) &&
          !organizationReadOnly
        }
        onBack={() => router.back()}
      />
    </Box>
  );
};

export default DealFlowEntityDetails;
