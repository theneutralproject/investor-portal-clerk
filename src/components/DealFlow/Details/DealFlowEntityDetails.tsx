import React, { useState, type ChangeEvent } from 'react';
import { Box, TextField, Autocomplete } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useDealFlow } from '@/components/DealFlow/Shared/DealFlowContext';
import { useRouter } from 'next/navigation';
import { usStates } from '@/components/DealFlow/Helpers/DealFlowHelpers';
import DealFlowDocumentUpload from '@/components/DealFlow/Shared/DealFlowDocumentUpload';
import DealFlowFooter from '../Shared/DealFlowFooter';
import DealFlowTitle from '@components/DealFlow/Shared/DealFlowTitle';
import { DealDocumentType } from '@prisma/client';
import { EncryptionCard } from './EncryptionCard';

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
interface FormData {
  name: string;
  tin: string;
  dateOfCreation: string;
  juristication: string;
}

export const formatDate = (date: Date | null | undefined | string): string => {
  if (!date) return '';
  if (typeof date === 'string') {
    return date.split('T')[0] ?? '';
  }
  return date.toISOString().split('T')[0] ?? '';
};

const DealFlowEntityDetails: React.FC = () => {
  const { organization, updateOrganization, project, deal } = useDealFlow();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: organization?.name ?? '',
    tin: organization?.tin ?? '',
    dateOfCreation: formatDate(organization?.dateOfCreation),
    juristication: organization?.juristication ?? '',
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = async () => {
    try {
      if (organization?.id) {
        const updatedFormData = {
          ...formData,
          dateOfCreation: formData.dateOfCreation
            ? new Date(formData.dateOfCreation)
            : undefined,
        };
        await updateOrganization(organization.id, updatedFormData);
        router.push(
          `/dealflow/${project?.slug}/${deal?.id}/entity-details-co-investor`
        );
      }
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };

  const allRequiredDocumentsAreUploaded = () => {
    const orgDocuments = organization?.document ?? [];
    const requiredKeys = REQUIRED_DOCUMENTS.map(doc => doc.key);

    const hasAllRequired = requiredKeys.every(requiredKey => {
      const matchingDocs = orgDocuments.filter(doc => doc.key === requiredKey);
      return matchingDocs.length > 0;
    });

    return hasAllRequired;
  };
  return (
    <Box>
      <DealFlowTitle title="Ownership Information" />

      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField
            variant="standard"
            fullWidth
            margin="normal"
            label="Name of Entity"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Grid>

        <Grid size={6}>
          <TextField
            variant="standard"
            fullWidth
            margin="normal"
            label="Tax Identification Number (TIN)"
            name="tin"
            value={formData.tin}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid size={6}>
          <TextField
            variant="standard"
            fullWidth
            margin="normal"
            label="Date of Creation"
            name="dateOfCreation"
            type="date"
            value={formData.dateOfCreation}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid size={6}>
          <Autocomplete
            options={usStates}
            renderInput={params => (
              <TextField
                {...params}
                label="Jurisdiction of Registration"
                fullWidth
                variant="standard"
                margin="normal" // Add this to match other fields
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            )}
            value={formData.juristication}
            onChange={(_, newValue) =>
              handleInputChange({
                target: { name: 'juristication', value: newValue ?? '' },
              } as React.ChangeEvent<HTMLInputElement>)
            }
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
        
        onContinue={handleContinue}
        isContinueDisabled={!allRequiredDocumentsAreUploaded()}
      />
    </Box>
  );
};

export default DealFlowEntityDetails;
