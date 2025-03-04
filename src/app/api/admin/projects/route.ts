import { getAdminFromRequest } from '@/libs/admin/utils.server';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { getErrorMessage, jsonResponse } from '@/libs/utils.server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
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
