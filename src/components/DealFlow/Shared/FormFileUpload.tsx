import React, { ReactElement } from 'react';
import { Box, Button, Typography, Avatar, FormHelperText } from '@mui/material';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import UploadIcon from '@mui/icons-material/Upload';

export interface FormFileUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  accept?: string;
  icon?: ReactElement;
  imageWidth?: number;
  imageHeight?: number;
  defaultValue?: string;
}

export function FormFileUpload<T extends FieldValues>({
  control,
  name,
  label,
  accept = 'image/*',
  icon = <UploadIcon />,
  imageWidth = 291,
  imageHeight = 109,
  defaultValue = '',
}: FormFileUploadProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const fileValue = value as unknown;
        const previewUrl =
          fileValue instanceof File
            ? URL.createObjectURL(fileValue)
            : (fileValue as string);

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
            onChange(file);
          }
        };
        const image = previewUrl || defaultValue;

        return (
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="caption" color="textSecondary">
              {label}
            </Typography>

            <Box display="flex" alignItems="center" gap={2}>
              {image && (
                <Avatar
                  variant="rounded"
                  src={image}
                  alt="Uploaded"
                  sx={{
                    width: imageWidth,
                    height: imageHeight,
                    borderRadius: 2,
                  }}
                />
              )}
              <label
                htmlFor={`upload-${name}`}
                style={{
                  alignSelf: 'flex-end',
                }}
              >
                <input
                  id={`upload-${name}`}
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  hidden
                />
                <Button
                  variant="outlined"
                  size="medium"
                  component="span"
                  endIcon={icon}
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.87)',
                    textTransform: 'none',
                  }}
                >
                  Replace Logo
                </Button>
              </label>
            </Box>

            {error?.message && (
              <FormHelperText error>{error.message}</FormHelperText>
            )}
          </Box>
        );
      }}
    />
  );
}
