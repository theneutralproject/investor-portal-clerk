import prisma from '@/libs/prisma.server';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';
import { errorResponse } from '@/libs/utils.server';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { GET } from '../route';

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    $queryRaw: jest.fn(),
  },
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

    jest.mocked(prisma.$queryRaw).mockResolvedValue([
      {
        number_of_clients: 5,
        total_invested: 300000,
      },
    ]);

    const res = await GET(nextRequestMock() as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.totalInvested).toBe(300000);
    expect(json.numberOfClients).toBe(5);
  });

  it('returns 404 if no KPI data found', async () => {
    jest.mocked(getAdvisorContext).mockResolvedValue({
      advisorFirmEmployee: { advisorFirmId: 123 },
    } as any);

    jest.mocked(prisma.$queryRaw).mockResolvedValue([]);

    const res = await GET(nextRequestMock() as any);
    expect(res.status).toBe(404);
  });
});
