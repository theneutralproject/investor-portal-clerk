import { getHubspotDealById } from '@/libs/hubspot/utils';
import { errorResponse, getErrorMessage, jsonResponse } from '@/libs/utils';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const hubspotId = new URLSearchParams(url.search).get('hubspotId');
  if (!hubspotId) {
    return errorResponse('hubspotId is required', 400);
  }
  try {
    const hsDeal = await getHubspotDealById(hubspotId);
    return jsonResponse(hsDeal);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500);
  }
}
