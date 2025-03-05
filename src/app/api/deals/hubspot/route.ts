import {
  type HubspotDealUpdate,
  zHsUpdateDealSchema,
} from '@/libs/hubspot/schema';
import { updateHubspotDealProperties } from '@/libs/hubspot/utils.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import type { NextRequest } from 'next/server';
/**
 * This function is used to update any of the deal properties in hubspot
 *
 * @param request
 * @returns { message: "success" }
 */
export async function PUT(request: NextRequest) {
  try {
    const requestBody = (await request.json()) as HubspotDealUpdate;
    let deal: HubspotDealUpdate;
    try {
      deal = zHsUpdateDealSchema.parse(requestBody);
    } catch (parseError) {
      return errorResponse('Input data malformatted', 400, {
        request,
        extra: { error: parseError },
      });
    }

    const res = await updateHubspotDealProperties(deal);
    return jsonResponse(res);
  } catch (error) {
    return errorResponse('Error updating Hubspot deal', 500, {
      request,
      extra: { error },
    });
  }
}
