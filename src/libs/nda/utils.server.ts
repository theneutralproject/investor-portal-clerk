import { NDAAgreement, ProjectDocument } from '@prisma/client';

const CURRENT_REVISION = parseInt(
  process.env.NEXT_PUBLIC_CURRENT_NDA_REVISION || '1',
  10
);

/**
 *
 * @param document
 * @param userId
 * @returns Promise<boolean>
 */
export const canSeeDocument = (
  document: ProjectDocument,
  nda?: NDAAgreement | null
): boolean => {
  if (document.isPublic || !document.requiresNDA) return true;

  if (document.requiresNDA && nda) {
    return Boolean(nda && nda.revision === CURRENT_REVISION);
  }

  return false;
};
