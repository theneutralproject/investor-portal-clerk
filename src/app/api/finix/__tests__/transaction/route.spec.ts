import { getAuth } from '@clerk/nextjs/server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { POST } from '../../transaction/route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import {
  DealFinancingType,
  DealUnitType,
  DealOwnershipType,
} from '@prisma/client';
import Logger from '@/libs/logger';
import { debtDealFixture } from '@/fixtures/deals/deals.fixture';

jest.mock('@clerk/nextjs/server', () => ({
  getAuth: jest.fn(),
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('@/libs/finix/utils.server', () => ({
  getFinixUserName: jest.fn(() => 'testUser'),
  getFinixPassword: jest.fn(() => 'testPass'),
  initializeFinixTransfer: jest.fn(),
  getIdentity: jest.fn(),
  getBuyerId: jest.fn(),
  getPlaidToken: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
}));

global.fetch = jest.fn();

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
    deal: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
    $queryRaw: jest.fn(),
  },
}));

jest.mock('@/libs/deal/utils.server', () => ({
  updateDeal: jest.fn(),
}));

import prisma from '@/libs/prisma.server';
import { initializeFinixTransfer } from '@/libs/finix/utils.server';
import { updateDeal } from '@/libs/deal/utils.server';

const mockUser: any = {
  id: 1,
  clerkId: 'test-user',
  email: 'test@example.com',
};

const dealFixture = {
  ...debtDealFixture,
  investmentStats: {
    ...debtDealFixture.investmentStats,
    amount: 9000,
  },
  organization: {
    members: [
      {
        userId: mockUser.id,
      },
    ],
  },
};

jest.mock('uncrypto', () => ({
  default: {
    subtle: global.crypto.subtle,
    randomUUID: () => 'mock-uuid',
    getRandomValues: (array: Uint8Array) =>
      global.crypto.getRandomValues(array),
  },
  getRandomValues: (array: Uint8Array) => global.crypto.getRandomValues(array),
  randomUUID: () => 'mock-uuid',
  subtle: global.crypto.subtle,
}));

describe('POST /api/finix/transaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no user is authenticated', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: null });
    const requestMock: any = nextRequestMock(
      {}, // Body (empty for this test)
      { Authorization: 'Bearer test-token' } // Headers
    );

    const response = await POST(requestMock);
    expect(response).toEqual(errorResponse('User not authenticated', 401));
  });

  it('should return 404 if user does not exist in database', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 1 });
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
    const requestMock: any = nextRequestMock(
      {}, // Body (empty for this test)
      { Authorization: 'Bearer test-token' } // Headers
    );

    const response = await POST(requestMock);
    expect(response).toEqual(errorResponse('User not found', 404));
  });

  it('should return 400 if required fields are missing', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 1 });
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUser);

    const response = await POST(nextRequestMock({}) as any);
    expect(response).toEqual(
      errorResponse(
        'plaid_public_token, plaid_account_id, dealId and sessionKey are required',
        400
      )
    );
  });

  it('should return 400 if investment amount is invalid', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 1 });
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUser);
    jest.spyOn(prisma.deal, 'findUnique').mockResolvedValueOnce({
      ...dealFixture,
      investmentStats: {
        id: 101,
        dealId: 123,
        amount: 0, // Invalid amount
        financingType: DealFinancingType.promissory_note_now,
        unitType: DealUnitType.AUNIT,
        ownershipType: DealOwnershipType.JOINT,
        numberAUnits: 10,
        numberCUnits: 5,
        debtInterestRatePerc: 5.5,
        debtPaymentFreq: 'monthly',
        debtTermMonthsMax: 60,
        debtTermMonthsMin: 12,
        equityTermMonths: 36,
        debtPaymentFreqMonths: 1,
        equityPreferredReturn: 8.5,
        dateCreated: new Date(),
        dateUpdated: new Date(),
      },
    });

    const response = await POST(
      nextRequestMock({
        plaid_public_token: 'plaid-token',
        plaid_account_id: 'account-123',
        dealId: 123,
        sessionKey: 'session-key',
        merchantId: 'merchant-abc',
      }) as any
    );

    expect(response).toEqual(
      errorResponse('The investment amount is invalid', 400)
    );
  });

  it('should return 401 if user is not a member of the deal organization', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 1 });
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUser);
    jest.spyOn(prisma.deal, 'findUnique').mockResolvedValueOnce({
      ...dealFixture,
      organization: { members: [] }, // No matching user
    } as any);

    const response = await POST(
      nextRequestMock({
        plaid_public_token: 'plaid-token',
        plaid_account_id: 'account-123',
        dealId: 123,
        sessionKey: 'session-key',
        merchantId: 'merchant-abc',
      }) as any
    );

    expect(response).toEqual(
      errorResponse('You are not a member of this organization', 401)
    );
  });

  it('should return 500 if Plaid token retrieval fails', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 1 });
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUser);
    jest.spyOn(prisma.deal, 'findUnique').mockResolvedValueOnce(dealFixture);

    global.fetch = jest.fn().mockRejectedValue(new Error('Plaid API Error'));

    const response = await POST(
      nextRequestMock({
        plaid_public_token: 'plaid-token',
        plaid_account_id: 'account-123',
        dealId: 123,
        sessionKey: 'session-key',
        merchantId: 'merchant-abc',
      }) as any
    );

    expect(response).toEqual(errorResponse('Error transferring money 2', 500));
  });

  it('should return a successful ACH transfer response', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 1 });
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUser);
    jest.spyOn(prisma.deal, 'findUnique').mockResolvedValue(dealFixture);

    (initializeFinixTransfer as jest.Mock).mockResolvedValueOnce({
      state: 'SUCCEEDED',
      id: 'transfer-xyz',
    });

    const response = await POST(
      nextRequestMock({
        plaid_public_token: 'plaid-token',
        plaid_account_id: 'account-123',
        dealId: 123,
        sessionKey: 'session-key',
        merchantId: 'merchant-abc',
      }) as any
    );

    expect(response).toEqual(
      jsonResponse({ message: 'The ACH transfer was successful' })
    );
  });

  it('should return a pending ACH transfer response', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 1 });
    (updateDeal as jest.Mock).mockReturnValue({ success: true });
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUser);
    jest
      .spyOn(prisma.deal, 'findUnique')
      .mockResolvedValue({ ...dealFixture, hubspotId: 123 });
    jest
      .spyOn(prisma.deal, 'findUnique')
      .mockResolvedValue({ ...dealFixture, hubspotId: 123 });

    (initializeFinixTransfer as jest.Mock).mockResolvedValueOnce({
      state: 'PENDING',
      id: 'transfer-1234',
    });

    const response = await POST(
      nextRequestMock({
        plaid_public_token: 'plaid-token',
        plaid_account_id: 'account-123',
        dealId: 123,
        sessionKey: 'session-key',
        merchantId: 'merchant-abc',
      }) as any
    );

    expect(response).toEqual(
      jsonResponse({ message: 'The ACH transfer is pending' })
    );
  });

  it('should return an error if ACH transfer fails with failure_code and failure_message', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 1 });
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(mockUser);
    jest.spyOn(prisma.deal, 'findUnique').mockResolvedValueOnce(dealFixture);

    const failureCode = 'insufficient_funds';
    const failureMessage = 'Insufficient funds in source account';

    (initializeFinixTransfer as jest.Mock).mockResolvedValueOnce({
      state: 'FAILED',
      id: 'transfer-xyz',
      failure_code: failureCode,
      failure_message: failureMessage,
    });

    const response = await POST(
      nextRequestMock({
        plaid_public_token: 'plaid-token',
        plaid_account_id: 'account-123',
        dealId: 123,
        sessionKey: 'session-key',
        merchantId: 'merchant-abc',
      }) as any
    );

    expect(Logger.warn).toHaveBeenCalledWith(
      'Finix transfer failed',
      expect.any(Object),
      {
        extra: {
          failureCode,
          failureMessage,
        },
      }
    );

    expect(response).toEqual(
      errorResponse(
        `The ACH transfer failed due to: ${failureMessage}. Please contact your Neutral Representative`,
        400
      )
    );
  });
});
