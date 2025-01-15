'use server';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/libs/prisma.server';
import { errorResponse, getErrorMessage, jsonResponse } from '@/libs/utils';

/**
 * Current terms revision number from environment variable.
 * Defaults to 1 if not set.
 * @constant {number}
 */
const CURRENT_REVISION = parseInt(
  process.env.CURRENT_TERMS_REVISION || '1',
  10
);

/**
 * Fetches a user from the database by their Clerk user ID.
 * Includes associated terms events.
 *
 * @async
 * @param {string} clerkUserId - The Clerk user ID to search for.
 * @returns {Promise<{ id: number, TermEvents: TermsEvents[] } | null>} The user object with terms events or null if not found.
 */
const getUser = async (clerkUserId: string) => {
  return await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: {
      id: true,
      TermsEvents: true,
    },
  });
};

/**
 * Handles a GET request to check if the user has accepted the current terms revision.
 *
 * @async
 * @function GET
 * @returns {Promise<Response>} A JSON response indicating whether the user has accepted the current revision.
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

/**
 * Handles a POST request to mark the user as having accepted the current terms revision.
 *
 * @async
 * @function POST
 * @returns {Promise<Response>} A JSON response indicating success or failure of the operation.
 */
export async function POST() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return jsonResponse({ error: 'Clerk user not found' }, 404);
  }
  const user = await getUser(clerkUser.id);

  if (!user) {
    console.error(
      `User record with clerkid ${clerkUser.id} not found in prisma (POST)`
    );
    return jsonResponse(
      {
        error: `User record with clerkid ${clerkUser.id} not found in prisma (POST)`,
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
