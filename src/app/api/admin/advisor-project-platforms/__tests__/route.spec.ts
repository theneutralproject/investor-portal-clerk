import { getAdminFromRequest } from '@/libs/admin/utils.server';
import prisma from '@/libs/prisma.server';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { GET, POST } from '../route';
import { errorResponse, jsonResponse } from '@/libs/utils.server';

jest.mock('@/libs/admin/utils.server', () => ({
  getAdminFromRequest: jest.fn(),
}));

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    advisorProjectPlatform: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

describe('/api/admin/advisor-project-platform', () => {
  describe('POST', () => {
    const mockAdminUser = { id: 999, email: 'admin@neutral.com' };

    const validPayload = {
      advisorId: 1,
      projectId: 100,
      status: 'ACTIVE',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns 401 if admin authentication fails', async () => {
      jest
        .mocked(getAdminFromRequest as jest.Mock)
        .mockRejectedValue(new Error('Unauthorized'));

      const res = await POST(nextRequestMock(validPayload) as any);
      expect(res.status).toBe(401);
    });

    it('returns 401 if admin is null', async () => {
      jest.mocked(getAdminFromRequest as jest.Mock).mockResolvedValue(null);

      const res = await GET(nextRequestMock());

      expect(res).toEqual(
        errorResponse('Restricted Access', 401, expect.anything())
      );
    });

    it('returns 400 if advisorId is invalid', async () => {
      jest
        .mocked(getAdminFromRequest as jest.Mock)
        .mockResolvedValue(mockAdminUser);

      const invalidPayload = {
        advisorId: 'not-a-number',
        status: 'UPCOMING',
      };

      const res = await POST(nextRequestMock(invalidPayload) as any);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.error).toBe('Validation failed');
      expect(json.details).toBeDefined();
    });

    it('returns 400 if status is invalid', async () => {
      jest
        .mocked(getAdminFromRequest as jest.Mock)
        .mockResolvedValue(mockAdminUser);

      const invalidPayload = {
        advisorId: 1,
        status: 'NEXT',
      };

      const res = await POST(nextRequestMock(invalidPayload) as any);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.error).toBe('Validation failed');
      expect(json.details).toBeDefined();
    });

    it('returns 400 if projectId is invalid', async () => {
      jest
        .mocked(getAdminFromRequest as jest.Mock)
        .mockResolvedValue(mockAdminUser);

      const invalidPayload = {
        advisorId: 15,
        projectId: 'nan',
        status: 'UPCOMING',
      };

      const res = await POST(nextRequestMock(invalidPayload) as any);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.error).toBe('Validation failed');
      expect(json.details).toBeDefined();
    });

    it('creates advisor project platform with valid payload', async () => {
      jest
        .mocked(getAdminFromRequest as jest.Mock)
        .mockResolvedValue(mockAdminUser);
      (prisma.advisorProjectPlatform.create as jest.Mock).mockResolvedValue({
        id: 123,
        ...validPayload,
        createdById: mockAdminUser.id,
        createdAt: new Date().toISOString(),
      });

      const res = await POST(nextRequestMock(validPayload) as any);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.advisorProjectPlatform).toMatchObject({
        advisorId: 1,
        projectId: 100,
        status: 'ACTIVE',
        createdById: mockAdminUser.id,
      });
    });

    it('returns 500 if DB throws unexpected error', async () => {
      jest
        .mocked(getAdminFromRequest as jest.Mock)
        .mockResolvedValue(mockAdminUser);
      (prisma.advisorProjectPlatform.create as jest.Mock).mockRejectedValue(
        new Error('DB failure')
      );

      const res = await POST(nextRequestMock(validPayload) as any);
      expect(res.status).toBe(500);

      const json = await res.json();
      expect(json.error).toContain('DB failure');
    });
  });

  describe('GET', () => {
    const mockUser = {
      id: 1,
      email: 'admin@example.com',
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('returns 401 if admin authentication fails', async () => {
      jest
        .mocked(getAdminFromRequest)
        .mockRejectedValue(new Error('Unauthorized'));

      const res = await GET(nextRequestMock());

      expect(res).toEqual(jsonResponse('Unauthorized', 401));
    });

    it('returns 401 if admin is null', async () => {
      jest.mocked(getAdminFromRequest as jest.Mock).mockResolvedValue(null);

      const res = await GET(nextRequestMock());

      expect(res).toEqual(
        errorResponse('Restricted Access', 401, expect.anything())
      );
    });

    it('returns advisor project platform data on success', async () => {
      jest.mocked(getAdminFromRequest as jest.Mock).mockResolvedValue(mockUser);

      const mockData = [
        {
          id: 1,
          status: 'enabled',
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

      const res = await GET(nextRequestMock());
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual({
        success: true,
        data: mockData,
      });
    });

    it('returns 500 if DB throws unexpected error', async () => {
      jest.mocked(getAdminFromRequest as jest.Mock).mockResolvedValue(mockUser);
      jest
        .mocked(prisma.advisorProjectPlatform.findMany)
        .mockRejectedValue(new Error('DB error'));

      const res = await GET(nextRequestMock());
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json).toEqual({ error: 'Internal Server Error' });
    });
  });
});
