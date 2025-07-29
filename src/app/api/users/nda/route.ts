import { NextRequest } from 'next/server';
import prisma from '@/libs/prisma.server';
import { getAuth } from '@clerk/nextjs/server';
import { jsonResponse, errorResponse } from '@/libs/utils.server';

/**
 * Current nda agreement revision number from environment variable.
 * Defaults to 1 if not set.
 * @constant {number}
 */
const CURRENT_REVISION = parseInt(
  process.env.NEXT_PUBLIC_CURRENT_NDA_REVISION || '1',
  10
);

/**
 * Accept or update NDA agreement for the authenticated user.
 *
 * ### Request
 * - **Method**: POST
 * - **Auth Required**: Yes (Clerk session)
 * - **Body**: None
 *
 * ### Response
 * #### 200 OK
 * ```json
 * {
 *   "meta": {
 *     "success": true,
 *     "message": "NDA accepted"
 *   },
 *   "data": {
 *     "ndaAgreement": {
 *       "id": 1,
 *       "userId": 123,
 *       "accepted": true,
 *       "revision": 1,
 *       "dateSigned": "2025-07-25T12:34:56Z"
 *     }
 *   }
 * }
 * ```
 *
 * #### 400 Bad Request
 * ```json
 * { "error": "User not authenticated" }
 * ```
 *
 * #### 500 Internal Server Error
 * ```json
 * { "error": "Error accepting NDA" }
 * ```
 *
 * @param {NextRequest} request - The Next.js request object.
 * @returns {Promise<Response>} JSON response with NDA acceptance status.
 */
export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return errorResponse('Clerk user not found', 404, { request });
  }

  const neutralUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!neutralUser) {
    return errorResponse('User not found in database', 404, { request });
  }

  try {
    // Check if NDA already exists
    const existingNDA = await prisma.nDAAgreement.findUnique({
      where: { userId: neutralUser.id },
    });

    if (existingNDA && existingNDA.revision === CURRENT_REVISION) {
      console.log(existingNDA);
      return jsonResponse({
        meta: {
          success: true,
          message: 'NDA already accepted',
        },
        data: {
          ndaAgreement: existingNDA,
        },
      });
    }

    const agreementData = {
      revision: CURRENT_REVISION,
      dateSigned: new Date(),
      accepted: true,
    };

    const ndaAgreement = existingNDA
      ? await prisma.nDAAgreement.update({
          where: { userId: neutralUser.id },
          data: agreementData,
        })
      : await prisma.nDAAgreement.create({
          data: {
            ...agreementData,
            userId: neutralUser.id,
          },
        });

    return jsonResponse({
      meta: {
        success: true,
        message: 'NDA accepted',
      },
      data: {
        ndaAgreement,
      },
    });
  } catch (error) {
    const payload = await request.json();
    return errorResponse('Error accepting NDA', 500, {
      request,
      extra: { error, userId, payload },
    });
  }
}
