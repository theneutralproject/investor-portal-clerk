import 'server-only';

import Logger from '../logger';
import { DealWithInvestmentStats, FinixTransferResponse } from '../types';
import { User } from '@prisma/client';

export const getFinixUserName = (projectSlug: string) => {
  switch (projectSlug) {
    case 'edison':
      return process.env.FINIX_USERNAME_EDISON!;
    case 'bakers':
      return process.env.FINIX_USERNAME_BAKERS!;
    case '519':
      return process.env.FINIX_USERNAME_519!;
    default:
      throw new Error('Invalid project slug in getFinixUserName');
  }
};

export const getFinixPassword = (projectSlug: string) => {
  switch (projectSlug) {
    case 'edison':
      return process.env.FINIX_PASSWORD_EDISON!;
    case 'bakers':
      return process.env.FINIX_PASSWORD_BAKERS!;
    case '519':
      return process.env.FINIX_PASSWORD_519!;
    default:
      throw new Error('Invalid project slug in getFinixPassword');
  }
};

// transfer with fraud protection and idempotency id
export async function initializeFinixTransfer(
  deal: DealWithInvestmentStats,
  merchantId: string,
  buyerId: string,
  projectName: string,
  slug: string,
  fraudSessionKey: string
): Promise<FinixTransferResponse> {
  Logger.log({
    message: `initializeFinixTransfer for merchantId: ${merchantId}`,
  });
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

  if (!achTransferResponse.ok) {
    Logger.error('Failed to initializeFinixTransfer', null, {
      response: await achTransferResponse.json(),
    });
  }

  return await achTransferResponse.json();
}

export async function getPlaidToken(
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

export async function getIdentity(user: User, slug: string) {
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

export async function getBuyerId(
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
