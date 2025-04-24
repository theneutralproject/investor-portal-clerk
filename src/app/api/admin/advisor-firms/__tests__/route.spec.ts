import { GET, POST } from '../route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import prisma from '@/libs/prisma.server';
import Logger from '@/libs/logger';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { APIError } from '@/libs/types';
import { AdvisorFirm, AdvisorFirmEmployee, Organization } from '@prisma/client';

jest.mock('@/libs/admin/utils.server', () => ({
  getAdminFromRequest: jest.fn(),
}));

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
    },
    advisorFirm: {
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

describe('/api/advisor-firm', () => {
  const mockRequest = nextRequestMock();
  const validBody = {
    name: 'Summit Capital',
    logoUrl: 'https://example.com/logo.png',
  };
  const adminUser: any = {
    id: 1,
    email: 'admin@firm.com',
    role: 'ADMIN',
  };
  const loggerLogSpy = jest.spyOn(Logger, 'log').mockImplementation(() => {});

  describe('POST /api/advisor-firm', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns 400 error when token is not provided', async () => {
      const error = new APIError('No token provided', 400);
      jest.mocked(getAdminFromRequest).mockRejectedValue(error);

      const response = await POST(mockRequest as any);
      expect(response).toEqual(
        errorResponse(error.message, error.status, {
          request: expect.any(Object),
        })
      );
    });

    it('returns 400 error when invalid token is provided', async () => {
      const error = new APIError('Invalid or expired token', 400);
      jest.mocked(getAdminFromRequest).mockRejectedValue(error);

      const response = await POST(mockRequest as any);
      expect(response).toEqual(
        errorResponse(error.message, error.status, {
          request: expect.any(Object),
        })
      );
    });
    it('returns 400 error when token has no email', async () => {
      const error = new APIError('No email found in token', 400);
      jest.mocked(getAdminFromRequest).mockRejectedValue(error);

      const response = await POST(mockRequest as any);
      expect(response).toEqual(
        errorResponse(error.message, error.status, {
          request: expect.any(Object),
        })
      );
    });

    it('should return 403 if user is not admin', async () => {
      const error = new APIError('Admin user not found', 403);
      jest.mocked(getAdminFromRequest).mockRejectedValue(error);
      const user: any = {
        ...adminUser,
        role: 'USER',
      };

      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(user);

      const response = await POST(mockRequest as any);
      expect(response).toEqual(
        errorResponse(error.message, error.status, {
          request: expect.any(Object),
        })
      );
    });

    it('should return advisor firm object on success', async () => {
      jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

      const createFirmPayload = {
        name: validBody.name,
        logoUrl: validBody.logoUrl,
      };

      const createdFirm = {
        id: 1,
        ...createFirmPayload,
        primaryContactId: null,
        dateCreated: new Date(),
        dateUpdated: new Date(),
      };

      jest.spyOn(prisma.advisorFirm, 'create').mockResolvedValue(createdFirm);

      const goodRequest = {
        ...mockRequest,
        json: () => Promise.resolve(createFirmPayload),
      };

      const response = await POST(goodRequest as any);

      expect(loggerLogSpy).toHaveBeenCalledWith(
        {
          message: `User '${adminUser.email}' with id: '${adminUser.id}' is attempting to create new advisor firm`,
          extra: createFirmPayload,
        },
        goodRequest
      );
      expect(response).toEqual(jsonResponse(createdFirm));
    });

    it('should return 400 if request body is invalid', async () => {
      jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

      const createFirmPayload = { invalidField: true };

      const badRequest = {
        ...mockRequest,
        json: () => Promise.resolve(createFirmPayload),
      };

      const response = await POST(badRequest as any);
      expect(response).toEqual(
        errorResponse('Invalid request body', 400, {
          request: expect.any(Object),
          extra: expect.any(Object),
        })
      );
      expect(loggerLogSpy).toHaveBeenCalledWith(
        {
          message: `User '${adminUser.email}' with id: '${adminUser.id}' is attempting to create new advisor firm`,
          extra: createFirmPayload,
        },
        badRequest
      );
    });

    it('should return 500 if create throws', async () => {
      jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
      jest
        .spyOn(prisma.advisorFirm, 'create')
        .mockRejectedValue(new Error('Database error'));

      const request = {
        ...mockRequest,
        json: () => Promise.resolve(validBody),
      };

      const response = await POST(request as any);
      expect(response).toEqual(
        errorResponse('Database error', 500, { request: expect.any(Object) })
      );
      expect(loggerLogSpy).toHaveBeenCalled();
    });
  });

  describe('GET /api/admin/advisor-firms', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return 401 if getAdminFromRequest fails', async () => {
      const error = new APIError('Unauthorized', 401);
      jest.mocked(getAdminFromRequest).mockRejectedValue(error);

      const response = await GET(mockRequest as any);
      expect(response).toEqual(
        errorResponse(error.message, error.status, {
          request: expect.any(Object),
        })
      );
    });

    it('should return advisor firms list on success', async () => {
      jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

      const firms: Array<
        AdvisorFirm & {
          employees: AdvisorFirmEmployee[];
          clientOrganizations: Organization[];
        }
      > = [
        {
          id: 1,
          name: 'Summit Capital',
          logoUrl: 'https://example.com/logo.png',
          employees: [],
          primaryContactId: null,
          clientOrganizations: [],
          dateCreated: new Date(),
          dateUpdated: new Date(),
        },
      ];

      jest.mocked(prisma.advisorFirm.findMany).mockResolvedValue(firms);

      const response = await GET(mockRequest as any);
      expect(response).toEqual(jsonResponse(firms));
      expect(Logger.log).toHaveBeenCalledWith(
        {
          message: `Admin ${adminUser.email} fetched ${firms.length} advisor firms`,
          extra: { userId: adminUser.id },
        },
        mockRequest
      );
    });

    it('should return 500 on unexpected error', async () => {
      jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
      jest.mocked(prisma.advisorFirm.findMany).mockRejectedValue(new Error());

      const response = await GET(mockRequest as any);
      expect(response).toEqual(
        errorResponse('Failed to fetch advisor firms', 500, {
          request: expect.any(Object),
          extra: { error: expect.any(Error) },
        })
      );
      expect(Logger.error).toHaveBeenCalled();
    });
  });
});
