import { GET } from '../route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    advisorFirmEmployee: { findMany: jest.fn() },
  },
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('@/libs/advisorFirm/utils.server', () => ({
  getAdvisorContext: jest.fn(),
}));

describe('GET /api/advisors/team', () => {
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

  it('should return 400 if advisor firm not found', async () => {
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

  it('should return advisor firm employees with user info', async () => {
    const mockEmployees = [
      {
        id: 1,
        advisorFirmId: 123,
        userId: 101,
        role: 'ADMIN',
        user: {
          id: 101,
          email: 'admin@firm.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
      {
        id: 2,
        advisorFirmId: 123,
        userId: 102,
        role: 'STAFF',
        user: {
          id: 102,
          email: 'staff@firm.com',
          firstName: 'Jane',
          lastName: 'Smith',
        },
      },
    ];

    jest.mocked(getAdvisorContext).mockResolvedValue({
      dbUser: {
        id: 100,
        role: 'ADVISOR',
        email: 'advisor@example.com',
      },
      advisorFirmEmployee: {
        advisorFirmId: 123,
        advisorFirm: {
          id: 123,
          name: 'Test Firm',
        },
      },
      advisorFirm: {
        id: 123,
        name: 'Test Firm',
      },
    } as any);

    jest
      .mocked(prisma.advisorFirmEmployee.findMany)
      .mockResolvedValue(mockEmployees as any);

    const res = await GET(nextRequestMock() as any);

    expect(res).toEqual(jsonResponse(mockEmployees));
    expect(prisma.advisorFirmEmployee.findMany).toHaveBeenCalledWith({
      where: { advisorFirmId: 123 },
      include: { user: true },
    });
  });
});
