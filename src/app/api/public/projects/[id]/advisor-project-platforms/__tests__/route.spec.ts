
import prisma from '@/libs/prisma.server';
import { errorResponse } from '@/libs/utils.server';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { GET } from '../route';

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    advisorProjectPlatform: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

describe('GET /api/admin/advisor-project-platform/[id]', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 400 if projectId param is invalid', async () => {
    const res = await GET(nextRequestMock(), {
      params: Promise.resolve({ id: 'invalid' }),
    });

    expect(res).toEqual(errorResponse('projectId is invalid', 400, expect.anything()));
  });

  it('returns 200 with advisor project platforms for a valid projectId', async () => {
    const mockData = [
      {
        id: 1,
        status: 'UPCOMING',
        advisorFirm: {
          id: 100,
          name: 'Schwab',
          logoUrl: 'https://logo.url',
        },
        project: {
          id: 200,
          name: 'Project Alpha',
        },
        createdBy: {
          id: 1,
          email: 'admin@example.com',
        },
      },
    ];

    jest
      .mocked(prisma.advisorProjectPlatform.findMany as jest.Mock)
      .mockResolvedValue(mockData);

    const res = await GET(nextRequestMock(), {
      params: Promise.resolve({ id: '200' }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      success: true,
      data: mockData,
    });
  });

  it('returns 500 if database throws an error', async () => {
    jest
      .mocked(prisma.advisorProjectPlatform.findMany)
      .mockRejectedValue(new Error('Unexpected DB error'));

    const res = await GET(nextRequestMock(), {
      params: Promise.resolve({ id: '999' }),
    });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ error: 'Internal Server Error' });
  });
});
