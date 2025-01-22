import { getAdminFromRequest } from '@/libs/admin/utils';
import {
  type OrganizationUpdateSchema,
  zOrganizationUpdateSchema,
} from '@/libs/organization/schema';
import prisma from '@/libs/prisma.server';
import { getErrorMessage, jsonResponse } from '@/libs/utils';
import { isError } from 'lodash';
import type { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  const adminUser = await getAdminFromRequest(request);
  if (isError(adminUser)) {
    console.error(getErrorMessage(adminUser));
    return jsonResponse({ error: getErrorMessage(adminUser) }, 401);
  }

  let putData: OrganizationUpdateSchema;
  try {
    const requestBody = (await request.json()) as OrganizationUpdateSchema;
    putData = zOrganizationUpdateSchema.parse(requestBody);
  } catch (parseError) {
    console.error(
      'ERROR: unable to parse users PUT body:\n',
      getErrorMessage(parseError)
    );
    return jsonResponse({ error: getErrorMessage(parseError) }, 400);
  }

  try {
    const { address, ...orgData } = putData;
    if (address) {
      await prisma.address
        .upsert({
          where: { organizationId: orgData.id },
          create: { ...address, organizationId: orgData.id },
          update: { ...address, organizationId: orgData.id },
        })
        .catch(dbError => {
          console.error('ERROR: unable to upsert address:\n', dbError);
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
          return jsonResponse({ error: 'TIN must be 9 digits' }, 400);
        }
        orgData.tin = presanitizedTIN;
      }
    }

    const updatedOrg = await prisma.organization.update({
      where: {
        id: orgData.id,
      },
      data: orgData,
      include: { address: true },
    });
    return jsonResponse(updatedOrg);
  } catch (error) {
    console.error('unable to update organization:', getErrorMessage(error));
    return jsonResponse({ error: getErrorMessage(error) }, 500);
  }
}
