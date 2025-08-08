import { NextRequest } from 'next/server';
import prisma from '../prisma.server';
import {
  ProjectDocumentWithDocumentEvents,
  UserWithOrganizations,
} from '../types';
import { getAuth } from '@clerk/nextjs/server';
import { canSeeDocument } from '../nda/utils.server';
import { DealFinancingType, DocumentEvent, Prisma, User } from '@prisma/client';

export async function validateAccess(
  dbUser: UserWithOrganizations,
  type: string,
  id: number
) {
  if (type === 'deal') {
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) {
      throw new Error('Deal not found');
    }
    if (
      !dbUser.organizationsOwned.some(org => org.id === deal.organizationId)
    ) {
      throw new Error(
        'You are not the owner of the organization that the deal belongs to'
      );
    }
  } else {
    if (!dbUser.organizationsOwned.some(org => org.id === id)) {
      throw new Error(
        'You are not the owner of the organization you are trying to upload a document for'
      );
    }
  }
}

export async function validateUser(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    throw new Error('User not found');
  }

  const dbUser = (await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { organizationsOwned: true },
  })) as UserWithOrganizations;

  if (!dbUser) {
    throw new Error(`User record with clerkid ${userId} not found in prisma`);
  }

  return dbUser;
}

/**
 * Retrieves project documents from the database with optional user-based access filtering.
 *
 * - If a userId is provided, documentEvents will also be included for that user.
 * - NDA permissions are checked, and document links and filenames are hidden if the user doesn't have access.
 *
 * @async
 * @function getProjectDocuments
 * @param {number} projectId - The ID of the project to fetch documents for.
 * @param {number} [userId] - Optional user ID to filter document events and check NDA agreement.
 * @param {Prisma.ProjectDocumentWhereInput} [findCondition] - Optional custom `where` clause for filtering documents.
 * @returns {Promise<Array<ProjectDocumentWithDocumentEvents>>} List of project documents with access control applied:
 * - `link` and `fileName` will be empty if the user does not have permission.
 * - Includes `documentEvents` for the user if `userId` is provided.
 *
 * @example
 * const docs = await getProjectDocuments(101, 5);
 */
export async function getProjectDocuments(
  projectId: number,
  userId?: number,
  findCondition?: Prisma.ProjectDocumentWhereInput
): Promise<Array<ProjectDocumentWithDocumentEvents>> {
  const whereClause = Boolean(findCondition)
    ? findCondition
    : {
        projectId,
      };

  const includeClause = userId
    ? {
        include: {
          documentEvents: {
            where: { userId },
          },
        },
      }
    : {};

  const rawDocuments = await prisma.projectDocument.findMany({
    where: whereClause,
    ...includeClause,
  });

  const nda = await prisma.nDAAgreement.findFirst({
    where: {
      userId,
    },
  });

  return rawDocuments.map(doc => {
    const hasDocPermission = canSeeDocument(doc, nda);
    const link = hasDocPermission ? doc.link : '';
    const fileName = hasDocPermission ? doc.fileName : '';
    return {
      ...doc,
      link,
      fileName,
      documentEvents: (doc as any).documentEvents || [],
    };
  });
}

/**
 * Retrieves and filters project documents with user access check and additional logic:
 * - Filters documents by financing type and deal stage.
 * - Checks NDA permission and hides restricted document links.
 * - Sorts results by priority: YouTube links first, then normal documents, then Docusign.
 *
 * @async
 * @function getProjectDocumentsWithAccessCheck
 * @param {number} projectId - The ID of the project to fetch documents for.
 * @param {string} financingType - The financing type filter (e.g., "equity" or "promissory_note_now").
 * @param {number} [dealStage] - Optional deal stage to filter documents.
 * @param {User|null} [user] - Optional user object for access check and NDA validation.
 * @returns {Promise<Array<ProjectDocumentWithDocumentEvents>>} List of sorted and filtered project documents with `completed` status.
 *
 * @example
 * const docs = await getProjectDocumentsWithAccessCheck(101, 'equity', 2, currentUser);
 */
export async function getProjectDocumentsWithAccessCheck(
  projectId: number,
  financingType: string,
  dealStage?: number,
  user?: User | null
): Promise<Array<ProjectDocumentWithDocumentEvents>> {
  const where: Prisma.ProjectDocumentWhereInput = { projectId };
  if (dealStage) where.dealStage = dealStage;

  const isDealFinancingType = financingType
    ? Object.values(DealFinancingType).includes(
        financingType as DealFinancingType
      )
    : false;

  const documents = await getProjectDocuments(projectId, user?.id, {
    ...where,
    ...(isDealFinancingType
      ? {
          OR: [
            { financingTypes: { has: financingType as DealFinancingType } },
            { financingTypes: { equals: [] } },
          ],
        }
      : {}),
  });

  return documents
    .map(doc => ({
      ...doc,
      completed: doc.documentEvents.some(
        (event: DocumentEvent) => event.documentId === doc.id
      ),
    }))
    .sort((a, b) => {
      if (a.link.includes('youtube') && !b.link.includes('youtube')) return -1;
      if (!a.link.includes('youtube') && b.link.includes('youtube')) return 1;
      if (a.link.includes('docusign') && !b.link.includes('docusign')) return 1;
      if (!a.link.includes('docusign') && b.link.includes('docusign'))
        return -1;
      return 0;
    });
}
