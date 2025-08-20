import { getAdminFromRequest } from '@/libs/admin/utils.server';
import prisma from '@/libs/prisma.server';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { GET, POST } from '../route';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { CustodianPlatformCreateSchema } from '@/libs/custodianPlatform/schema';

jest.mock('@/libs/admin/utils.server', () => ({
  getAdminFromRequest: jest.fn(),
}));

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    custodianPlatform: {
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

describe('/api/admin/custodian-platforms', () => {
  describe('POST', () => {
    const mockAdminUser = { id: 999, email: 'admin@neutral.com' };

    const validPayload: CustodianPlatformCreateSchema = {
      name: 'iCapital',
      logoUrl: 'https://logo.com/url.jpg',
      status: 'ACTIVE',
      advisorIds: [1, 2],
      projectIds: [3, 4],
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

    it('returns 400 if validation fails', async () => {
      jest
        .mocked(getAdminFromRequest as jest.Mock)
        .mockResolvedValue(mockAdminUser);

      const invalidPayload = {
        name: '', // Empty name should fail validation
        logoUrl: 'invalid-url', // Invalid URL
        status: 'INVALID_STATUS', // Invalid status
      };

      const res = await POST(nextRequestMock(invalidPayload) as any);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.error).toBe('Validation failed');
      expect(json.details).toBeDefined();
    });

    it('creates custodian platform with valid payload including relations', async () => {
      jest
        .mocked(getAdminFromRequest as jest.Mock)
        .mockResolvedValue(mockAdminUser);

      (prisma.custodianPlatform.create as jest.Mock).mockResolvedValue({
        id: 123,
        name: validPayload.name,
        logoUrl: validPayload.logoUrl,
        status: validPayload.status,
        createdById: mockAdminUser.id,
        createdAt: new Date().toISOString(),
        advisorFirms: [
          { id: 1, name: 'Advisor Firm 1' },
          { id: 2, name: 'Advisor Firm 2' },
        ],
        projects: [
          { id: 3, name: 'Project 3' },
          { id: 4, name: 'Project 4' },
        ],
      });

      const res = await POST(nextRequestMock(validPayload) as any);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data).toMatchObject({
        name: validPayload.name,
        logoUrl: validPayload.logoUrl,
        status: validPayload.status,
        createdById: mockAdminUser.id,
        advisorFirms: expect.any(Array),
        projects: expect.any(Array),
      });
      expect(json.data.advisorFirms).toHaveLength(2);
      expect(json.data.projects).toHaveLength(2);

      // Verify the create was called with correct connect operations
      expect(prisma.custodianPlatform.create).toHaveBeenCalledWith({
        data: {
          name: validPayload.name,
          logoUrl: validPayload.logoUrl,
          status: validPayload.status,
          createdById: mockAdminUser.id,
          advisorFirms: {
            connect: validPayload.advisorIds?.map(id => ({ id })),
          },
          projects: {
            connect: validPayload.projectIds?.map(id => ({ id })),
          },
        },
        include: {
          advisorFirms: true,
          projects: true,
        },
      });
    });

    it('creates custodian platform without optional relations', async () => {
      jest
        .mocked(getAdminFromRequest as jest.Mock)
        .mockResolvedValue(mockAdminUser);

      const payloadWithoutRelations = {
        name: 'iCapital',
        logoUrl: 'https://logo.com/url.jpg',
        status: 'ACTIVE',
      };

      (prisma.custodianPlatform.create as jest.Mock).mockResolvedValue({
        id: 123,
        ...payloadWithoutRelations,
        createdById: mockAdminUser.id,
        createdAt: new Date().toISOString(),
        advisorFirms: [],
        projects: [],
      });

      const res = await POST(nextRequestMock(payloadWithoutRelations) as any);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data).toMatchObject({
        ...payloadWithoutRelations,
        createdById: mockAdminUser.id,
      });

      // Verify the create was called without connect operations
      expect(prisma.custodianPlatform.create).toHaveBeenCalledWith({
        data: {
          name: payloadWithoutRelations.name,
          logoUrl: payloadWithoutRelations.logoUrl,
          status: payloadWithoutRelations.status,
          createdById: mockAdminUser.id,
          advisorFirms: undefined,
          projects: undefined,
        },
        include: {
          advisorFirms: true,
          projects: true,
        },
      });
    });

    it('returns 500 if DB throws unexpected error during creation', async () => {
      jest
        .mocked(getAdminFromRequest as jest.Mock)
        .mockResolvedValue(mockAdminUser);
      (prisma.custodianPlatform.create as jest.Mock).mockRejectedValue(
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

    it('returns custodian platform data with relations on success', async () => {
      jest.mocked(getAdminFromRequest as jest.Mock).mockResolvedValue(mockUser);

      const mockData = [
        {
          id: 1,
          name: 'Platform 1',
          logoUrl: 'https://logo.url',
          status: 'ACTIVE',
          createdById: 1,
          advisorFirms: [
            {
              id: 100,
              name: 'Schwab',
              logoUrl: 'https://logo.url',
            },
          ],
          projects: [
            {
              id: 200,
              name: 'Project Alpha',
            },
          ],
          createdBy: {
            id: 1,
            email: 'admin@example.com',
          },
        },
      ];

      jest
        .mocked(prisma.custodianPlatform.findMany as jest.Mock)
        .mockResolvedValue(mockData);

      const res = await GET(nextRequestMock());
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toMatchObject({
        success: true,
        data: mockData,
      });
    });

    it('returns 500 if DB throws unexpected error', async () => {
      jest.mocked(getAdminFromRequest as jest.Mock).mockResolvedValue(mockUser);
      jest
        .mocked(prisma.custodianPlatform.findMany)
        .mockRejectedValue(new Error('DB error'));

      const res = await GET(nextRequestMock());
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json).toEqual({ error: 'Internal Server Error' });
    });
  });
});
