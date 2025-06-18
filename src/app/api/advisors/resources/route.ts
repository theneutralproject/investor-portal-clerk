'use server';
import { NextRequest } from 'next/server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';
import Logger from '@/libs/logger';
import { ResourceResponse, WebFlowContent } from '@/libs/types';

export async function GET(request: NextRequest) {
  const advisorContext = await getAdvisorContext(request);

  if ('status' in advisorContext) return advisorContext;

  const { searchParams } = request.nextUrl;
  const offset = searchParams.get('offset') || 0;
  const limit = searchParams.get('limit') || 100;
  const collection = searchParams.get('collectionId') || 'resource';

  // This should be a object of webflow collection ids
  // To be filled for new ones.
  const collections: { [x: string]: string } = {
    resource: process.env.WEBFLOW_RESOURCE_CENTER_COLLECTION || '',
  };
  const collectionId = collections[collection];

  const url = `https://api.webflow.com/v2/collections/${collectionId}/items?offset=${offset}&limit=${limit}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.WEBFLOW_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    errorResponse('Failed to fetch webflow collection data', 500, {
      request,
      extra: {
        offset,
        limit,
        collection,
        collectionId,
      },
    });
  }

  const data: ResourceResponse = await res.json();

  Logger.log({
    extra: {
      offset,
      limit,
      collection,
      collectionId,
    },
    message: 'WebFlow: data loaded',
  });

  const resources: WebFlowContent = data.items?.reduce((acc, resource) => {
    const resourceId = resource.fieldData['resource-type-label'];
    (acc[resourceId] ||= []).push(resource);
    return acc;
  }, {} as WebFlowContent);

  return jsonResponse(resources);
}
