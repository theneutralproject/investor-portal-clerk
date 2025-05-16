import { nextRequestMock } from '@/mocks/nextRequest.mock';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { GET } from '../route';

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    user: { findFirst: jest.fn() },
    advisorFirmEmployee: { findFirst: jest.fn() },
    $queryRawUnsafe: jest.fn(),
  },
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('@clerk/nextjs/server', () => ({
  getAuth: jest.fn(),
}));

describe('GET /api/advisors/clients/[id]/investments', () => {
  const clerkId = 'clerk-abc';
  const investorPortalId = 100;
  const advisorUser: any = {
    id: investorPortalId,
    email: 'advisor@neutral.us',
    role: 'ADVISOR',
    clerkId,
  };
  const advisorFirmEmployee: any = {
    advisorFirmId: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 if user is not authenticated', async () => {
    jest.mocked(getAuth).mockReturnValue({ userId: null } as any);
    const res = await GET(nextRequestMock() as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(errorResponse('User not authenticated', 401));
  });

  it('returns 404 if no investorPortalId', async () => {
    jest
      .mocked(getAuth)
      .mockReturnValue({ userId: clerkId, sessionClaims: {} } as any);
    const res = await GET(nextRequestMock() as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(
      errorResponse('User not found', 404, expect.anything())
    );
  });

  it('returns 403 if user is not an advisor', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest
      .mocked(prisma.user.findFirst)
      .mockResolvedValue({ ...advisorUser, role: 'USER' });
    const res = await GET(nextRequestMock() as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(
      errorResponse('Unauthorized or not found', 403, expect.anything())
    );
  });

  it('returns 400 if advisor firm not found', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest.mocked(prisma.advisorFirmEmployee.findFirst).mockResolvedValue(null);
    const res = await GET(nextRequestMock() as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(
      errorResponse(
        'User is not assigned to an advisor firm',
        400,
        expect.anything()
      )
    );
  });

  it('returns 400 if organization ID is missing', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    const res = await GET(nextRequestMock() as any, {
      params: Promise.resolve({ id: '' }),
    });
    expect(res).toEqual(
      errorResponse('Must specify organization ID', 400, expect.anything())
    );
  });

  it('returns 400 if organization ID is invalid', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    const res = await GET(nextRequestMock() as any, {
      params: Promise.resolve({ id: 'abc' }),
    });
    expect(res).toEqual(
      errorResponse('Organization ID not valid', 400, expect.anything())
    );
  });

  it('returns 404 if no deals found', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    jest.mocked(prisma.$queryRawUnsafe).mockResolvedValue([]);
    const res = await GET(nextRequestMock() as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(
      errorResponse('Organization deals not found', 404, expect.anything())
    );
  });

  it('returns deals if found', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    jest.mocked(prisma.$queryRawUnsafe).mockResolvedValue([
      {
        organizationId: 1,
        organizationName: 'Org',
        userId: 2,
        clerkId: 'user-1',
        dealId: 5,
        closingDate: '2024-01-01',
        status: 'ACTIVE',
        investmentStatsId: 3,
        amount: 5000,
        unitType: 'SHARE',
        financingType: 'EQUITY',
      },
    ]);

    const res = await GET(nextRequestMock() as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(
      jsonResponse({
        deals: [
          {
            organizationId: 1,
            organizationName: 'Org',
            userId: 2,
            clerkId: 'user-1',
            dealId: 5,
            closingDate: '2024-01-01',
            status: 'ACTIVE',
            investmentStatsId: 3,
            amount: 5000,
            unitType: 'SHARE',
            financingType: 'EQUITY',
          },
        ],
      })
    );
  });
});
