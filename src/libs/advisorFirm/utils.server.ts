import { DealDocumentType } from '@prisma/client';

/**
 * Converts a user-entered search term into a matching DealDocumentType if valid.
 * @param input The raw search term from the user.
 * @returns A matching DealDocumentType or null if none matches.
 */
export function mapDocumentTypeSearch(
  input?: string | null
): DealDocumentType | null {
  if (!input) return null;

  const normalized = input.trim().toLowerCase();

  if (DealDocumentType[input as keyof typeof DealDocumentType])
    return DealDocumentType[input as keyof typeof DealDocumentType];

  switch (normalized) {
    case 'k1':
      return DealDocumentType.K1;
    case 'report':
    case 'project report':
      return DealDocumentType.REPORT;
    case 'investment':
    case 'investment document':
    case 'doc':
    case 'document':
      return DealDocumentType.INVESTMENT_DOCUMENT;
    case 'accreditation':
    case 'verification':
    case 'verification accreditation':
      return DealDocumentType.VERIFICATION_ACCREDITATION;
    default:
      return null;
  }
}
