import { z } from 'zod';
import { zUserCreateSchema } from '../user/schema';
import {
  AdvisorEmployeeRole,
  AdvisorFirm,
  AdvisorFirmEmployee,
  DealFinancingType,
  Organization,
  User,
} from '@prisma/client';
import { PaginatedResponse } from '../types';
import { errorResponse } from '../utils.server';

export const zAdvisorFirmCreateSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().url().optional(),
});

export type AdvisorFirmCreateSchema = z.infer<typeof zAdvisorFirmCreateSchema>;

export const zAdvisorFirmUpdateSchema = z.object({
  name: z.string().min(1, 'Company name is required').optional(),
  file: z
    .custom<File>()
    .refine(file => file instanceof File, { message: 'Invalid file type' })
    .optional(),
});

export type AdvisorFirmUpdateSchema = z.infer<typeof zAdvisorFirmUpdateSchema>;

export const zAdvisorEmployeeCreateSchema = z.object({
  role: z.nativeEnum(AdvisorEmployeeRole),
  user: zUserCreateSchema,
});

export type AdvisorEmployeeCreateSchema = z.infer<
  typeof zAdvisorEmployeeCreateSchema
>;

export const zAssignClientToAdvisorFirmSchema = z.object({
  organizationId: z.number().int().positive(),
});

export type AssignClientToAdvisorFirmSchema = z.infer<
  typeof zAssignClientToAdvisorFirmSchema
>;

/**
 * Represents a summary of a client's financial relationship with an advisor.
 */
export interface AdvisorClientSummary {
  /** Client user information */
  client: {
    /** Unique ID of the client user */
    id: number;
    /** Full name of the client (first + last) */
    name: string;
    /** Email address of the client */
    email: string;
  };
  /** The organization the client owns */
  organization: {
    /** Unique ID of the organization */
    id: number;
    /** Legal or display name of the organization */
    name: string;
  };
  /** Total amount invested across all deals */
  totalInvested: number;
  /** Number of deals the client has invested in */
  numberOfInvestments: number;
  /** Array of deal financing types the client has invested in */
  dealTypes: DealFinancingType[]; // can be (DealFinancingType)[]
  /** Accumulated earnings to date (not projected) */
  earningsToDate: number;
  /** Projected earnings excluding principal */
  projectedEarnings: number;
  /** Total projected return including principal + earnings */
  totalProjectedReturn: number;
}

/**
 * Response payload for the advisor clients endpoint.
 */
export type AdvisorClientsResponse = PaginatedResponse<AdvisorClientSummary>;

/**
 * Response payload for the advisor clients endpoint.
 */
export type AdvisorFirmsResponse = PaginatedResponse<
  AdvisorFirm & {
    employees: AdvisorFirmEmployee[];
    clientOrganizations: Organization[];
  }
>;

export type AdvisorContext =
  | {
      dbUser: User;
      advisorFirmEmployee: AdvisorFirmEmployee & { advisorFirm: AdvisorFirm };
      advisorFirm: AdvisorFirm;
    }
  | ReturnType<typeof errorResponse>;
