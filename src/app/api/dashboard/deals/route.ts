import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils';
import { currentUser } from '@clerk/nextjs';

// get deals by logged in user
export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    console.log('User not authenticated');
    return errorResponse('User not authenticated', 401);
  }

  // Get the user from the database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!dbUser) {
    console.log('User not found in database');
    return errorResponse('User not found in database', 404);
  }

  // Get all organizations where user is a member
  const userOrgs = await prisma.organization.findMany({
    where: { members: { some: { userId: dbUser.id } } },
  });

  // Get all deals for those organizations
  const deals = await prisma.deal.findMany({
    where: {
      organizationId: { in: userOrgs.map(org => org.id) },
    },
    include: {
      organization: true,
      project: {
        include: {
          pictures: true,
        }, 
      },
      investmentStats: true,
    },
  });
  
  const filteredDeals = deals.filter(deal =>
    userOrgs.some(
      org => org.id === deal.organizationId && org.ownerId === dbUser.id
    )
  );

  return jsonResponse(filteredDeals);
}
