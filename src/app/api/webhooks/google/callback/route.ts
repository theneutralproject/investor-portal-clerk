'use server';
import prisma from '@/libs/prisma.server';
import { type SessionData, sessionOptions } from '@/libs/session/utils';
import { jsonResponse } from '@/libs/utils.server';
import { Role } from '@prisma/client';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

/**
 * This function is called when a user is redirected back to the application from Google OAuth consent screen.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  // ?state=some_state
  // &code=4%2F0AVG7fiTk6IBM5YAKoMRpTzX4cQan33skMDsJUTJj2HYK0GofXNsr7MbFddFml3Ya_19BQA
  // &scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=0
  // &hd=neutral.us&prompt=consent
  const code = request.nextUrl.searchParams.get('code');
  const retoolNonce = request.nextUrl.searchParams.get('state');
  const data = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: `${process.env.BASE_URL}/${process.env.GOOGLE_CALLBACK_URL_SUBDIRECTORY}`,
    grant_type: 'authorization_code',
  };
  const response = await fetch(process.env.GOOGLE_ACCESS_TOKEN_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const access_token_data = (await response.json()) as { id_token: string };
  const { id_token } = access_token_data;

  // verify and extract the information in the id token
  const token_info_response = await fetch(
    `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
  );

  if (!token_info_response.ok) {
    return jsonResponse(
      await token_info_response.json(),
      token_info_response.status
    );
  }
  const { email, given_name, family_name } =
    (await token_info_response.json()) as {
      email: string;
      given_name: string;
      family_name: string;
    };
  if (!email) {
    console.error(
      'Email not found in token_info_response:',
      token_info_response
    );
    return jsonResponse({ error: 'Email not found in token' }, 400);
  }
  const lowerCaseEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: lowerCaseEmail, role: Role.ADMIN },
  });
  if (!user) {
    const nonAdmin = await prisma.user.findUnique({
      where: { email: lowerCaseEmail },
    });
    if (nonAdmin) {
      return jsonResponse(
        { error: `User with email ${email} is not an admin: ${nonAdmin.role}` },
        403
      );
    } else {
      return jsonResponse(
        { error: `Admin User with email ${email} not found` },
        404
      );
    }
  }
  if (user.lastName !== family_name || user.firstName !== given_name) {
    console.error(email, given_name, family_name);
    return jsonResponse({ error: 'User information does not match' }, 400);
  }

  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.adminUserId = user.id;
  session.adminUserEmail = user.email;
  session.adminAuthExpiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: '24h',
    }
  );
  console.log(
    `redirecting to https://neutral.retool.com/oauth/user/redirectCallback?auth_token=${token}&retoolNonce=${retoolNonce}`
  );
  // redirect to the admin UI
  redirect(
    `https://neutral.retool.com/oauth/user/redirectCallback?auth_token=${token}&retoolNonce=${retoolNonce}`
  );
}
