import { getAdminFromRequest } from '@/libs/admin/utils';
import prisma from '@/libs/prisma.server';
import { errorResponse, getErrorMessage, jsonResponse } from '@/libs/utils';
import { NextRequest } from 'next/server';
import { isError } from 'lodash';

export async function GET(request: NextRequest) {
  const adminUser = await getAdminFromRequest(request);
  if (isError(adminUser)) {
    console.error(getErrorMessage(adminUser));
    return jsonResponse({ error: getErrorMessage(adminUser) }, 401);
  }
  let email: string;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    email = queryParams.get('email') ?? '';
    console.log('email:', email);
    if (!email) {
      throw new Error('dealId is required in url');
    }
  } catch (__error) {
    return errorResponse(`dealId is required in url`, 400);
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
      include: {
        organizationsOwned: {
          select: {
            id: true,
            name: true,
            address: true,
            tin: true,
            isPrimary: true,
            ownershipType: true,
          },
        },
        address: true,
      },
    });
    return jsonResponse(user);
  } catch (__error) {
    return jsonResponse({ error: `User with email ${email} not found` }, 500);
  }
}
