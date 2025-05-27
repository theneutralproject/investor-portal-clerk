'use server';

import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { clerkClient } from '@clerk/nextjs/server';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const advisorContext = await getAdvisorContext(request);

  if ('status' in advisorContext) return advisorContext;

  const { advisorFirm } = advisorContext;
  const employeeId = parseInt(id, 10);

  if (Number.isNaN(employeeId)) {
    return errorResponse('Invalid advisor employee ID', 400, {
      request,
      extra: { rawId: id },
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

  if (!employee || !employee.user) {
    return errorResponse('Advisor employee not found', 404, {
      request,
      extra: { employeeId, employee },
    });
  }

  try {
    const authClient = await clerkClient();
    await prisma.advisorFirmEmployee.delete({
      where: { id: employeeId },
    });
    await prisma.user.delete({
      where: { id: employee.user.id },
    });
    if (employee.user.clerkId) {
      await authClient.users.deleteUser(employee.user.clerkId);
    }

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
