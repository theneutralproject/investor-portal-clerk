import React, { useState, type ChangeEvent } from "react";
import { Box, Typography, TextField, Autocomplete } from "@mui/material";
import { useDealFlow } from "@/components/DealFlow/Shared/DealFlowContext";
import { useRouter } from "next/navigation";
import { usStates } from "@/components/DealFlow/Helpers/DealFlowHelpers";
import DealFlowDocumentUpload from "@/components/DealFlow/Shared/DealFlowDocumentUpload";
import DealFlowFooter from "../Shared/DealFlowFooter";

const REQUIRED_DOCUMENTS = [
  {
    display: "Certificate of Formation",
    key: "organization-certificate-of-formation",
  },
  {
    display: "Operating Agreement",
    key: "organization-operating-agreement",
  },
];
interface FormData {
  name: string;
  tin: string;
  dateOfCreation: string;
  juristication: string;
}

export const formatDate = (date: Date | null | undefined | string): string => {
  if (!date) return "";
  if (typeof date === "string") {
    return date.split("T")[0] ?? "";
  }
  return date.toISOString().split("T")[0] ?? "";
};

const DealFlowEntityDetails: React.FC = () => {
  const { organization, updateOrganization, project, deal } = useDealFlow();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: organization?.name ?? "",
    tin: organization?.tin ?? "",
    dateOfCreation: formatDate(organization?.dateOfCreation),
    juristication: organization?.juristication ?? "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      console.error("Error updating organization:", error);
    }
  };

  const allRequiredDocumentsAreUploaded = () => {
    const orgDocuments = organization?.document ?? [];
    const requiredKeys = REQUIRED_DOCUMENTS.map((doc) => doc.key);

    const hasAllRequired = requiredKeys.every((requiredKey) => {
      const matchingDocs = orgDocuments.filter(
        (doc) => doc.key === requiredKey
      );
      return matchingDocs.length > 0;
    });

    return hasAllRequired;
  };
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Ownership Information
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Name of Entity"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Tax Identification Number (TIN)"
        name="tin"
        value={formData.tin}
        onChange={handleInputChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Date of Creation"
        name="dateOfCreation"
        type="date"
        value={formData.dateOfCreation}
        onChange={handleInputChange}
        InputLabelProps={{ shrink: true }}
      />

      <Autocomplete
        options={usStates}
        renderInput={(params) => (
          <TextField {...params} label="State" fullWidth />
        )}
        value={formData.juristication}
        onChange={(_, newValue) =>
          handleInputChange({
            target: { name: "juristication", value: newValue ?? "" },
          } as React.ChangeEvent<HTMLInputElement>)
        }
      />

      <DealFlowDocumentUpload
        documents={REQUIRED_DOCUMENTS}
        type="organization"
      />

      <DealFlowFooter
        onBack={() => null}
        onContinue={handleContinue}
        isContinueDisabled={!allRequiredDocumentsAreUploaded()}
      />
    </Box>
  );
};

export default DealFlowEntityDetails;
