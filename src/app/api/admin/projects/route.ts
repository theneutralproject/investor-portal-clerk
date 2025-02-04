import { getAdminFromRequest } from '@/libs/admin/utils';
import prisma from '@/libs/prisma.server';
import { getErrorMessage, jsonResponse } from '@/libs/utils';
import { isError } from 'lodash';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const adminUser = await getAdminFromRequest(request);
  if (isError(adminUser)) {
    console.error(getErrorMessage(adminUser));
    return jsonResponse({ error: getErrorMessage(adminUser) }, 401);
  }
  const projects = await prisma.project.findMany();
  return jsonResponse(projects);
}
