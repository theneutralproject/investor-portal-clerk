import React, { useState, type ChangeEvent } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { useDealFlow } from "@/components/DealFlow/Shared/DealFlowContext";
import { useRouter } from "next/navigation";
import { usStates } from "@/components/DealFlow/Helpers/DealFlowHelpers";

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

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={() => null}>
          Back
        </Button>
        <Button variant="contained" onClick={handleContinue}>
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default DealFlowEntityDetails;
