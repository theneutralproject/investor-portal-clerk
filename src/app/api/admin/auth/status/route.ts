import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { jsonResponse } from '@/libs/utils.server';
import { isError } from 'lodash';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const adminUser = await getAdminFromRequest(request);
  if (isError(adminUser)) {
    return jsonResponse(false, 401);
  }

  return jsonResponse(true);
}
