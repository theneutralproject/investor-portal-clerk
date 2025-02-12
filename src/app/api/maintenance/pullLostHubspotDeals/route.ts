'use server';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { getListOfHSDeals } from '@/libs/hubspot/utils.server';
import { isAdminUser } from '@/libs/maintenance/utils.server';
import prisma from '@/libs/prisma.server';
import { jsonResponse } from '@/libs/utils.server';

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) return jsonResponse({ error: 'User not found' }, 404);
  if (!(await isAdminUser(userId)))
    return jsonResponse({ error: 'User is not an admin' }, 403);

  const lostHsDeals = await getListOfHSDeals();
  if (!lostHsDeals) return jsonResponse({ error: 'No lost deals found' }, 404);
  const hsIds = lostHsDeals.map(deal => deal.id);
  console.log(hsIds);
  const updatedDeals = await prisma.deal.updateMany({
    where: { hubspotId: { in: hsIds } },
    data: {
      dealStage: { set: 6 },
      paymentMethod: { set: null },
      dateFundsSent: { set: null },
      signaturesCompletedDate: { set: null },
      paymentReferenceId: { set: null },
    },
  });
  console.log(updatedDeals);

  return jsonResponse(lostHsDeals);
}
