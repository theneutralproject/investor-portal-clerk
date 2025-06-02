'use server';

import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { UserCreateSchema } from '@/libs/user/schema';
import { createUserInDbAndHubspot } from '@/libs/user/utils.server';
import { findOrCreateClerkUser } from '@/libs/maintenance/utils.server';
import { Prisma, Role } from '@prisma/client';
import Logger from '@/libs/logger';
import {
  AdvisorEmployeeCreateSchema,
  zAdvisorEmployeeCreateSchema,
} from '@/libs/advisorFirm/schema';
import { ReferralSource } from '@/libs/hubspot/utils.client';

/**
 * POST /api/admin/advisor-firms/:id/employees
 *
 * Creates a new advisor employee and associates them with an Advisor Firm.
 * Only accessible by users with ADMIN role.
 *
 * Steps:
 * - Validates route param `id` as advisorFirmId
 * - Authenticates user via getAdminFromRequest
 * - Validates the request body using zod schema
 * - Creates Clerk user if not exists
 * - Creates the user in our DB and HubSpot
 * - Links user to advisor firm in `advisorFirmEmployee` table
 *
 * Input (request body):
 * {
 *   "role": "ADMIN" | "STAFF",
 *   "user": {
 *     "email": "jane.doe@example.com",
 *     "firstName": "Jane",
 *     "lastName": "Doe",
 *     "phoneNumber": "(123) 456-7890"
 *   }
 * }
 *
 * @param request - Next.js API Request
 * @param params - Route params with advisorFirmId
 * @returns JSON response with the advisorFirmEmployee object or error
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: advisorFirmId } = await params;
  const id = parseInt(advisorFirmId);
  if (isNaN(id)) {
    return errorResponse('Invalid advisorFirmId', 400, { request });
  }

  let adminUser;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    Logger.log(
      { message: 'Unauthorized request: admin not found', extra: { error } },
      request
    );
    return errorResponse(getErrorMessage(error), 401, { request });
  }

  const body = await request.json();

  Logger.log(
    {
      message: `Admin '${adminUser.email}' [id: ${adminUser.id}] is attempting to create an advisor employee in firm ${id}`,
      extra: body,
    },
    request
  );

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
          message: `Creating DB user and linking to advisor firm ${id}`,
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
        referralSource: ReferralSource.ADVISOR_FIRM_EMPLOYEE,
      };

      const createdUser = await createUserInDbAndHubspot(
        dbPayload,
        undefined,
        tx as Prisma.TransactionClient
      );

      const employee = await tx.advisorFirmEmployee.create({
        data: {
          advisorFirmId: id,
          userId: createdUser.id,
          role,
        },
        include: { user: true },
      });

      Logger.log(
        {
          message: `Successfully created advisor employee ${createdUser.email} in firm ${id}`,
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
