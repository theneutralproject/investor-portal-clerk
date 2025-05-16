import { nextRequestMock } from '@/mocks/nextRequest.mock';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { GET } from '../route';
import { getPortfolioReturns } from '@/libs/returns/utils.server';

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

jest.mock('@/libs/returns/utils.server', () => ({
  getPortfolioReturns: jest.fn(),
}));

describe('GET /api/advisors/clients/client/[id]', () => {
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

  it('should return 401 if not authenticated', async () => {
    jest.mocked(getAuth).mockReturnValue({ userId: null } as any);
    const req = nextRequestMock();
    const res = await GET(req as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(errorResponse('User not authenticated', 401));
  });

  it('should return 404 if no investorPortalId in sessionClaims', async () => {
    jest
      .mocked(getAuth)
      .mockReturnValue({ userId: clerkId, sessionClaims: {} } as any);
    const req = nextRequestMock();
    const res = await GET(req as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(
      errorResponse('User not found', 404, expect.anything())
    );
  });

  it('should return 403 if user is not advisor', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest
      .mocked(prisma.user.findFirst)
      .mockResolvedValue({ ...advisorUser, role: 'USER' });
    const req = nextRequestMock();
    const res = await GET(req as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(
      errorResponse('Unauthorized or not found', 403, expect.anything())
    );
  });

  it('should return 400 if advisor firm not found', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest.mocked(prisma.advisorFirmEmployee.findFirst).mockResolvedValue(null);
    const req = nextRequestMock();
    const res = await GET(req as any, {
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

  it('should return 400 if client ID is missing or invalid', async () => {
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
      errorResponse('Must specify client ID', 400, expect.anything())
    );
  });

  it('should return 404 if organization not found', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    jest.mocked(prisma.organization.findFirst).mockResolvedValue(null);

    const res = await GET(nextRequestMock() as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(
      errorResponse('Organization not found', 404, expect.anything())
    );
  });

  it("should return 404 if organization's owner is missing", async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    jest.mocked(prisma.organization.findFirst).mockResolvedValue({
      id: 123,
      name: 'Acme Corp',
      ownedBy: { id: 999, clerkId: null },
    } as any);

    const res = await GET(nextRequestMock() as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(
      errorResponse("Organization's owner not found", 404, expect.anything())
    );
  });

  it('should return portfolio returns for a valid advisor and client organization', async () => {
    const organization: any = {
      id: 123,
      name: 'Acme Corp',
      ownedBy: { id: 999, clerkId: 'client-clerk-id' },
    };
    const userWithDeals = {
      organizationMember: [
        {
          organization: {
            deals: [
              {
                id: 1,
                investmentStats: { amount: 1000 },
                project: {
                  id: 2,
                  name: 'Project A',
                  milestones: [],
                  pictures: [],
                  equityMilestoneFiles: [],
                  investmentStats: [],
                },
              },
            ],
          },
        },
      ],
    };

    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    jest.mocked(prisma.organization.findFirst).mockResolvedValue(organization);
    jest.mocked(prisma.user.findUnique).mockResolvedValue(userWithDeals as any);
    jest.mocked(getPortfolioReturns).mockResolvedValue({
      portfolioValueToDate: 1000,
      distributionsToDate: 200,
      projectedPortfolioValue: 1200,
      equityFileLastUpdated: null,
    } as any);

    const res = await GET(nextRequestMock() as any, {
      params: Promise.resolve({ id: '123' }),
    });

    expect(res).toEqual(
      jsonResponse({
        portfolioValueToDate: 1000,
        distributionsToDate: 200,
        projectedPortfolioValue: 1200,
        equityFileLastUpdated: null,
      })
    );
  });
});
