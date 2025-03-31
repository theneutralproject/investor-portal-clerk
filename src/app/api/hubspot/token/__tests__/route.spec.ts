import { POST } from '../route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import prisma from '@/libs/prisma.server';
import { auth } from '@clerk/nextjs/server';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

global.fetch = jest.fn();

describe('POST /api/hubspot/token', () => {
  const userAuth: any = { userId: 'test-user' };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no user is found', async () => {
    jest.mocked(auth).mockResolvedValue({} as any);

    const response = await POST({} as any);
    expect(response).toEqual(errorResponse('User not authenticated', 401));
  });

  it('should return 404 if user record is not found', async () => {
    jest.mocked(auth).mockResolvedValue(userAuth);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

    const response = await POST(nextRequestMock() as any);
    expect(response).toEqual(
      errorResponse(
        'User record with clerkid test-user not found in prisma (POST)',
        404,
        expect.any(Object)
      )
    );
  });

  it('should return 500 if Hubspot token is missing', async () => {
    jest.mocked(auth).mockResolvedValue(userAuth);
    delete process.env.HUBSPOT_ACCESS_TOKEN;
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      email: 'test@example.com',
    } as any);

    const response = await POST(nextRequestMock() as any);
    expect(response).toEqual(errorResponse('Missing hubspot token', 500));
  });

  it('should return 500 if user email is missing', async () => {
    process.env.HUBSPOT_ACCESS_TOKEN = 'valid-token';
    jest.mocked(auth).mockResolvedValue(userAuth);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({});
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({} as any);

    const response = await POST(nextRequestMock() as any);
    expect(response).toEqual(errorResponse('Missing user email', 500));
  });

  it('should return token if Hubspot API succeeds', async () => {
    process.env.HUBSPOT_ACCESS_TOKEN = 'valid-token';
    jest.mocked(auth).mockResolvedValue(userAuth);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    } as any);

    const mockHubspotResponse = {
      token: 'mock-token',
      expiresAt: '2025-01-01T00:00:00Z',
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockHubspotResponse),
    });

    const response = await POST(nextRequestMock() as any);
    expect(response).toEqual(
      jsonResponse({
        ...mockHubspotResponse,
        email: 'test@example.com',
      })
    );
  });

  it('should handle Hubspot API failure', async () => {
    process.env.HUBSPOT_ACCESS_TOKEN = 'valid-token';
    jest.mocked(auth).mockResolvedValue(userAuth);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    } as any);

    const errorPayload = { message: 'Something went wrong' };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue(errorPayload),
    });

    const response = await POST(nextRequestMock() as any);

    expect(response).toEqual(
      errorResponse('Hubspot token generation failed', 500)
    );
  });
});
