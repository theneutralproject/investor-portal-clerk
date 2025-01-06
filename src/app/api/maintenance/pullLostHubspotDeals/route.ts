'use server';
import { getListOfHSDeals } from '@/libs/hubspot/utils';
import { isAdminUser } from '@/libs/maintenance/utils';
import prisma from '@/libs/prisma.server';
import { jsonResponse } from '@/libs/utils';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser) return jsonResponse({ error: 'User not found' }, 404);
  if (!(await isAdminUser(clerkUser.id)))
    return jsonResponse({ error: 'User is not an admin' }, 403);

  const lostHsDeals = await getListOfHSDeals();
  if (!lostHsDeals) return jsonResponse({ error: 'No lost deals found' }, 404);
  const hsIds = lostHsDeals.map(deal => deal.id);
  console.log(hsIds);
  const updatedDeals = await prisma.deal.updateMany({
    where: {
      hubspotId: {
        in: hsIds,
      },
    },
    data: {
      dealStage: {
        set: 6,
      },
      paymentMethod: { set: null },
      dateFundsSent: { set: null },
      signaturesCompletedDate: { set: null },
      paymentReferenceId: { set: null },
    },
  });
  console.log(updatedDeals);

  return jsonResponse(lostHsDeals);
}
