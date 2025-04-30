import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { TextField, TextFieldProps, Autocomplete } from '@mui/material';

// Generic types for field paths
type NestedPath<
  T extends FieldValues,
  K extends string,
> = K extends `${infer A}.${infer B}`
  ? A extends keyof T
    ? T[A] extends Record<string, any>
      ? `${A}.${NestedPath<T[A], B>}`
      : never
    : never
  : K extends keyof T
    ? K
    : never;

// Extended text field props with generic form values
export interface FormTextFieldProps<T extends FieldValues>
  extends Omit<TextFieldProps, 'name'> {
  control: Control<T>;
  name: Path<T> | NestedPath<T, string>;
  required?: boolean;
  format?: 'ssn' | 'phone' | 'currency';
}

// Generic text field component
export function FormTextField<T extends FieldValues>({
  control,
  name,
  required,
  format,
  ...rest
}: FormTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({ field, fieldState: { error } }) => {
        // Handle formatting based on format type
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (format === 'ssn') {
            const rawValue = e.target.value.replace(/\D/g, '');
            if (rawValue.length <= 9) {
              let formatted = rawValue;
              if (rawValue.length > 3) {
                formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
              }
              if (rawValue.length > 5) {
                formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 5)}-${rawValue.slice(5)}`;
              }
              field.onChange(formatted);
            }
          } else if (format === 'phone') {
            // Phone number formatting if needed
            const rawValue = e.target.value.replace(/\D/g, '');
            if (rawValue.length <= 10) {
              let formatted = rawValue;
              if (rawValue.length > 3) {
                formatted = `(${rawValue.slice(0, 3)}) ${rawValue.slice(3)}`;
              }
              if (rawValue.length > 6) {
                formatted = `(${rawValue.slice(0, 3)}) ${rawValue.slice(3, 6)}-${rawValue.slice(6)}`;
              }
              field.onChange(formatted);
            }
          } else if (format === 'currency') {
            // Currency formatting if needed
            const rawValue = e.target.value.replace(/[^\d.]/g, '');
            field.onChange(rawValue);
          } else {
            field.onChange(e);
          }
        };

        return (
          <TextField
            {...field}
            {...rest}
            label={required ? `${rest.label} *` : rest.label}
            variant="standard"
            fullWidth
            error={!!error}
            onChange={format ? handleChange : field.onChange}
          />
        );
      }}
    />
  );
}

// Generic autocomplete props
export interface FormAutocompleteProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T> | NestedPath<T, string>;
  label: string;
  options: string[];
  required?: boolean;
  disabled?: boolean;
}

// Generic autocomplete component
export function FormAutocomplete<T extends FieldValues>({
  control,
  name,
  label,
  options,
  required,
  disabled,
  ...rest
}: FormAutocompleteProps<T>) {
  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({
        field: { value, onChange, onBlur, ref },
        fieldState: { error },
      }) => (
        <Autocomplete
          options={options}
          value={value || null}
          onChange={(_, newValue) => onChange(newValue)}
          onBlur={onBlur}
          disabled={disabled}
          renderInput={params => (
            <TextField
              {...params}
              {...rest}
              inputRef={ref}
              label={required ? `${label} *` : label}
              fullWidth
              variant="standard"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      )}
    />
  );
}
