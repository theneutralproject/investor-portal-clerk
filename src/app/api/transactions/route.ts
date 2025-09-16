'use server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { ApiError } from 'next/dist/server/api-utils';
import { RampBill, RampTokenClaims } from '@/libs/transactions/schema';
import {
  mapRampBills,
  RAMP_TOKEN_COOKIE,
} from '@/libs/transactions/utils.server';

const RAMP_TOKEN_SECRET = process.env.RAMP_TOKEN_SECRET!;

export async function GET(request: NextRequest) {
  const { userId: clerkUserId, sessionClaims } = getAuth(request);
  if (!clerkUserId) {
    Logger.warn('User not authenticated');
    return errorResponse('User not authenticated', 401);
  }

  const userId = sessionClaims?.metadata?.investorPortalId;

  if (!userId) {
    return errorResponse('User not found', 404, {
      request,
      extra: { method: 'sessionClaims?.metadata?.investorPortalId' },
    });
  }

  const raw = (await cookies()).get(RAMP_TOKEN_COOKIE)?.value;

  if (!raw) {
    return errorResponse('Missing token', 401, {
      request,
      extra: {
        raw,
      },
    });
  }

  let accessToken;

  try {
    const decoded = jwt.verify(raw, RAMP_TOKEN_SECRET, {
      algorithms: ['HS256'],
    }) as RampTokenClaims;

    if (!decoded.scope?.startsWith('transactions:')) {
      throw new ApiError(403, 'Insufficient scope');
    }

    if (!decoded.token) {
      throw new ApiError(401, 'Invalid token');
    }

    accessToken = decoded.token;
  } catch (err: any) {
    if (err?.name === 'TokenExpiredError') {
      return errorResponse('Token expired', 401, { request });
    }

    return errorResponse('Invalid token', 401, { request });
  }

  try {
    const billResponse = await axios.get<{
      data: RampBill[];
      page: { next?: string; prev?: string };
    }>('https://api.ramp.com/developer/v1/bills', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      params: {
        vendor_id: process.env.RAMP_VENDOR_ID,
        page_size: 100,
      },
    });

    const bills = mapRampBills(billResponse.data.data);

    return jsonResponse(bills, 200);
  } catch (err: any) {
    return errorResponse(
      'An error occurred while fetching transaction history',
      err?.response?.status ?? 500,
      {
        request,
        extra: {
          rampError: err?.response?.data ?? null,
          error: {
            message: err?.message,
            code: err?.code,
            status: err?.response?.status,
          },
        },
      }
    );
  }
}
