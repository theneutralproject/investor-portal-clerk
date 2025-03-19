'use server';
import {
  initializeFinixTransfer,
  getPlaidToken,
  getIdentity,
  getBuyerId,
} from '@/libs/finix/utils.server';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { isError } from 'lodash';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  Logger.log(
    {
      message: 'Headers Received',
      extra: request.headers,
    },
    request
  );
  const { userId: clerkId } = getAuth(request);
  if (!clerkId) {
    return errorResponse('User not authenticated', 401);
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    return errorResponse('User not found', 404, {
      request,
      extra: { clerkId },
    });
  }

  const body = (await request.json()) as {
    plaid_public_token: string;
    plaid_account_id: string;
    dealId: number;
    sessionKey: string;
    merchantId: string;
  };
  if (
    !(
      body.plaid_public_token ||
      body.plaid_account_id ||
      body.dealId ||
      body.sessionKey ||
      body.merchantId
    )
  ) {
    return errorResponse(
      'plaid_public_token, plaid_account_id, dealId and sessionKey are required',
      400,
      { request }
    );
  }
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: body.dealId },
      include: {
        investmentStats: true,
        project: true,
        organization: { include: { members: true } },
      },
    });

    const maxFinixAmount = parseFloat(
      process.env.NEXT_PUBLIC_FINIX_MAX_TRANSACTION_AMOUNT ?? '0'
    );
    if (
      !deal?.investmentStats ||
      deal.investmentStats.amount <= 0 ||
      deal.investmentStats.amount > maxFinixAmount
    ) {
      return errorResponse('The investment amount is invalid', 400, {
        request,
        extra: { deal },
      });
    }
    if (!deal.organization.members.find(member => member.userId === user.id)) {
      return errorResponse('You are not a member of this organization', 401, {
        request,
        extra: { deal },
      });
    }

    const {
      project: { name: projectName, slug },
      investmentStats,
      ...dealData
    } = deal;

    const third_party_token = await getPlaidToken(
      body.plaid_public_token,
      body.plaid_account_id,
      slug
    );
    const identity = await getIdentity(user, slug);
    const buyerId = await getBuyerId(identity, third_party_token, slug);

    // transfer money to Finix merchant
    const achTransferResponseData = await initializeFinixTransfer(
      { ...dealData, investmentStats },
      body.merchantId,
      buyerId,
      projectName,
      slug,
      body.sessionKey
    );
    if (isError(achTransferResponseData)) {
      return errorResponse('Error transferring money 1', 500, {
        request,
        extra: { response: achTransferResponseData },
      });
    }

    if (!achTransferResponseData.state && achTransferResponseData._embedded) {
      Logger.error('achTransferResponseDataError: ', request, {
        extra: {
          achTransferResponseData,
          achTransferResponseDataError:
            achTransferResponseData._embedded.errors[0]?.toString(),
        },
      });
      return errorResponse(
        achTransferResponseData._embedded.errors[0]?.message ??
          'The ACH transfer failed. Please contact your Neutral Representative',
        500,
        { request, extra: { response: achTransferResponseData } }
      );
    }

    if (achTransferResponseData.state?.toUpperCase() === 'FAILED') {
      return errorResponse(
        'The ACH transfer failed. Please contact your Neutral Representative',
        400,
        { request, extra: { response: achTransferResponseData } }
      );
    }

    return jsonResponse({ message: 'The ACH transfer is pending' });
  } catch (error) {
    Logger.error('Finix transaction error 2', request, { error });
    return errorResponse('Error transferring money 2', 500, {
      request,
      extra: { error },
    });
  }
}
