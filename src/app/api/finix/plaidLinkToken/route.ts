'use server';
import { getFinixUserName, getFinixPassword } from '@/libs/finix/utils';
import { errorResponse, jsonResponse } from '@/libs/utils';
import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return errorResponse('User not found', 401);
  }
  try {
    const requestBody = (await request.json()) as { slug: string };
    if (!requestBody.slug) {
      return errorResponse('Missing required slug', 400);
    }
    const slug = requestBody.slug;
    console.log(`secrets\t${getFinixUserName(slug)}:${getFinixPassword(slug)}`);
    const response = await fetch(
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
    const data = (await response.json()) as {
      token: string;
      expires_at: string;
    };
    console.log('returning Plaid Link token:', data.token);
    if (!data.token) {
      return errorResponse('Failed to get Plaid Link token', 500);
    }

    return jsonResponse(data.token);
  } catch (e) {
    console.error(e);
    return errorResponse('Failed to get Plaid Link token', 500);
  }
}
