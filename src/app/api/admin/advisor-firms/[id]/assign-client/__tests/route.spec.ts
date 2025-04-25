import { POST } from '../route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import prisma from '@/libs/prisma.server';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';

jest.mock('@/libs/admin/utils.server', () => ({
  getAdminFromRequest: jest.fn(),
}));

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
    advisorFirm: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    organization: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

describe('POST /api/admin/advisor-firms/:id/assign-client', () => {
  const mockRequest = nextRequestMock({ organizationId: 123 });
  const adminUser: any = { id: 1, email: 'admin@firm.com', role: 'ADMIN' };
  const advisorFirm = { id: 1 };
  const organization = { id: 123, name: 'Client Org', advisorFirmId: null };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if admin auth fails', async () => {
    jest
      .mocked(getAdminFromRequest)
      .mockRejectedValue(new Error('Unauthorized'));

    const response = await POST(mockRequest as any, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response).toEqual(
      errorResponse('Unauthorized', 401, { request: expect.any(Object) })
    );
  });

  it('should return 400 for invalid advisorFirmId', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    const response = await POST(mockRequest as any, {
      params: Promise.resolve({ id: 'invalid' }),
    });

    expect(response).toEqual(
      errorResponse('Invalid advisorFirmId', 400, {
        request: expect.any(Object),
      })
    );
  });

  it('should return 400 for invalid request body', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    const badRequest = nextRequestMock({ wrongKey: 456 });

    const response = await POST(badRequest as any, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response).toEqual(
      errorResponse('Invalid organizationId', 400, {
        request: expect.any(Object),
        extra: expect.any(Object),
      })
    );
  });

  it('should return 404 if advisor firm is not found', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
    jest.mocked(prisma.$transaction).mockImplementation(async fn => {
      prisma.advisorFirm.findUnique = jest.fn().mockResolvedValue(null);
      return fn(prisma);
    });

    const response = await POST(mockRequest as any, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response).toEqual(
      errorResponse('AdvisorFirm with id 1 not found', 404, {
        request: expect.any(Object),
      })
    );
  });

  it('should return 404 if organization is not found', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
    jest.mocked(prisma.$transaction).mockImplementation(async fn => {
      prisma.advisorFirm.findUnique = jest.fn().mockResolvedValue(advisorFirm);
      prisma.organization.findUnique = jest.fn().mockResolvedValue(null);
      return fn(prisma);
    });

    const response = await POST(mockRequest as any, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response).toEqual(
      errorResponse('Organization with id 123 not found', 404, {
        request: expect.any(Object),
      })
    );
  });

  it('should return 409 if organization is already assigned', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
    jest.mocked(prisma.$transaction).mockImplementation(async fn => {
      prisma.advisorFirm.findUnique = jest.fn().mockResolvedValue(advisorFirm);
      prisma.organization.findUnique = jest
        .fn()
        .mockResolvedValue({ ...organization, advisorFirmId: 1 });
      return fn(prisma);
    });

    const response = await POST(mockRequest as any, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response).toEqual(
      errorResponse(
        'Organization is already assigned to this advisor firm',
        409,
        {
          request: expect.any(Object),
        }
      )
    );
  });

  it('should assign organization and return success response', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
    jest.mocked(prisma.$transaction).mockImplementation(async fn => {
      prisma.advisorFirm.findUnique = jest.fn().mockResolvedValue(advisorFirm);
      prisma.organization.findUnique = jest
        .fn()
        .mockResolvedValue(organization);
      prisma.advisorFirm.update = jest.fn().mockResolvedValue({});
      return fn(prisma);
    });

    const response = await POST(mockRequest as any, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response).toEqual(
      jsonResponse(
        {
          message: 'Client organization assigned successfully',
          advisorFirmId: advisorFirm.id,
          organizationId: organization.id,
        },
        200
      )
    );
  });
});
