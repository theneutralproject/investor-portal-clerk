import { buildRedirectUrl } from '@/libs/dealflow/utils.server';
import { accessTokenFromCode } from '@/libs/docusign/utils';
import { NextRequest } from 'next/server';

// GET route that accepts a code as queryparam and returns an access token
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
    await accessTokenFromCode(code!);
    if (dealId && slug) {
      const redirectUrl = buildRedirectUrl(slug, dealId);
      console.log('redirectUrl:', redirectUrl.toString());
      return Response.redirect(redirectUrl.toString(), 303);
    }

    return Response.redirect('/dashboard', 303);
  } catch (error) {
    console.error('Error in docusign tokenFromCode route:', error);
    return Response.redirect('/dashboard', 500);
  }
}
