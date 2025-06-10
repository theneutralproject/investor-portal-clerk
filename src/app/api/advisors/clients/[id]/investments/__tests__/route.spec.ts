import { nextRequestMock } from '@/mocks/nextRequest.mock';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { GET } from '../route';
import { AdvisorFirmEmployee, Organization, User } from '@prisma/client';
import { NextRequest } from 'next/server';

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    user: { findFirst: jest.fn(), findUnique: jest.fn() },
    advisorFirmEmployee: { findFirst: jest.fn() },
    organization: { findFirst: jest.fn() },
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
  const advisorUser = {
    id: investorPortalId,
    email: 'advisor@neutral.us',
    role: 'ADVISOR',
    clerkId,
  } as User;
  const advisorFirmEmployee = { advisorFirmId: 10 } as AdvisorFirmEmployee;
  const organization = {
    id: 1,
    name: 'Org A',
    ownerId: 200,
  } as Organization;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 if user is not authenticated', async () => {
    jest.mocked(getAuth).mockReturnValue({ userId: null } as any);
    const res = await GET(nextRequestMock() as NextRequest, {
      params: Promise.resolve({ id: '1' }),
    });
    expect(res).toEqual(errorResponse('User not authenticated', 401));
  });

  it('returns 404 if userId is missing in sessionClaims', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: {},
    } as any);
    const res = await GET(nextRequestMock() as NextRequest, {
      params: Promise.resolve({ id: '1' }),
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
    jest.mocked(prisma.user.findFirst).mockResolvedValue({
      ...advisorUser,
      role: 'USER',
    });
    const res = await GET(nextRequestMock() as NextRequest, {
      params: Promise.resolve({ id: '1' }),
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
    const res = await GET(nextRequestMock() as NextRequest, {
      params: Promise.resolve({ id: '1' }),
    });
    expect(res).toEqual(
      errorResponse(
        'User is not assigned to an advisor firm',
        400,
        expect.anything()
      )
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
    const res = await GET(nextRequestMock() as NextRequest, {
      params: Promise.resolve({ id: 'abc' }),
    });
    expect(res).toEqual(
      errorResponse('Organization ID not valid', 400, expect.anything())
    );
  });

  it('returns 404 if organization not found', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    jest.mocked(prisma.organization.findFirst).mockResolvedValue(null);
    const res = await GET(nextRequestMock() as NextRequest, {
      params: Promise.resolve({ id: '1' }),
    });
    expect(res).toEqual(
      errorResponse('Organization not found', 404, expect.anything())
    );
  });

  it('returns 404 if userWithDeals is missing', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest
      .mocked(prisma.user.findFirst)
      .mockImplementationOnce(() => Promise.resolve(advisorUser) as any); // for advisor
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    jest.mocked(prisma.organization.findFirst).mockResolvedValue(organization);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(null);
    const res = await GET(nextRequestMock() as NextRequest, {
      params: Promise.resolve({ id: '1' }),
    });
    expect(res).toEqual(
      errorResponse('Organization not found', 404, expect.anything())
    );
  });

  it('returns 404 if organization member has no deals', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest
      .mocked(prisma.user.findFirst)
      .mockImplementationOnce(() => Promise.resolve(advisorUser) as any); // for advisor
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    jest.mocked(prisma.organization.findFirst).mockResolvedValue(organization);
    jest.mocked(prisma.user.findFirst).mockImplementationOnce(
      () =>
        Promise.resolve({
          id: 999,
          clerkId: 'client-clerk-id',
          organizationMember: [],
        }) as any
    );
    const res = await GET(nextRequestMock() as NextRequest, {
      params: Promise.resolve({ id: '1' }),
    });
    expect(res).toEqual(
      errorResponse('Organization not found', 404, expect.anything())
    );
  });

  it('returns 404 if organization deals are empty', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest
      .mocked(prisma.user.findFirst)
      .mockImplementationOnce(() => Promise.resolve(advisorUser) as any); // for advisor
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    jest.mocked(prisma.organization.findFirst).mockResolvedValue(organization);
    jest.mocked(prisma.user.findFirst).mockImplementationOnce(
      () =>
        Promise.resolve({
          id: 999,
          clerkId: 'client-clerk-id',
          organizationMember: [{ organization: { deals: [] } }],
        }) as any
    );
    const res = await GET(nextRequestMock() as NextRequest, {
      params: Promise.resolve({ id: '1' }),
    });
    expect(res).toEqual(
      errorResponse('Organization deals not found', 404, expect.anything())
    );
  });

  it('returns deals when everything is valid', async () => {
    const deal = {
      id: 10,
      closingDate: '2024-01-01',
      status: 'ACTIVE',
      investmentStats: {
        id: 5,
        amount: 10000,
        unitType: 'SHARE',
        financingType: 'EQUITY',
      },
      project: {
        id: 124,
        name: 'Bakers Place',
      },
    };
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest
      .mocked(prisma.user.findFirst)
      .mockImplementationOnce(() => Promise.resolve(advisorUser) as any); // for advisor
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    jest.mocked(prisma.organization.findFirst).mockResolvedValue(organization);
    jest.mocked(prisma.user.findFirst).mockImplementationOnce(
      () =>
        Promise.resolve({
          id: 999,
          clerkId: 'client-clerk-id',
          organizationMember: [
            {
              organization: {
                id: 1,
                name: 'Org A',
                ownershipType: 'INDIVIDUAL',
                deals: [deal],
              },
            },
          ],
        }) as any
    );

    const res = await GET(nextRequestMock() as NextRequest, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(res).toEqual(
      jsonResponse({
        deals: [
          {
            organizationId: 1,
            organizationName: 'Org A',
            userId: 999,
            clerkId: 'client-clerk-id',
            dealId: 10,
            closingDate: '2024-01-01',
            status: 'ACTIVE',
            investmentStatsId: 5,
            amount: 10000,
            unitType: 'SHARE',
            financingType: 'EQUITY',
            ownershipType: 'INDIVIDUAL',
            projectName: 'Bakers Place',
          },
        ],
      })
    );
  });
});
