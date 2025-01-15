// ThirdPartyVerifierForm.tsx

import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { type AccreditationVerifier } from '@prisma/client';

interface ThirdPartyVerifierFormProps {
  verifierInfo: Partial<AccreditationVerifier>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
}

const ThirdPartyVerifierForm: React.FC<ThirdPartyVerifierFormProps> = ({
  verifierInfo,
  onChange,
  error,
}) => {
  return (
    <Box>
      <Typography variant="body2" gutterBottom>
        Provide the contact information for the party you are requesting
        verification from. Third party verifier can be any of the following:
      </Typography>
      <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
        <li>Licensed Attorney</li>
        <li>Certified Public Accountant</li>
        <li>SEC or state-registered Investment Adviser</li>
        <li>
          FINRA member Broker-Dealer (This does not include IRS Enrolled Agents)
        </li>
      </Typography>
      <Box sx={{ mt: 2, p: 2 }}>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={verifierInfo.firstName}
          onChange={onChange}
          margin="normal"
          required
          variant="standard"
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={verifierInfo.lastName}
          onChange={onChange}
          margin="normal"
          required
          variant="standard"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={verifierInfo.email}
          onChange={onChange}
          margin="normal"
          required
          variant="standard"
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phoneNumber"
          value={verifierInfo.phoneNumber}
          onChange={onChange}
          margin="normal"
          variant="standard"
        />
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={verifierInfo.title}
          onChange={onChange}
          margin="normal"
          variant="standard"
        />
      </Box>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        Clicking &quot;Continue&quot; will submit this information and send an
        email to the verifier requesting verification.
      </Typography>
    </Box>
  );
};

export default ThirdPartyVerifierForm;
