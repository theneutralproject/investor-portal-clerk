import { getAdminFromRequest } from '@/libs/admin/utils.server';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { NextRequest } from 'next/server';
import Logger from '@/libs/logger';

export async function GET(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let email: string;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    email = queryParams.get('email')?.toLowerCase() ?? '';
    console.log('email:', email);
    if (!email) {
      throw new Error('dealId is required in url');
    }
  } catch (__error) {
    return errorResponse(`dealId is required in url`, 400);
  }

  try {
    const user = await prisma.user.findUnique({
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
    if (!user)
      console.log(`User with email ${email} not found in lookup route`);
    return jsonResponse(user);
  } catch (__error) {
    return jsonResponse({ error: `User with email ${email} not found` }, 500);
  }
}
