'use server';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/libs/prisma.server';
import { errorResponse, getErrorMessage, jsonResponse } from '@/libs/utils';

const CURRENT_REVISION = parseInt(
  process.env.CURRENT_TERMS_REVISION || '1',
  10
);

const getUser = async (clerkUserId: string) => {
  return await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    include: { TermsEvents: true },
    select: {
      id: true,
      TermsEvents: true,
    },
  });
};

/**
 * @param request
 * @returns an object with the response if the user has accepted current revision
 */
export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return jsonResponse({ error: 'Clerk user not found' }, 404);
  }
  const user = await getUser(clerkUser.id);

  if (!user) {
    console.error(
      `User record with clerkid ${clerkUser.id} not found in prisma (GET)`
    );
    return jsonResponse(
      {
        error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
      },
      404
    );
  }

  const [currentRevisionTermEvent] = (user.TermsEvents || []).filter(
    tEvent => tEvent.revision === CURRENT_REVISION
  );

  return jsonResponse({
    hasAcceptedCurrentRevision: !!currentRevisionTermEvent,
  });
}

export async function POST() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return jsonResponse({ error: 'Clerk user not found' }, 404);
  }
  const user = await getUser(clerkUser.id);

  if (!user) {
    console.error(
      `User record with clerkid ${clerkUser.id} not found in prisma (GET)`
    );
    return jsonResponse(
      {
        error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
      },
      404
    );
  }

  try {
    const newTermEvent = await prisma.termsEvents.create({
      data: {
        revision: CURRENT_REVISION,
        userId: user.id,
        dateAccepted: new Date(),
      },
    });

    return jsonResponse(
      {
        termEvent: newTermEvent,
      },
      201
    );
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500);
  }
}
