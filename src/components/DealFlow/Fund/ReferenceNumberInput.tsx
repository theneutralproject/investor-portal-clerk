import React from 'react';
import { Card, CardContent, TextField } from '@mui/material';

interface ReferenceNumberInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  helperText: string;
}

const ReferenceNumberInput: React.FC<ReferenceNumberInputProps> = ({
  value,
  onChange,
  label,
  helperText,
}) => {
  return (
    <Card>
      <CardContent>
        <TextField
          fullWidth
          variant="outlined"
          label={label}
          helperText={helperText}
          value={value}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};

export default ReferenceNumberInput;
