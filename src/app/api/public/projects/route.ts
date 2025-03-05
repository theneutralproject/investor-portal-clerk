import prisma from '@/libs/prisma.server';
import { errorResponse, getErrorMessage, jsonResponse } from '@/libs/utils.server';
import { type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  let slug: string | undefined;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);

    slug = queryParams.get('slug') ?? undefined;
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500);
  }

  let projects = [];

  try {
    projects = await prisma.project.findMany({
      where: { slug: slug },
      include: {
        pictures: true,
        milestones: true,
        investmentStats: true,
        propertyStats: true,
      },
    });
  } catch (findManyError) {
    return errorResponse('Projects not found', 404, {
      request,
      extra: {
        slug,
        findManyError
      }
    });
  }

  if (!projects.length) {
    return errorResponse('Projects not found', 404, {
      request,
      extra: {
        slug,
        projects
      }
    });
  }
  return jsonResponse(projects);
}
