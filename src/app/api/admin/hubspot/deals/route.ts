import {
  getDealStageIntFromHSString,
  getFinancingType,
  getHubspotDealById,
  getProjectSlugFromDealStage,
} from '@/libs/hubspot/utils.server';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { SimplePublicObjectWithAssociations } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const hubspotId = new URLSearchParams(url.search).get('hubspotId');
  if (!hubspotId) {
    return errorResponse('hubspotId is required', 400);
  }
  let hsDeal: SimplePublicObjectWithAssociations | null = null;
  try {
    hsDeal = await getHubspotDealById(hubspotId);
  } catch (error) {
    console.error(getErrorMessage(error));
    return errorResponse(getErrorMessage(error), 500);
  }

  let projectId: number | undefined;
  let projectName: string | undefined;
  if (hsDeal.properties.dealstage) {
    const projectSlug = getProjectSlugFromDealStage(
      hsDeal.properties.dealstage
    );
    if (projectSlug) {
      try {
        const project = await prisma.project.findFirst({
          where: { slug: projectSlug },
        });
        if (project) {
          projectId = project.id;
          projectName = project.name;
        }
      } catch (error) {
        console.error(getErrorMessage(error));
      }
    }
  }
  const deal = {
    hubspotId,
    projectId,
    projectName,
    dealStage: hsDeal.properties.dealstage
      ? getDealStageIntFromHSString(hsDeal.properties.dealstage)
      : 0,
    amount: hsDeal.properties.amount ? parseFloat(hsDeal.properties.amount) : 0,
    closingDate: hsDeal.properties.closedate
      ? new Date(hsDeal.properties.closedate)
      : null,
    signaturesCompletedDate: hsDeal.properties.signatures_completed_date
      ? new Date(hsDeal.properties.signatures_completed_date)
      : null,
    financingType: getFinancingType(hsDeal.properties.financing_type ?? ''),
  };
  return jsonResponse(deal);
}
