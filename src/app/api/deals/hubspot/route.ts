import {
  type HubspotDealUpdate,
  zHsUpdateDealSchema,
} from '@/libs/hubspot/schema';
import { updateHubspotDealProperties } from '@/libs/hubspot/utils.server';
import { jsonResponse } from '@/libs/utils.server';
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
      console.error('ERROR: unable to parse PUT body:\n', parseError);
      return jsonResponse({ error: 'Input data malformatted' }, 400);
    }

    const res = await updateHubspotDealProperties(deal);
    return jsonResponse(res);
  } catch (error) {
    console.error('Error updating Hubspot deal:', error);
    return jsonResponse({ error: 'Error updating Hubspot deal' }, 500);
  }
}
