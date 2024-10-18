import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";
import { useRouter } from "next/navigation";
import usStates from "@components/DealFlow/Helpers/DealFlowHelpers";

const DealFlowEntityDetails = () => {
  const { organization, updateOrganization, project, deal } = useDealFlow();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: organization?.name || "",
    tin: organization?.tin || "",
    dateOfCreation: organization?.dateOfCreation
      ? new Date(organization.dateOfCreation).toISOString().split("T")[0]
      : "",
    juristication: organization?.juristication || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = async () => {
    try {
      await updateOrganization(organization.id, formData);
      router.push(
        `/dealflow/${project.slug}/${deal.id}/entity-details-co-investor`
      );
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
