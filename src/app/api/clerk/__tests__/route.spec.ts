import { POST } from '../route';
import { createUserInDbAndHubspot } from '@/libs/user/utils';

// Mock our user utils createUserInDbAndHubspot
jest.mock('@/libs/user/utils', () => ({
  createUserInDbAndHubspot: jest.fn(),
}));

// Mock svix verify request
const mockVerify = jest.fn();
jest.mock('svix', () => ({
  Webhook: jest.fn().mockImplementation(() => ({
    verify: mockVerify,
  })),
}));

// Mock svix headers
jest.mock('next/headers', () => ({
  headers: jest.fn(() => ({
    get: jest.fn((headerName) => {
      const headersMap: Record<string, string> = {
        'svix-id': 'test-svix-id',
        'svix-timestamp': 'test-timestamp',
        'svix-signature': 'test-signature',
      };
      return headersMap[headerName];
    }),
  })),
}));

const createMockRequest = (body: string = '{}'): Request =>
  ({
    text: jest.fn().mockResolvedValueOnce(body),
  } as unknown as Request);

describe('POST handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle user.created event and store user data', async () => {
    const mockRequest = createMockRequest('{}');

    mockVerify.mockReturnValueOnce({
      type: 'user.created',
      data: {
        id: 'user123',
        primary_email_address_id: 'email123',
        email_addresses: [{ id: 'email123', email_address: 'test@example.com' }],
        primary_phone_number_id: 'phone123',
        phone_numbers: [{ id: 'phone123', phone_number: '+1234567890' }],
        first_name: 'John',
        last_name: 'Doe',
      },
    });

    const response = await POST(mockRequest);

    expect(mockVerify).toHaveBeenCalledWith('{}', {
      'svix-id': 'test-svix-id',
      'svix-timestamp': 'test-timestamp',
      'svix-signature': 'test-signature',
    });
    expect(createUserInDbAndHubspot).toHaveBeenCalledWith({
      clerkId: 'user123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890',
      address: undefined,
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: 'success' });
  });

  it('should handle unsupported event types gracefully', async () => {
    const mockRequest = createMockRequest('{}');

    mockVerify.mockReturnValueOnce({
      type: 'unsupported.event',
      data: {},
    });

    const response = await POST(mockRequest);

    expect(mockVerify).toHaveBeenCalled();
    expect(createUserInDbAndHubspot).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: 'success' });
  });

  it('should return 500 if email is not found in user.created event', async () => {
    const mockRequest = createMockRequest('{}');

    mockVerify.mockReturnValueOnce({
      type: 'user.created',
      data: {
        id: 'user123',
        primary_email_address_id: null,
        email_addresses: [],
        primary_phone_number_id: null,
        phone_numbers: [],
        first_name: 'John',
        last_name: 'Doe',
      },
    });

    const response = await POST(mockRequest);

    expect(mockVerify).toHaveBeenCalled();
    expect(createUserInDbAndHubspot).not.toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: 'No email found for new clerk user!!!',
    });
  });

  it('should return 500 on createUserInDbAndHubspot error', async () => {
    const mockRequest = createMockRequest('{}');

    mockVerify.mockReturnValueOnce({
      type: 'user.created',
      data: {
        id: 'user123',
        primary_email_address_id: 'email123',
        email_addresses: [{ id: 'email123', email_address: 'test@example.com' }],
        primary_phone_number_id: 'phone123',
        phone_numbers: [{ id: 'phone123', phone_number: '+1234567890' }],
        first_name: 'John',
        last_name: 'Doe',
      },
    });

    (createUserInDbAndHubspot as jest.Mock).mockRejectedValueOnce(
      new Error('Database error')
    );

    const response = await POST(mockRequest);

    expect(mockVerify).toHaveBeenCalled();
    expect(createUserInDbAndHubspot).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ message: 'Database error' });
  });
});
