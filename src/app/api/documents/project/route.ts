import { getProjectDocumentsWithAccessCheck } from '@/libs/document/utils.server';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';

/**
 *
 * @param request Get documents for a project
 * @returns
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const neutralUser = userId
      ? await prisma.user.findUnique({ where: { clerkId: userId } })
      : undefined;

    const url = new URL(request.url);
    const projectId = parseInt(url.searchParams.get('projectId') ?? '', 10);
    const dealStage = url.searchParams.get('dealStage')
      ? parseInt(url.searchParams.get('dealStage') ?? '', 10)
      : undefined;
    const financingType = url.searchParams.get('financingType') ?? '';

    if (isNaN(projectId)) {
      return errorResponse('Invalid Project ID', 400, { request });
    }

    const results = await getProjectDocumentsWithAccessCheck(
      projectId,
      financingType,
      dealStage,
      neutralUser
    );

    return jsonResponse(results);
  } catch (error) {
    return errorResponse('Error fetching documents', 500, {
      request,
      extra: { error },
    });
  }
}
