import { z } from "zod";


export const zAddressCreateSchema = z.object({
    street: z.string(),
    city: z.string(),
    zipcode: z.string(),
    state: z.string(),
    country: z.string(),
});

export type AddressCreateSchema = z.infer<typeof zAddressCreateSchema>;