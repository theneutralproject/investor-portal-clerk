import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { shareProjectDocsWithUser } from '@/libs/hubspot/utils.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { isError } from 'lodash';
import { NextRequest } from 'next/server';

type PostSchema = {
  hubspotId: number;
  slug: string;
};
export async function POST(request: NextRequest) {
  const adminUser = await getAdminFromRequest(request);
  if (isError(adminUser)) {
    console.error(getErrorMessage(adminUser));
    return jsonResponse({ error: getErrorMessage(adminUser) }, 401);
  }

  try {
    const postData = (await request.json()) as PostSchema;
    console.log('postData:', postData);

    const hsRes = await shareProjectDocsWithUser(
      postData.hubspotId,
      postData.slug
    );
    return jsonResponse(hsRes);
  } catch (parseError) {
    console.error('ERROR: unable to parse POST body:\n', parseError);
    return errorResponse('Input data malformatted', 400);
  }
}
