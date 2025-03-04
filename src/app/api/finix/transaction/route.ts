'use server';
import { DealStage } from '@/libs/deal/schema';
import { updateDeal } from '@/libs/deal/utils.server';
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
import { PaymentMethod } from '@prisma/client';
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
  const { userId } = getAuth(request);
  if (!userId) {
    return errorResponse('User not authenticated', 401);
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return errorResponse('User not found', 404);
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
      400
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
      return errorResponse('The investment amount is invalid', 400);
    }
    if (!deal.organization.members.find(member => member.userId === user.id)) {
      return errorResponse('You are not a member of this organization', 401);
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
      Logger.error('Error transferring money 1:', request, {
        extra: { achTransferResponseData },
      });
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

    if (achTransferResponseData.state?.toUpperCase() === 'SUCCEEDED') {
      try {
        await updateDeal(
          {
            hubspotId: deal.hubspotId,
            dealStage: DealStage.CLOSED,
            closingDate: new Date(Date.now()),
            dateFundsSent: new Date(Date.now()),
            paymentMethod: PaymentMethod.ACH,
            paymentReferenceId: achTransferResponseData.id,
          },
          true
        );
      } catch (error) {
        Logger.error('unable to set deal stage to 5', request, { error });
      }
      return jsonResponse({ message: 'The ACH transfer was successful' });
    } else if (achTransferResponseData.state?.toUpperCase() === 'FAILED') {
      return errorResponse(
        'The ACH transfer failed. Please contact your Neutral Representative',
        400,
        { request, extra: { response: achTransferResponseData } }
      );
    } else {
      try {
        await updateDeal(
          {
            hubspotId: deal.hubspotId,
            dateFundsSent: new Date(Date.now()),
            paymentMethod: PaymentMethod.ACH,
            paymentReferenceId: achTransferResponseData.id,
          },
          false
        ); // update the deal without updating hubspot
      } catch (error) {
        Logger.error('unable to save ach payment', request, { error });
      }
      return jsonResponse({ message: 'The ACH transfer is pending' });
    }
  } catch (error) {
    Logger.error('Finix transaction error 2', request, { error });
    return errorResponse('Error transferring money 2', 500, {
      request,
      extra: { error },
    });
  }
}
