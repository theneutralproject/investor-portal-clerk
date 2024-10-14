import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { UserWithAddress } from "@/libs/prisma";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { zUserUpdateSchema, UserUpdateSchema } from "@/libs/user/schema";

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

interface DealFlowTypeProps {
  onBack: () => void;
  onContinue: () => void;
}

const DealFlowDetails: React.FC<DealFlowTypeProps> = ({
  onBack,
  onContinue,
}) => {
  const { data: user, isLoading: isLoadingUser } = useQuery<
    UserWithAddress,
    Error
  >({
    queryKey: ["user"],
    queryFn: () =>
      axios.get<UserWithAddress>("/api/users").then((res) => res.data),
  });

  const [formData, setFormData] = useState<UserUpdateSchema | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        ssn: user.ssn ?? "",
        phoneNumber: user.phoneNumber ?? "",
        dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split('T')[0]
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

  const updateUserMutation = useMutation({
    mutationFn: (data: UserUpdateSchema) => axios.put("/api/users", data),
    onSuccess: onContinue,
  });

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
        updateUserMutation.mutate(validatedData);
      } catch (error) {
        console.error("Validation error:", error);
      }
    }
  };

  if (isLoadingUser || !formData) {
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={updateUserMutation.isLoading}
        >
          {updateUserMutation.isLoading ? "Updating..." : "Continue"}
        </Button>
      </Box>
    </Box>
  );
};

export default DealFlowDetails;
