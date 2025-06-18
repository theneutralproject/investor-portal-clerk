import prisma from '@/libs/prisma.server';
import { getPortfolioReturns } from '@/libs/returns/utils.server';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';
import { errorResponse } from '@/libs/utils.server';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { GET } from '../route';

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    deal: { findMany: jest.fn() },
    organization: { count: jest.fn() },
  },
}));

jest.mock('@/libs/returns/utils.server', () => ({
  getPortfolioReturns: jest.fn(),
}));

jest.mock('@/libs/advisorFirm/utils.server', () => ({
  getAdvisorContext: jest.fn(),
}));

describe('/api/advisors/clients/kpis', () => {
  it('returns error response if advisor context fails', async () => {
    jest
      .mocked(getAdvisorContext)
      .mockResolvedValue(errorResponse('User not authenticated', 401));

    const res = await GET(nextRequestMock() as any);
    expect(res.status).toBe(401);
  });

  it('returns KPIs with total investment and client count', async () => {
    jest.mocked(getAdvisorContext).mockResolvedValue({
      advisorFirmEmployee: { advisorFirmId: 123 },
    } as any);

    jest.mocked(prisma.deal.findMany).mockResolvedValue([
      {
        id: 1,
        investmentStats: {},
        project: {
          milestones: [],
          pictures: [],
          equityMilestoneFiles: [],
          investmentStats: {},
        },
      },
    ] as any);

    jest.mocked(prisma.organization.count).mockResolvedValue(5);

    jest.mocked(getPortfolioReturns).mockResolvedValue({
      tableStats: {
        debt: {
          principalInvested: 100000,
          earnedToDate: 0,
          earningsProjected: 0,
          projectedReturn: 0,
          accruedToDate: 0,
        },
        equity: {
          principalInvested: 200000,
          earnedToDate: 0,
          earningsProjected: 0,
          projectedReturn: 0,
          accruedToDate: 0,
        },
      },
    } as any);

    const res = await GET(nextRequestMock() as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.totalInvested).toBe(300000);
    expect(json.numberOfClients).toBe(5);
    expect(json.debtPrincipalInvested).toBe(100000);
    expect(json.equityPrincipalInvested).toBe(200000);
  });
});
