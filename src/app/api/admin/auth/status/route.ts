import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { jsonResponse } from '@/libs/utils.server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (__error) {
    return jsonResponse(false, 401);
  }
  return jsonResponse(true);
}
