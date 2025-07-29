import { NDAAgreement, ProjectDocument } from '@prisma/client';

const CURRENT_REVISION = parseInt(
  process.env.NEXT_PUBLIC_CURRENT_NDA_REVISION || '1',
  10
);

/**
 *
 * Access Rules
 * State	                      Public Doc	    NDA Doc
 * Signed Out                   Yes             No
 * Signed In, NDA not accepted	Yes             No (Show modal)
 * Signed In, NDA accepted	    Yes             Yes
 *
 * @param document
 * @param userId
 * @returns Promise<boolean>
 */
export const canSeeDocument = (
  document: ProjectDocument,
  nda?: NDAAgreement | null
): boolean => {
  if (document.isPublic) return true;

  if (document.requiresNDA && nda) {
    return Boolean(nda && nda.revision === CURRENT_REVISION);
  }

  return false;
};
