'use server';
import { NextRequest } from 'next/server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';
import prisma from '@/libs/prisma.server';
import {
  AdvisorEmployeeCreateSchema,
  zAdvisorEmployeeCreateSchema,
} from '@/libs/advisorFirm/schema';
import Logger from '@/libs/logger';
import { findOrCreateClerkUser } from '@/libs/maintenance/utils.server';
import { Prisma, Role } from '@prisma/client';
import { UserCreateSchema } from '@/libs/user/schema';
import { ReferralSource } from '@/libs/hubspot/utils.client';
import { createUserInDbAndHubspot } from '@/libs/user/utils.server';

export async function GET(request: NextRequest) {
  const context = await getAdvisorContext(request);
  if ('status' in context) return context;

  const { advisorFirm } = context;

  const advisorEmployees = await prisma.advisorFirmEmployee.findMany({
    where: {
      advisorFirmId: advisorFirm.id,
    },
    include: {
      user: true,
    },
  });
  return jsonResponse(advisorEmployees);
}

export async function POST(request: NextRequest) {
  const context = await getAdvisorContext(request);
  if ('status' in context) return context;

  const { advisorFirm } = context;

  const body = await request.json();

  let postData: AdvisorEmployeeCreateSchema;
  try {
    postData = zAdvisorEmployeeCreateSchema.parse(body);
  } catch (error) {
    Logger.log(
      {
        message: 'Failed to validate advisor employee payload',
        extra: { error, body },
      },
      request
    );
    return errorResponse('Invalid request body', 400, {
      request,
      extra: { error, body },
    });
  }

  const { user, role } = postData;

  try {
    const cleanPhone = user.phoneNumber?.replace(/\D/g, '');
    Logger.log(
      {
        message: `Finding or creating Clerk user for ${user.email}`,
        extra: { cleanPhone },
      },
      request
    );

    const advisorEmployee = await prisma.$transaction(async tx => {
      Logger.log(
        {
          message: `Creating DB user and linking to advisor firm ${advisorFirm.id}`,
          extra: { email: user.email, role },
        },
        request
      );

      const clerkUser = await findOrCreateClerkUser(
        user.email.toLowerCase(),
        user.firstName,
        user.lastName,
        cleanPhone,
        {
          role: Role.ADVISOR,
        }
      );

      const dbPayload: UserCreateSchema & { role: Role } = {
        ...user,
        phoneNumber: cleanPhone,
        clerkId: clerkUser?.id,
        role: Role.ADVISOR,
        referralSource: ReferralSource.ADVISOR_UPDATE,
      };

      const createdUser = await createUserInDbAndHubspot(
        dbPayload,
        undefined,
        tx as Prisma.TransactionClient
      );

      const employee = await tx.advisorFirmEmployee.create({
        data: {
          advisorFirmId: advisorFirm.id,
          userId: createdUser.id,
          role,
        },
        include: { user: true },
      });

      Logger.log(
        {
          message: `Successfully created advisor employee ${createdUser.email} in firm ${advisorFirm.id}`,
          extra: { advisorEmployeeId: employee.id },
        },
        request
      );

      return employee;
    });

    return jsonResponse(advisorEmployee, 201);
  } catch (error) {
    return errorResponse('Unable to create advisor employee', 500, {
      request,
      extra: { error },
    });
  }
}
