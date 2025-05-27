import { POST } from '../route';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/libs/prisma.server';
import * as utils from '@/libs/user/utils.server';
import { NextRequest } from 'next/server';
import { ReferralSource } from '@/libs/hubspot/utils.client';

jest.mock('@/libs/user/utils.server', () => ({
  createUserInDbAndHubspot: jest.fn(),
}));

jest.mock('@clerk/nextjs/server', () => ({
  getAuth: jest.fn(),
  clerkClient: jest.fn(() => ({
    users: {
      getUser: jest.fn(),
      updateUser: jest.fn(),
    },
  })),
}));

jest.mock('@/libs/prisma.server', () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

jest.mock('@/libs/utils.server', () => ({
  errorResponse: jest.fn(
    (message, status) =>
      new Response(JSON.stringify({ error: message }), { status })
  ),
}));

const createMockRequest = (
  body: Record<string, unknown> = {}
): Partial<NextRequest> => ({
  json: jest.fn().mockResolvedValue(body),
  headers: new Headers(),
});

const mockClerkUser = {
  id: 'user_123',
  primaryEmailAddressId: 'email_1',
  emailAddresses: [{ id: 'email_1', emailAddress: 'test@example.com' }],
  primaryPhoneNumberId: 'phone_1',
  phoneNumbers: [{ id: 'phone_1', phoneNumber: '+1234567890' }],
  firstName: 'John',
  lastName: 'Doe',
};

const mockUser: any = {
  firstName: 'John',
  lastName: 'Doe',
  clerkId: mockClerkUser.id,
  hubspotId: null,
  ssn: '123-45-6789',
  referralSource: ReferralSource.OTHER,
  email: 'johndoe@example.com',
  phoneNumber: '+1234567890',
  address: null,
  dateOfBirth: new Date('1990-01-01'),
  projectSlug: 'sample-project',
};

describe('POST /api/user', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: null });

    const response = await POST(createMockRequest() as NextRequest);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ error: 'User not authenticated' });
  });

  it('should return 200 if user already exists in the database', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: mockClerkUser.id });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      clerkId: mockClerkUser.id,
      role: 'ADMIN',
    });
    (clerkClient as jest.Mock).mockReturnValue({
      users: {
        getUser: jest.fn().mockResolvedValue({
          ...mockClerkUser,
          primaryEmailAddressId: null,
          emailAddresses: [],
          publicMetadata: {
            onboardingComplete: false,
          },
        }),
        updateUser: jest.fn().mockResolvedValue({
          ...mockClerkUser,
          primaryEmailAddressId: null,
          emailAddresses: [],
          publicMetadata: {
            onboardingComplete: true,
          },
        }),
      },
    });

    const response = await POST(createMockRequest() as NextRequest);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ data: 'User exists', role: 'ADMIN' });
  });

  it('should create a new user if not found in the database', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: mockClerkUser.id });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (clerkClient as jest.Mock).mockReturnValue({
      users: {
        getUser: jest.fn().mockResolvedValue(mockClerkUser),
        updateUser: jest.fn().mockResolvedValue(mockClerkUser),
      },
    });
    const createUserInDbAndHubspotSpy = jest.spyOn(
      utils,
      'createUserInDbAndHubspot'
    );
    createUserInDbAndHubspotSpy.mockResolvedValue(mockUser);

    const response = await POST(createMockRequest() as NextRequest);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(createUserInDbAndHubspotSpy).toHaveBeenCalledWith({
      clerkId: mockClerkUser.id,
      email: mockClerkUser.emailAddresses[0]?.emailAddress,
      firstName: mockClerkUser.firstName,
      lastName: mockClerkUser.lastName,
      phoneNumber: mockClerkUser.phoneNumbers[0]?.phoneNumber,
      address: undefined,
    });
    expect(json).toEqual({
      data: {
        id: mockUser.id,
        clerkId: mockUser.clerkId,
        referralSource: mockUser.referralSource,
        hubspotId: mockUser.hubspotId,
      },
    });
  });

  it('should return 401 if Clerk user lookup fails', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 'user_123' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (clerkClient as jest.Mock).mockReturnValue({
      users: {
        getUser: jest.fn().mockRejectedValue(new Error('User not found')),
      },
    });

    const response = await POST(createMockRequest() as NextRequest);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ error: 'User not found' });
  });

  it('should return 500 if no email is found in user data', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: mockClerkUser.id });
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    (clerkClient as jest.Mock).mockReturnValue({
      users: {
        getUser: jest.fn().mockResolvedValue({
          ...mockClerkUser,
          primaryEmailAddressId: null,
          emailAddresses: [],
        }),
        updateUser: jest.fn().mockResolvedValue({
          ...mockClerkUser,
          primaryEmailAddressId: null,
          emailAddresses: [],
        }),
      },
    });

    const response = await POST(createMockRequest() as NextRequest);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({
      error: `No email found for new clerk user: ${mockClerkUser.id}`,
    });
  });

  it('should return 500 if user creation in DB fails', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: 'user_123' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (clerkClient as jest.Mock).mockReturnValue({
      users: {
        getUser: jest.fn().mockResolvedValue(mockClerkUser),
      },
    });
    const createUserInDbAndHubspotSpy = jest.spyOn(
      utils,
      'createUserInDbAndHubspot'
    );
    const dbError = new Error('Database error');
    createUserInDbAndHubspotSpy.mockRejectedValue(dbError);

    await expect(POST(createMockRequest() as NextRequest)).rejects.toBe(
      dbError
    );
  });
});
