'use server';
import { updateDeal } from '@/libs/deal/utils.server';
import { getFinixUserName, getFinixPassword } from '@/libs/finix/utils.server';
import prisma from '@/libs/prisma.server';
import type { DealWithInvestmentStats } from '@/libs/types';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { PaymentMethod, type User } from '@prisma/client';
import { isError } from 'lodash';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return errorResponse('User not found', 404);
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
      console.error('Error transferring money 1:');
      console.error(achTransferResponseData);
      return errorResponse('Error transferring money 1', 500);
    }

    if (!achTransferResponseData.state && achTransferResponseData._embedded) {
      console.error(
        'achTransferResponseDataError: ',
        achTransferResponseData._embedded.errors[0]?.toString()
      );
      return errorResponse(
        achTransferResponseData._embedded.errors[0]?.message ??
          'The ACH transfer failed. Please contact your Neutral Representative',
        500
      );
    }

    if (achTransferResponseData.state?.toUpperCase() === 'SUCCEEDED') {
      try {
        await updateDeal(
          {
            hubspotId: deal.hubspotId,
            dealStage: 5,
            closingDate: new Date(Date.now()),
            dateFundsSent: new Date(Date.now()),
            paymentMethod: PaymentMethod.ACH,
            paymentReferenceId: achTransferResponseData.id,
          },
          true
        );
      } catch (error) {
        console.error('unable to set deal stage to 5', error);
      }
      return jsonResponse({ message: 'The ACH transfer was successful' });
    } else if (achTransferResponseData.state?.toUpperCase() === 'FAILED') {
      return errorResponse(
        'The ACH transfer failed. Please contact your Neutral Representative',
        400
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
        console.error('unable to save ach payment', error);
      }
      return jsonResponse({ message: 'The ACH transfer is pending' });
    }
  } catch (error) {
    console.error('Finix transaction error 2', error);
    return errorResponse('Error transferring money 2', 500);
  }
}

async function getPlaidToken(
  plaid_public_token: string,
  plaid_account_id: string,
  slug: string
) {
  const plaidTokenResponse = await fetch(
    `${process.env.FINIX_BASE_URL!}/third_party_tokens`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Finix-Version': '2022-02-01',
        Authorization:
          'Basic ' +
          Buffer.from(
            `${getFinixUserName(slug)}:${getFinixPassword(slug)}`
          ).toString('base64'),
      },
      body: JSON.stringify({
        plaid_public_token,
        plaid_account_id,
        type: 'PLAID_PROCESSOR_TOKEN',
      }),
    }
  );
  const { token } = (await plaidTokenResponse.json()) as {
    token: string;
    type: string;
  };
  return token;
}

async function getIdentity(user: User, slug: string) {
  const identityResponse = await fetch(
    `${process.env.FINIX_BASE_URL!}/identities`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Finix-Version': '2022-02-01',
        Authorization:
          'Basic ' +
          Buffer.from(
            `${getFinixUserName(slug)}:${getFinixPassword(slug)}`
          ).toString('base64'),
      },
      body: JSON.stringify({
        entity: {
          phone: user.phoneNumber,
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
        },
      }),
    }
  );
  const { id } = (await identityResponse.json()) as { id: string };
  return id;
}

async function getBuyerId(
  identity: string,
  third_party_token: string,
  slug: string
) {
  const paymentInstrumentResponse = await fetch(
    `${process.env.FINIX_BASE_URL!}/payment_instruments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Finix-Version': '2022-02-01',
        Authorization:
          'Basic ' +
          Buffer.from(
            `${getFinixUserName(slug)}:${getFinixPassword(slug)}`
          ).toString('base64'),
      },
      body: JSON.stringify({
        identity,
        third_party: 'PLAID',
        third_party_token,
        type: 'BANK_ACCOUNT',
      }),
    }
  );
  const paymentInstrumentResponseData =
    (await paymentInstrumentResponse.json()) as {
      id: string;
      application: string;
      currency: string;
      third_party: string;
      type: string;
      bank_account_validation_check: string;
      instrument_type: string;
    };
  return paymentInstrumentResponseData.id;
}

// transfer with fraud protection and idempotency id
async function initializeFinixTransfer(
  deal: DealWithInvestmentStats,
  merchantId: string,
  buyerId: string,
  projectName: string,
  slug: string,
  fraudSessionKey: string
) {
  console.log('merchantId', merchantId);
  const amountInCents = deal.investmentStats.amount * 100;
  const achTransferResponse = await fetch(
    `${process.env.FINIX_BASE_URL!}/transfers`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Finix-Version': '2022-02-01',
        Authorization:
          'Basic ' +
          Buffer.from(
            `${getFinixUserName(slug)}:${getFinixPassword(slug)}`
          ).toString('base64'),
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: 'USD',
        fee: 0,
        merchant: merchantId,
        source: buyerId,
        tags: {
          transactionId: deal.transactionId,
          dealHubspotId: deal.hubspotId,
          project: projectName,
        },
        idempotency_id: deal.transactionId,
        fraud_session_id: fraudSessionKey,
      }),
    }
  );

  return (await achTransferResponse.json()) as {
    type?: string;
    state?: string;
    id?: string;
    trace_id: string;
    failure_code: string;
    failure_message: string;
    _embedded?: { errors: { message: string }[] };
  };
}
