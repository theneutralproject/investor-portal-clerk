import { buildRedirectUrl } from '@/libs/dealflow/utils.server';
import { refreshAccessTokenFromCode } from '@/libs/docusign/utils.server';
import Logger from '@/libs/logger';
import { NextRequest } from 'next/server';

/**
 * GET route that accepts a code as queryparam and returns an access token
 * This route is called by DocuSign after the user has logged in and authorized the application.
 * It is also called if the user has already authorized the application and is trying to reauthorize.
 * It sets the access token in the cookie and redirects back to the dealflow review screen.
 *  */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  let dealId: string | undefined = undefined;
  let slug: string | undefined = undefined;

  if (state)
    [dealId, slug] = state
      .replace('dealId', '')
      .replace('projectSlug', ',')
      .split(',');
  try {
    await refreshAccessTokenFromCode(code!);
    if (dealId && slug) {
      const redirectUrl = buildRedirectUrl(slug, dealId);
      Logger.log(
        {
          message: `docusign redirect success: redirectUrl: ${redirectUrl.toString()}`,
        },
        request
      );
      return Response.redirect(redirectUrl.toString(), 303);
    }

    return Response.redirect('/dashboard', 303);
  } catch (error) {
    Logger.error(error, request, { method: 'docusign.tokenFromCode' });
    return Response.redirect('/dashboard', 500);
  }
}
