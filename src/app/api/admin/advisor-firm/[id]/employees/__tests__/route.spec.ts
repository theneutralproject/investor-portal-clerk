import { POST } from '../route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import prisma from '@/libs/prisma.server';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { findOrCreateClerkUser } from '@/libs/maintenance/utils.server';
import { createUserInDbAndHubspot } from '@/libs/user/utils.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import Logger from '@/libs/logger';

jest.mock('@/libs/admin/utils.server', () => ({
  getAdminFromRequest: jest.fn(),
}));

jest.mock('@/libs/maintenance/utils.server', () => ({
  findOrCreateClerkUser: jest.fn(),
}));

jest.mock('@/libs/user/utils.server', () => ({
  createUserInDbAndHubspot: jest.fn(),
}));

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
    advisorFirmEmployee: {
      create: jest.fn(),
    },
  },
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

describe('POST /api/admin/advisor-firms/[advisorFirmId]/employees', () => {
  const mockRequest = nextRequestMock();
  const adminUser: any = {
    id: 99,
    email: 'admin@neutral.us',
    role: 'ADMIN',
  };

  const validBody = {
    role: 'ADMIN',
    user: {
      email: 'jane.advisor@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      phoneNumber: '(123) 456-7890',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if advisorFirmId is invalid', async () => {
    const response = await POST(mockRequest as any, {
      params: Promise.resolve({ id: 'invalid' }),
    });

    expect(response).toEqual(
      errorResponse('Invalid advisorFirmId', 400, {
        request: expect.any(Object),
      })
    );
  });

  it('should log and return 401 if getAdminFromRequest fails', async () => {
    jest
      .mocked(getAdminFromRequest)
      .mockRejectedValue(new Error('Unauthorized'));

    const response = await POST(mockRequest as any, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(Logger.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Unauthorized request: admin not found',
      }),
      expect.any(Object)
    );

    expect(response).toEqual(
      errorResponse('Unauthorized', 401, {
        request: expect.any(Object),
      })
    );
  });

  it('should log and return 400 if payload is invalid', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    const badRequest = {
      ...mockRequest,
      json: () => Promise.resolve({ foo: 'bar' }),
    };

    const response = await POST(badRequest as any, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(Logger.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Failed to validate advisor employee payload',
      }),
      expect.any(Object)
    );

    expect(response).toEqual(
      errorResponse('Invalid request body', 400, {
        request: expect.any(Object),
        extra: expect.any(Object),
      })
    );
  });

  it('should log and create advisor employee successfully', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
    jest
      .mocked(findOrCreateClerkUser)
      .mockResolvedValue({ id: 'clerk-abc' } as any);

    const createdUser: any = { id: 101, email: 'jane.advisor@example.com' };
    const advisorEmployee = {
      id: 200,
      role: 'ADMIN',
      user: createdUser,
    };

    jest.mocked(prisma.$transaction).mockImplementation(async cb => {
      return cb({
        user: prisma.user,
        advisorFirmEmployee: {
          create: jest.fn().mockResolvedValue(advisorEmployee),
        },
      } as any);
    });

    jest.mocked(createUserInDbAndHubspot).mockResolvedValue(createdUser);

    const goodRequest = {
      ...mockRequest,
      json: () => Promise.resolve(validBody),
    };

    const response = await POST(goodRequest as any, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(Logger.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `Admin '${adminUser.email}' [id: ${adminUser.id}] is attempting to create an advisor employee in firm 1`,
      }),
      expect.any(Object)
    );

    expect(Logger.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `Finding or creating Clerk user for ${validBody.user.email}`,
      }),
      expect.any(Object)
    );

    expect(Logger.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `Creating DB user and linking to advisor firm 1`,
      }),
      expect.any(Object)
    );

    expect(Logger.log).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `Successfully created advisor employee ${createdUser.email} in firm 1`,
      }),
      expect.any(Object)
    );

    expect(response).toEqual(jsonResponse(advisorEmployee, 201));
  });

  it('should return 500 and skip logger on top-level catch', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
    jest
      .mocked(findOrCreateClerkUser)
      .mockResolvedValue({ id: 'clerk-abc' } as any);

    jest.mocked(prisma.$transaction).mockRejectedValue(new Error('DB failure'));

    const request = {
      ...mockRequest,
      json: () => Promise.resolve(validBody),
    };

    const response = await POST(request as any, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response).toEqual(
      errorResponse('Unable to create advisor employee', 500, {
        request: expect.any(Object),
        extra: { error: expect.any(Error) },
      })
    );
  });
});
