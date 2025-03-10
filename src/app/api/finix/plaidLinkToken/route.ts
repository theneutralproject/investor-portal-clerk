'use server';
import { getFinixUserName, getFinixPassword } from '@/libs/finix/utils.server';
import Logger from '@/libs/logger';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return errorResponse('User not authenticated', 401);
  }
  let requestBody: { slug: string };
  try {
    requestBody = await request.json();
    if (!requestBody.slug) {
      return errorResponse('Missing required slug', 400, { request });
    }
  } catch (e) {
    return errorResponse('Input data malformatted', 400, {
      request,
      extra: { error: e },
    });
  }
  let response: Response;
  try {
    const slug = requestBody.slug;
    response = await fetch(
      `${process.env.FINIX_BASE_URL!}/third_party_tokens`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Finix-Version': '2022-02-01',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${getFinixUserName(slug)}:${getFinixPassword(slug)}`
            ).toString('base64'),
        },
        body: JSON.stringify({
          type: 'PLAID_LINK_TOKEN',
          countries: ['USA'],
          language: 'en',
        }),
      }
    );
  } catch (e) {
    console.error('Failed to get Plaid Link token', getErrorMessage(e));
    return errorResponse('Failed to get Plaid Link token', 500, {
      request,
      extra: { error: e },
    });
  }
  try {
    const data = (await response.json()) as {
      token: string;
      expires_at: string;
    };
    if (!data.token) {
      return errorResponse(
        'Failed to get Plaid Link token from Plaid response',
        500,
        {
          request,
          extra: { data },
        }
      );
    }
    Logger.log(
      { message: `returning Plaid Link token: ${data.token}` },
      request
    );
    return jsonResponse(data.token);
  } catch (e) {
    console.error(`error parsing response from Finix`, getErrorMessage(e));
    return errorResponse('error parsing response from Finix', 500, {
      request,
      extra: { error: e },
    });
  }
}
