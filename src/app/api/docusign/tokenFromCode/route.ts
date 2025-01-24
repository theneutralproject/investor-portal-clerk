import { buildRedirectUrl } from '@/libs/dealflow/utils.server';
import { NextRequest } from 'next/server';

// GET route that accepts a code as queryparam and returns an access token
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  let dealId: string | undefined = undefined;
  let slug: string | undefined = undefined;

  if (state)
    [dealId, slug] = state
      .replace('dealId:', '')
      .replace('slug:', ',')
      .split(',');

  console.log(
    'THIS ROUTE IS INCOMPLETE: code and state from query:',
    code,
    state
  );
  const tokenResponse = await fetch(
    `${process.env.DOCUSIGN_BASE_PATH}/oauth/token?grant_type=authorization_code&code=${code}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.DOCUSIGN_CLIENT_ID}:${process.env.DOCUSIGN_CLIENT_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (!tokenResponse.ok) {
    return new Response(
      JSON.stringify({
        error: 'Failed to exchange code for access token',
      }),
      { status: 400 }
    );
  }

  const tokenData = await tokenResponse.json();
  console.log('tokenData not yet stored to session (3600):', tokenData);

  if (dealId && slug) {
    const redirectUrl = buildRedirectUrl(slug, dealId);
    return Response.redirect(redirectUrl.toString(), 303);
  }

  return Response.redirect('/dashboard', 303);
}
