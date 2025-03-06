import { DealOwnershipType } from '@prisma/client';

export function getDealOwnershipType(ownershipType: string): DealOwnershipType {
  switch (ownershipType) {
    case 'COMMON':
      return DealOwnershipType.COMMON;
    case 'CORPORATION':
      return DealOwnershipType.CORPORATION;
    case 'INDIVIDUAL':
      return DealOwnershipType.INDIVIDUAL;
    case 'JOINT':
      return DealOwnershipType.JOINT;
    case 'MARITAL':
      return DealOwnershipType.MARITAL;
    case 'TRUST':
      return DealOwnershipType.TRUST;
    case 'PARTNERSHIP':
      return DealOwnershipType.PARTNERSHIP;
    case 'IRA':
      return DealOwnershipType.IRA;
    case 'OTHER':
      return DealOwnershipType.OTHER;
    default:
      throw new Error(`Invalid ownership type: ${ownershipType}`);
  }
}
