import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { zUserUpdateSchema, UserUpdateSchema } from "@/libs/user/schema";
import DealFlowFooter from "./DealFlowFooter";
import { useDealFlow } from "./DealFlowContext";

// US states array
const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const DealFlowDetails: React.FC = () => {
  const { user, updateUser, isLoading } = useDealFlow();
  const [formData, setFormData] = useState<UserUpdateSchema | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        ssn: user.ssn ?? "",
        phoneNumber: user.phoneNumber ?? "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
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
            address: {
              ...prevData.address,
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
          dateOfBirth: formData.dateOfBirth
            ? new Date(formData.dateOfBirth + "T00:00:00.000Z").toISOString()
            : null,
        });
        updateUser(validatedData);
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
      <Typography variant="h5" gutterBottom>
        Update User Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="SSN"
            name="ssn"
            value={formData.ssn}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Address</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street"
            name="street"
            value={formData.address?.street}
            onChange={handleAddressChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.address?.city}
            onChange={handleAddressChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Zipcode"
            name="zipcode"
            value={formData.address?.zipcode}
            onChange={handleAddressChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={usStates}
            renderInput={(params) => (
              <TextField {...params} label="State" fullWidth />
            )}
            value={formData.address?.state}
            onChange={(_, newValue) =>
              handleAddressChange({
                target: { name: "state", value: newValue ?? "" },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            value="United States"
            disabled
          />
        </Grid>
      </Grid>

      <DealFlowFooter onBack={() => null} onContinue={handleSubmit} />
    </Box>
  );
};

export default DealFlowDetails;