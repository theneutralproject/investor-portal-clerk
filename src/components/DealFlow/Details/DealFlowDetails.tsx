import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Autocomplete,
  Card,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { zUserUpdateSchema, type UserUpdateSchema } from "@/libs/user/schema";
import DealFlowFooter from "@components/DealFlow/Shared/DealFlowFooter";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";
import { usStates } from "@components/DealFlow/Helpers/DealFlowHelpers";
import { formatDate } from "@components/DealFlow/Details/DealFlowEntityDetails";
import { type Address } from "@prisma/client";

import LockIcon from "@mui/icons-material/Lock";
import DealFlowTitle from "@components/DealFlow/Shared/DealFlowTitle";

const EncryptionCard = () => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LockIcon sx={{ fontSize: 20, color: "text.secondary" }} />
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: 500, color: "text.primary" }}
          >
            256-Bit Encryption
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mt: 0.5,
            pl: "28px",
          }}
        >
          Neutral uses industry-standard 256-bit encryption to ensure that your
          data remains private and secure.
        </Typography>
      </CardContent>
    </Card>
  );
};

const DealFlowDetails: React.FC = () => {
  const { user, updateUser, isLoading } = useDealFlow();
  const [formData, setFormData] = useState<UserUpdateSchema | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        ssn: user.ssn ?? "",
        phoneNumber: user.phoneNumber ?? "",
        dateOfBirth: formatDate(user.dateOfBirth),
        address: user.address ?? {
          street: "",
          city: "",
          zipcode: "",
          state: "",
          country: "United States",
        },
      });
    }
  }, [user]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };

  const handleAddressChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) =>
      prevData
        ? {
            ...prevData,
            address: prevData.address
              ? {
                  ...prevData.address,
                  [name]: value,
                }
              : {
                  street: "",
                  city: "",
                  zipcode: "",
                  state: "",
                  country: "United States",
                  [name]: value,
                },
          }
        : null
    );
  };

  const handleSubmit = () => {
    if (formData) {
      try {
        const validatedData = zUserUpdateSchema.parse({
          ...formData,
        });

        const dateOfBirth = formData.dateOfBirth
          ? new Date(formData.dateOfBirth)
          : null;
        const address = formData.address
          ? ({ ...formData.address } as Address)
          : null;
        void updateUser({ ...validatedData, dateOfBirth, address });
      } catch (error) {
        console.error("Validation error:", error);
      }
    }
  };

  if (isLoading || !formData) {
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
          <TextField
            fullWidth
            variant="standard"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            variant="standard"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            variant="standard"
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </Grid>

        {/* Address Section */}
        <Grid size={12}>
          <TextField
            fullWidth
            variant="standard"
            label="Address"
            name="street"
            value={formData.address?.street}
            onChange={handleAddressChange}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            variant="standard"
            label="Address Line 2 (Optional)"
            name="street2"
            onChange={handleAddressChange}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            variant="standard"
            label="City"
            name="city"
            value={formData.address?.city}
            onChange={handleAddressChange}
          />
        </Grid>
        <Grid size={6}>
          <Autocomplete
            options={usStates}
            renderInput={(params) => (
              <TextField
                {...params}
                label="State"
                fullWidth
                variant="standard"
              />
            )}
            value={formData.address?.state}
            onChange={(_, newValue) =>
              handleAddressChange({
                target: { name: "state", value: newValue ?? "" },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            variant="standard"
            label="Zip"
            name="zipcode"
            value={formData.address?.zipcode}
            onChange={handleAddressChange}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            variant="standard"
            label="Country"
            name="country"
            value="United States"
            disabled
          />
        </Grid>

        {/* Additional Information Section */}
        <Grid size={12}>
          <TextField
            fullWidth
            variant="standard"
            label="Social Security Number"
            name="ssn"
            value={formData.ssn}
            onChange={handleInputChange}
            placeholder="___-__-____"
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            variant="standard"
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="MM/DD/YYYY"
          />
        </Grid>

        <Grid size={12}>
          <EncryptionCard />
        </Grid>
      </Grid>

      <DealFlowFooter onBack={() => null} onContinue={handleSubmit} />
    </Box>
  );
};

export default DealFlowDetails;
