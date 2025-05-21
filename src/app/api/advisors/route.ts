'use server';
import { NextRequest } from 'next/server';
import { jsonResponse } from '@/libs/utils.server';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';

export async function GET(request: NextRequest) {
  const context = await getAdvisorContext(request);
  if ('status' in context) return context;

  const { advisorFirm } = context;
  return jsonResponse(advisorFirm);
}
