'use server';
import type { DealUpdateSchema } from '@/libs/deal/schema';
import { updateDeal } from '@/libs/deal/utils.server';
import {
  HSDealPropNames,
  getDealStageIntFromHSString,
  getFundingAmount,
  getProjectSlugFromDealStage,
} from '@/libs/hubspot/utils';
import prisma from '@/libs/prisma.server';
import { errorResponse, getErrorMessage, jsonResponse } from '@/libs/utils';
import { DealFinancingType, type Deal } from '@prisma/client';
import { isError } from 'lodash';
import { z } from 'zod';

const hubspotWHDealRes = z.object({
  objectId: z.number(), // hubspot deal id
  changeSource: z.string(), // we only care about changes made in the UI "CRM_UI"
  propertyName: z.string(), //we use this to figure out which deal prop we need to update on our end
  propertyValue: z.string(),
});
const arrHubspotWHRes = z.array(hubspotWHDealRes);

/* 
    this webhook is called when a deal property is changed in hubspot 
    [dealstage, amount, investment_entity, dealname, dealtype, financing_type, closedate]
**/
export async function POST(req: Request) {
  try {
    const payload = arrHubspotWHRes.parse(await req.json())[0];
    if (
      !(
        req.headers.get('X-HubSpot-Signature-Version') &&
        req.headers.get('X-HubSpot-Signature')
      )
    ) {
      console.error(`HS webhook request is not coming from HS!`);
      return new Response(
        JSON.stringify({ message: 'Ignoring HubSpot webhook' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (
      !payload?.propertyValue ||
      !(payload?.changeSource === 'CRM_UI' || payload?.changeSource === 'CRM')
    ) {
      console.log(
        `Ignoring HubSpot webhook: change source ${payload?.changeSource} is not the HS UI, or property value is missing.`
      );
      return new Response(
        JSON.stringify({ message: 'Ignoring HubSpot webhook' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    console.log('HS payload:', payload);
    const dealBody: DealUpdateSchema = {
      hubspotId: payload.objectId.toString(),
    };
    let updateProjectFunding = false; // flag to update project funding tracker
    switch (payload.propertyName) {
      case HSDealPropNames.dealstage.toString():
        dealBody.dealStage = getDealStageIntFromHSString(payload.propertyValue);
        updateProjectFunding = dealBody.dealStage >= 3;
        break;
      case HSDealPropNames.amount.toString():
        dealBody.investmentStats = {
          amount: parseFloat(payload.propertyValue),
        };
        break;
      case HSDealPropNames.financing_type.toString():
        dealBody.investmentStats = {
          financingType:
            payload.propertyValue in DealFinancingType
              ? (payload.propertyValue as keyof typeof DealFinancingType)
              : 'equity',
        };
        break;
      case HSDealPropNames.closedate.toString():
        dealBody.closingDate = new Date(payload.propertyValue);
        break;
    }

    if (updateProjectFunding) {
      const projectSlugToUpdate = getProjectSlugFromDealStage(
        payload.propertyValue
      );
      if (!isError(projectSlugToUpdate)) {
        const amountRaised = await getFundingAmount(projectSlugToUpdate);
        if (isError(amountRaised)) {
          console.error(
            `unable to fetch deal amount raised for project ${projectSlugToUpdate}: ${amountRaised.message}`
          );
        } else {
          console.log(
            `attempting to update project funding tracker for ${projectSlugToUpdate} to ${amountRaised}`
          );

          const project = await prisma.project.findUnique({
            where: { slug: projectSlugToUpdate },
          });
          if (!project) {
            console.error(`project for slug ${projectSlugToUpdate} not found`);
            return errorResponse(
              `project with name ${projectSlugToUpdate} does not exist`,
              500
            );
          }
          try {
            await prisma.projectInvestmentStats.update({
              where: { projectId: project.id },
              data: { investmentRaised: amountRaised },
            });
          } catch (error) {
            console.error(
              `unable to update project funding tracker for ${projectSlugToUpdate}: ${getErrorMessage(error)}. Continuing to update deal`
            );
          }
        }
      }
    }
    let updatedDeal: Deal;
    try {
      updatedDeal = await updateDeal(dealBody, false);
    } catch (error) {
      console.log(
        `Unable to update deal with HS ID ${dealBody.hubspotId}. It was likely manually created in HS and does not exist in the DB`
      );
      const deal = await prisma.deal.findFirst({
        where: { hubspotId: dealBody.hubspotId },
      });
      if (!deal) {
        return jsonResponse(
          `Unable to update deal with HS ID ${dealBody.hubspotId}. It was likely manually created in HS and does not exist in the DB`
        );
      } else {
        console.error(error);
        return errorResponse(
          `Unable to update deal with HS ID ${dealBody.hubspotId}. It exists in the DB but could not be updated`,
          500
        );
      }
    }

    return jsonResponse(updatedDeal);
  } catch (error) {
    console.error('Catch All Error parsing HubSpot webhook: ', error);
    return errorResponse('Error parsing HubSpot webhook', 500);
  }
}
