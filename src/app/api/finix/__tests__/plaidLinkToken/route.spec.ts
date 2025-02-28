import { getAuth } from '@clerk/nextjs/server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { POST } from '../../plaidLinkToken/route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';

jest.mock('@clerk/nextjs/server', () => ({
  getAuth: jest.fn(),
}));

jest.mock('@/libs/finix/utils.server', () => ({
  getFinixUserName: jest.fn(),
  getFinixPassword: jest.fn(),
}));

global.fetch = jest.fn();

describe('POST /api/finix/plaidLinkToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no user is found', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: null });

    const response = await POST({} as any);
    expect(response).toEqual(errorResponse('User not authenticated', 401));
  });

  it('should return 400 if no slug is provided', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 'test-user' });

    const response = await POST(nextRequestMock({}) as any);
    expect(response).toEqual(errorResponse('Missing required slug', 400));
  });

  it('should return 500 if Finix API fails', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 'test-user' });
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    const response = await POST(nextRequestMock({ slug: 'edison' }) as any);
    expect(response).toEqual(
      errorResponse('Failed to get Plaid Link token', 500)
    );
  });

  it('should return a valid token when Finix API succeeds', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 'test-user' });

    const mockTokenResponse = {
      token: 'test-token',
      expires_at: '2025-12-31T23:59:59Z',
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockTokenResponse),
      ok: true,
    });

    const response = await POST(nextRequestMock({ slug: 'edison' }) as any);
    expect(response).toEqual(jsonResponse('test-token'));
  });
});
