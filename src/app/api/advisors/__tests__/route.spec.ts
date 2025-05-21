import { GET } from '../route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('@/libs/advisorFirm/utils.server', () => ({
  getAdvisorContext: jest.fn(),
}));

describe('GET /api/advisors/firm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    jest
      .mocked(getAdvisorContext)
      .mockResolvedValue(errorResponse('User not authenticated', 401));

    const res = await GET(nextRequestMock() as any);
    expect(res).toEqual(errorResponse('User not authenticated', 401));
  });

  it('should return 403 if user is not advisor', async () => {
    jest.mocked(getAdvisorContext).mockResolvedValue(
      errorResponse('Unauthorized or not found', 403, {
        request: expect.anything(),
        extra: { user: expect.anything() },
      })
    );

    const res = await GET(nextRequestMock() as any);
    expect(res).toEqual(
      errorResponse('Unauthorized or not found', 403, {
        request: expect.anything(),
        extra: { user: expect.anything() },
      })
    );
  });

  it('should return 400 if user is not assigned to an advisor firm', async () => {
    jest.mocked(getAdvisorContext).mockResolvedValue(
      errorResponse('User is not assigned to an advisor firm', 400, {
        request: expect.anything(),
        extra: { user: expect.anything() },
      })
    );

    const res = await GET(nextRequestMock() as any);
    expect(res).toEqual(
      errorResponse('User is not assigned to an advisor firm', 400, {
        request: expect.anything(),
        extra: { user: expect.anything() },
      })
    );
  });

  it('should return advisor firm info when authorized', async () => {
    const advisorFirm = {
      id: 123,
      name: 'Central Wealth Management',
      createdAt: new Date('2024-01-01'),
    };

    jest.mocked(getAdvisorContext).mockResolvedValue({
      dbUser: {
        id: 100,
        role: 'ADVISOR',
        email: 'advisor@example.com',
      },
      advisorFirmEmployee: {
        advisorFirmId: 123,
        advisorFirm,
      },
      advisorFirm,
    } as any);

    const res = await GET(nextRequestMock() as any);
    expect(res).toEqual(jsonResponse(advisorFirm));
  });
});
