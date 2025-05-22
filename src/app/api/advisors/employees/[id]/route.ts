'use server';

import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { clerkClient } from '@clerk/nextjs/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const context = await getAdvisorContext(request);
  if ('status' in context) return context;

  const { advisorFirm } = context;
  const employeeId = parseInt(params.id, 10);

  if (Number.isNaN(employeeId)) {
    return errorResponse('Invalid advisor employee ID', 400, {
      request,
      extra: { rawId: params.id },
    });
  }

  const employee = await prisma.advisorFirmEmployee.findFirst({
    where: {
      id: employeeId,
      advisorFirmId: advisorFirm.id,
    },
    include: {
      user: {
        select: {
          id: true,
          clerkId: true,
        },
      },
    },
  });

  if (!employee || !employee.user || !employee.user.clerkId) {
    return errorResponse('Advisor employee not found', 404, {
      request,
      extra: { employeeId },
    });
  }

  try {
    const authClient = await clerkClient();
    await prisma.advisorFirmEmployee.delete({
      where: { id: employeeId },
    });
    await authClient.users.deleteUser(employee.user.clerkId);

    Logger.log(
      {
        message: `Deleted advisor employee ${employeeId}`,
        extra: { advisorFirmId: advisorFirm.id, employee },
      },
      request
    );

    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse('Failed to delete advisor employee', 500, {
      request,
      extra: { error },
    });
  }
}
