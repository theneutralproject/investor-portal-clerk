
import prisma from '@/libs/prisma.server';
import { errorResponse } from '@/libs/utils.server';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { GET } from '../route';

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    custodianPlatform: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

describe('GET /api/admin/custodian-platform/[id]', () => {
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
        name: 'Schwab',
        logoUrl: 'https://logo.url',
      },
    ];

    jest
      .mocked(prisma.custodianPlatform.findMany as jest.Mock)
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
      .mocked(prisma.custodianPlatform.findMany)
      .mockRejectedValue(new Error('Unexpected DB error'));

    const res = await GET(nextRequestMock(), {
      params: Promise.resolve({ id: '999' }),
    });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ error: 'Internal Server Error' });
  });
});
