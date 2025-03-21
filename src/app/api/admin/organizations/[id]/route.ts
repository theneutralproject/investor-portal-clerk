import { getAdminFromRequest } from '@/libs/admin/utils.server';
import Logger from '@/libs/logger';
import {
  OrganizationUpdateSchema,
  zOrganizationUpdateSchema,
} from '@/libs/organization/schema';
import prisma from '@/libs/prisma.server';
import {
  getErrorMessage,
  jsonResponse,
  errorResponse,
} from '@/libs/utils.server';
import { isNumber } from 'lodash';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let orgId: number;
  try {
    const url = new URL(request.url);
    console.log(url.pathname.split('/'));
    orgId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!orgId || !isNumber(orgId)) {
      throw new Error('orgId is required in url');
    }
  } catch (__error) {
    return errorResponse(`orgId is required in url`, 400, { request });
  }

  let putData: OrganizationUpdateSchema;
  try {
    const requestBody = (await request.json()) as OrganizationUpdateSchema;
    putData = zOrganizationUpdateSchema.parse(requestBody);
  } catch (parseError) {
    Logger.log({ message: getErrorMessage(parseError) }, request);
    throw parseError;
  }

  try {
    const { address, ...orgData } = putData;
    if (address) {
      await prisma.address
        .upsert({
          where: { organizationId: orgId },
          create: { ...address, organizationId: orgId },
          update: { ...address, organizationId: orgId },
        })
        .catch(dbError => {
          Logger.log({ message: getErrorMessage(dbError) }, request);
          throw new Error('unable to update the organization');
        });
    }

    if (orgData.name?.length === 0) delete orgData.name;

    if (orgData.tin) {
      if (orgData.tin.startsWith('***-**')) {
        delete orgData.tin;
      } else if (orgData.tin.length === 0) delete orgData.tin;
      else {
        const presanitizedTIN = orgData.tin.replace(/\D/g, '');
        if (presanitizedTIN.length !== 9) {
          Logger.log(
            { message: `TIN ${orgData.tin} must be 9 digits` },
            request
          );
          return errorResponse(`TIN ${orgData.tin} must be 9 digits`, 400);
        }
        orgData.tin = presanitizedTIN;
      }
    }

    const updatedOrg = await prisma.organization.update({
      where: {
        id: orgId,
      },
      data: orgData,
      include: { address: true },
    });
    return jsonResponse(updatedOrg);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error },
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let orgId: number;
  try {
    const url = new URL(request.url);
    orgId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!orgId || !isNumber(orgId)) {
      throw new Error('orgId is required in url');
    }
  } catch (__error) {
    return errorResponse(`orgId is required in url`, 400, { request });
  }

  try {
    // check if the organization has any deals
    const deals = await prisma.deal.findMany({
      where: {
        organizationId: orgId,
      },
    });
    if (deals.length > 0) {
      return errorResponse(
        `organization has ${deals.length} deals and cannot be deleted`,
        400,
        { request }
      );
    }
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error: getErrorMessage(error) },
    });
  }

  try {
    await prisma.organization.delete({
      where: { id: orgId },
    });
    return jsonResponse({ message: 'organization deleted' });
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: { error: getErrorMessage(error) },
    });
  }
}
