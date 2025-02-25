import { getAdminFromRequest } from '@/libs/admin/utils.server';
import prisma from '@/libs/prisma.server';
import { getErrorMessage, jsonResponse } from '@/libs/utils.server';
import { isError } from 'lodash';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const adminUser = await getAdminFromRequest(request);
  if (isError(adminUser)) {
    console.error(getErrorMessage(adminUser));
    return jsonResponse({ error: getErrorMessage(adminUser) }, 401);
  }
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      milestones: true,
      investmentStats: true,
      propertyStats: true,
      equityReturnsFile: true,
      status: true,
    },
  });
  return jsonResponse(projects);
}
