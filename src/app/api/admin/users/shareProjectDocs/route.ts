import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { shareProjectDocsWithUser } from '@/libs/hubspot/utils.server';
import Logger from '@/libs/logger';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { NextRequest } from 'next/server';

type PostSchema = {
  hubspotId: number;
  slug: string;
};
export async function POST(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  try {
    const postData = (await request.json()) as PostSchema;

    const hsRes = await shareProjectDocsWithUser(
      postData.hubspotId,
      postData.slug
    );
    return jsonResponse(hsRes);
  } catch (parseError) {
    return errorResponse('Input data malformatted', 400, {
      request,
      extra: { error: parseError },
    });
  }
}
