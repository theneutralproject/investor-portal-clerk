import { POST } from '../route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import prisma from '@/libs/prisma.server';
import axios from 'axios';
import { getAdminFromRequest } from '@/libs/admin/utils.server';

jest.mock('@/libs/admin/utils.server', () => ({
  getAdminFromRequest: jest.fn(),
}));

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('axios');

describe('POST /api/admin/users/[id]/impersonate', () => {
  const mockRequest = nextRequestMock();
  const validParams = { id: '123' };
  const adminUser: any = { id: 1, clerkId: 'admin-123' };
  const impersonatedUser: any = { id: 123, clerkId: 'user-456' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return token if impersonation succeeds', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(impersonatedUser);

    const mockTokenResponse = { data: { token: 'actor-token-xyz' } };
    jest.mocked(axios.post).mockResolvedValue(mockTokenResponse);

    const response = await POST(mockRequest as any, {
      params: Promise.resolve(validParams),
    });
    expect(response).toEqual(jsonResponse(mockTokenResponse.data, 200));
  });

  it('should return 404 if id is missing or invalid', async () => {
    const response = await POST(mockRequest as any, {
      params: Promise.resolve({ id: 'abc' }),
    });
    expect(response).toEqual(
      errorResponse('User id not valid', 404, { request: expect.any(Object) })
    );
  });

  it('should return 401 if admin authentication fails', async () => {
    jest
      .mocked(getAdminFromRequest)
      .mockRejectedValue(new Error('Invalid token'));

    const response = await POST(mockRequest as any, {
      params: Promise.resolve(validParams),
    });
    expect(response).toEqual(
      errorResponse(
        'Failed to authenticate requesting user: Invalid token',
        401,
        {
          request: expect.any(Object),
          extra: { error: expect.any(Error) },
        }
      )
    );
  });

  it('should return 404 if user to impersonate is not found', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    const response = await POST(mockRequest as any, {
      params: Promise.resolve(validParams),
    });
    expect(response).toEqual(
      errorResponse('Requesting user not found', 404, {
        request: expect.any(Object),
      })
    );
  });
});
