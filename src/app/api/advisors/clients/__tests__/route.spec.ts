import { GET } from '../route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { getPortfolioReturns } from '@/libs/returns/utils.server';

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    user: { findFirst: jest.fn() },
    advisorFirmEmployee: { findFirst: jest.fn() },
    advisorFirm: { findUnique: jest.fn(), count: jest.fn() },
    organization: { findMany: jest.fn(), count: jest.fn() },
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

describe('GET /api/advisors/clients', () => {
  const clerkId = 'clerk-abc';
  const investorPortalId = 100;
  const advisorUser: any = {
    id: investorPortalId,
    email: 'advisor@neutral.us',
    role: 'ADVISOR',
    clerkId,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getPortfolioReturns).mockResolvedValue({
      tableStats: {
        debt: {
          principalInvested: 20000,
          earnedToDate: 3000,
          earningsProjected: 3000,
          projectedReturn: 23000,
        },
        equity: {
          principalInvested: 10000,
          earnedToDate: 1000,
          earningsProjected: 1000,
          projectedReturn: 11000,
        },
      },
    } as any);
  });

  it('should return 401 if user is not authenticated', async () => {
    jest
      .mocked(getAuth)
      .mockReturnValue({ userId: null, sessionClaims: null } as any);
    const request = nextRequestMock();
    const res = await GET(request as any);
    expect(res).toEqual(errorResponse('User not authenticated', 401));
  });

  it('should return 404 if sessionClaims has no investorPortalId', async () => {
    jest
      .mocked(getAuth)
      .mockReturnValue({ userId: clerkId, sessionClaims: {} } as any);
    const request = nextRequestMock();
    const res = await GET(request as any);
    expect(res).toEqual(
      errorResponse('User not found', 404, {
        request: expect.any(Object),
        extra: expect.any(Object),
      })
    );
  });

  it('should return 403 if user is not an advisor', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest
      .mocked(prisma.user.findFirst)
      .mockResolvedValue({ ...advisorUser, role: 'USER' });
    const request = nextRequestMock();
    const res = await GET(request as any);
    expect(res).toEqual(
      errorResponse('Unauthorized or not found', 403, {
        request: expect.any(Object),
        extra: { user: expect.any(Object) },
      })
    );
  });

  it('should return 400 if advisor is not linked to an advisor firm', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest.mocked(prisma.advisorFirmEmployee.findFirst).mockResolvedValue(null);
    const request = nextRequestMock();
    const res = await GET(request as any);
    expect(res).toEqual(
      errorResponse('User is not assigned to an advisor firm', 400, {
        request: expect.any(Object),
        extra: { user: expect.any(Object) },
      })
    );
  });

  it('should return client summaries with pagination', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest.mocked(prisma.advisorFirmEmployee.findFirst).mockResolvedValue({
      advisorFirmId: 42,
    } as any);

    jest.mocked(prisma.organization.findMany).mockResolvedValue([
      {
        id: 1,
        name: 'Doe Investments',
        ownedBy: {
          id: 1000,
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@doe.com',
        },
        deals: [
          { investmentStats: {}, project: {} },
          { investmentStats: {}, project: {} },
        ],
      },
    ] as any);
    jest.mocked(prisma.organization.count).mockResolvedValue(1);

    const request = nextRequestMock(
      {},
      {},
      'GET',
      '/api/advisors/clients?page=1&limit=2'
    );
    const res = await GET(request as any);
    expect(res).toEqual(
      jsonResponse({
        clients: [
          {
            client: { id: 1000, name: 'Jane Doe', email: 'jane@doe.com' },
            organization: { id: 1, name: 'Doe Investments' },
            totalInvested: 30000,
            numberOfInvestments: 2,
            dealTypes: [],
            earningsToDate: 4000,
            projectedEarnings: 4000,
            totalProjectedReturn: 34000,
          },
        ],
        pagination: {
          page: 1,
          limit: 2,
          total: 1,
          hasMore: false,
        },
      })
    );
  });

  it('should filter clients by financing type using search query', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest.mocked(prisma.advisorFirmEmployee.findFirst).mockResolvedValue({
      advisorFirmId: 42,
    } as any);

    jest.mocked(prisma.organization.findMany).mockResolvedValue([
      {
        id: 1,
        name: 'Filtered Org',
        ownedBy: {
          id: 1000,
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@doe.com',
        },
        deals: [{ investmentStats: {}, project: {} }],
      },
    ] as any);
    jest.mocked(prisma.organization.count).mockResolvedValue(1);

    jest.mocked(getPortfolioReturns).mockResolvedValueOnce({
      tableStats: {
        debt: {
          principalInvested: 15000,
          earnedToDate: 1500,
          earningsProjected: 1500,
          projectedReturn: 16500,
        },
        equity: {
          principalInvested: 0,
          earnedToDate: 0,
          earningsProjected: 0,
          projectedReturn: 0,
        },
      },
    } as any);

    const request = nextRequestMock(
      {},
      {},
      'GET',
      '/api/advisors/clients?search=debt&page=1&limit=10'
    );
    const res = await GET(request as any);

    expect(res).toEqual(
      jsonResponse({
        clients: [
          {
            client: { id: 1000, name: 'Jane Doe', email: 'jane@doe.com' },
            organization: { id: 1, name: 'Filtered Org' },
            totalInvested: 15000,
            numberOfInvestments: 1,
            dealTypes: [],
            earningsToDate: 1500,
            projectedEarnings: 1500,
            totalProjectedReturn: 16500,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          hasMore: false,
        },
      })
    );
  });
});
