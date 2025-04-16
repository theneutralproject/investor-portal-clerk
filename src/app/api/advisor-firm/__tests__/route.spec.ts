import { POST } from '../route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import prisma from '@/libs/prisma.server';
import { getAuth } from '@clerk/nextjs/server';
import Logger from '@/libs/logger';

jest.mock('@clerk/nextjs/server', () => ({
  getAuth: jest.fn(),
}));

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
    },
    advisorFirm: {
      create: jest.fn(),
    },
  },
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

describe('POST /api/advisor-firm', () => {
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
  const clerkUserSession: any = {
    userId: 'clerk123',
    sessionClaims: { metadata: { investorPortalId: adminUser.id } },
  };
  const loggerLogSpy = jest.spyOn(Logger, 'log').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return advisor firm object on success', async () => {
    jest.mocked(getAuth).mockReturnValue(clerkUserSession);

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(adminUser);

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

  it('should return 401 if user is not authenticated', async () => {
    jest.mocked(getAuth).mockReturnValue({ userId: null } as any);

    const response = await POST(mockRequest as any);
    expect(response).toEqual(
      errorResponse('User not authenticated', 401, {
        request: expect.any(Object),
      })
    );
    expect(loggerLogSpy).not.toHaveBeenCalled();
  });

  it('should return 404 if user is not found', async () => {
    jest.mocked(getAuth).mockReturnValue(clerkUserSession);

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);

    const response = await POST(mockRequest as any);
    expect(response).toEqual(
      errorResponse('User not found', 404, {
        request: expect.any(Object),
      })
    );
    expect(loggerLogSpy).not.toHaveBeenCalled();
  });

  it('should return 403 if user is not admin', async () => {
    const user: any = {
      ...adminUser,
      role: 'USER',
    };
    jest.mocked(getAuth).mockReturnValue(clerkUserSession);

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(user);

    const response = await POST(mockRequest as any);
    expect(response).toEqual(
      errorResponse('Unauthorized: Only admins can create advisor firms', 403, {
        request: expect.any(Object),
      })
    );
    expect(loggerLogSpy).not.toHaveBeenCalled();
  });

  it('should return 400 if request body is invalid', async () => {
    jest.mocked(getAuth).mockReturnValue(clerkUserSession);

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(adminUser);
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
    jest.mocked(getAuth).mockReturnValue(clerkUserSession);

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(adminUser);
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
