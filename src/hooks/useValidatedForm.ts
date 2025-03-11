import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Generic validated form hook
export function useValidatedForm<T extends z.ZodType<any, any>>(
  schema: T,
  options?: Omit<UseFormProps<z.infer<T>>, 'resolver'>
): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    ...options,
  });
}

// Address schema - reusable across different forms
export const addressSchema = z.object({
  street: z.string().min(1, 'Address is required'),
  street2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipcode: z.string().min(1, 'ZIP code is required'),
  country: z.string().default('United States'),
});

// Deal Flow Details schema
export const dealFlowDetailsSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().optional(),
  ssn: z.string().refine(
    val => {
      // Check for formatted SSN: ***-**-6789
      const hasCorrectFormat = /^\*{3}-\*{2}-\d{4}$/.test(val);

      // Check for regular SSN: 9 digits
      const hasCorrectDigits = val.replace(/\D/g, '').length === 9;

      return hasCorrectFormat || hasCorrectDigits;
    },
    {
      message: 'SSN must be exactly 9 digits or in format ***-**-XXXX',
    }
  ),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: addressSchema,
});

// Type exports for schemas
export type AddressFormValues = z.infer<typeof addressSchema>;
export type DealFlowDetailsFormValues = z.infer<typeof dealFlowDetailsSchema>;

// Form-specific hooks
export const useDealFlowDetailsForm = (
  options?: Omit<UseFormProps<DealFlowDetailsFormValues>, 'resolver'>
) => {
  return useValidatedForm(dealFlowDetailsSchema, {
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      ssn: '',
      dateOfBirth: '',
      address: {
        street: '',
        street2: '',
        city: '',
        state: '',
        zipcode: '',
        country: 'United States',
      },
    },
    ...options,
  });
};

// You can add more form-specific hooks following the same pattern
// Example:
// export const useOtherFormType = () => {
//   return useValidatedForm(otherFormSchema, {
//     defaultValues: { ... }
//   });
// };
