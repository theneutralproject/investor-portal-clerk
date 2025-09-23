'use server';
import { getAuth } from '@clerk/nextjs/server';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';
import { RAMP_TOKEN_COOKIE } from '@/libs/transactions/utils.server';
import { RampTokenClaims } from '@/libs/transactions/schema';

const TOKEN_EXPIRATION = 10 * 60 * 2;
const RAMP_TOKEN_SECRET = process.env.RAMP_TOKEN_SECRET!;

export async function POST(request: NextRequest) {
  if (!RAMP_TOKEN_COOKIE) {
    return NextResponse.json(
      { error: 'Server misconfigured' },
      { status: 500 }
    );
  }

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

  try {
    const tokenResponse = await axios.post(
      'https://api.ramp.com/developer/v1/token',
      {
        grant_type: 'client_credentials',
        scope: 'bills:read',
      },
      {
        auth: {
          username: process.env.RAMP_CLIENT_ID!,
          password: process.env.RAMP_CLIENT_SECRET!,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const claims: RampTokenClaims = {
      scope: 'transactions:read',
      token: accessToken,
    };

    const token = jwt.sign(claims, RAMP_TOKEN_SECRET, {
      expiresIn: TOKEN_EXPIRATION,
      audience: 'neutral',
      issuer: 'api',
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(RAMP_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 10 * 60,
    });
    return res;
  } catch (error) {
    return errorResponse('Error fetching transaction token', 500, {
      request,
      extra: { error },
    });
  }
}
