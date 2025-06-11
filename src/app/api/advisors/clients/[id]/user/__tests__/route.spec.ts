import { nextRequestMock } from '@/mocks/nextRequest.mock';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { GET, PUT } from '../route';

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    user: { findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    advisorFirmEmployee: { findFirst: jest.fn() },
    organization: { findFirst: jest.fn() },
    address: { upsert: jest.fn() },
  },
}));

jest.mock('@clerk/nextjs/server', () => ({
  getAuth: jest.fn(),
  clerkClient: jest.fn(() => ({
    users: { updateUser: jest.fn() },
  })),
}));

jest.mock('@/libs/hubspot/utils.server', () => ({
  updateHubspotContact: jest.fn(),
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('@/libs/user/utils.server', () => ({
  sanitizeUser: jest.fn(user => ({ ...user, sanitized: true })),
}));

describe('/api/advisors/clients/[id]/user', () => {
  const clerkId = 'advisor-clerk';
  const advisorUser: any = {
    id: 1,
    role: 'ADVISOR',
    clerkId,
    email: 'a@x.com',
  };
  const advisorFirm: any = { advisorFirmId: 10 };
  const targetUser: any = {
    id: 99,
    clerkId: 'client-clerk',
    hubspotId: 'hs123',
    firstName: 'Jon',
    lastName: 'Doe',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 401 if not authenticated', async () => {
      jest.mocked(getAuth).mockReturnValue({ userId: null } as any);
      const res = await GET(nextRequestMock() as any, {
        params: Promise.resolve({ id: '123' }),
      });
      expect(res).toEqual(errorResponse('User not authenticated', 401));
    });

    it('should return 404 if missing investorPortalId', async () => {
      jest
        .mocked(getAuth)
        .mockReturnValue({ userId: clerkId, sessionClaims: {} } as any);
      const res = await GET(nextRequestMock() as any, {
        params: Promise.resolve({ id: '123' }),
      });
      expect(res).toEqual(
        errorResponse('User not found', 404, expect.anything())
      );
    });

    it('should return 403 if user is not advisor', async () => {
      jest.mocked(getAuth).mockReturnValue({
        userId: clerkId,
        sessionClaims: { metadata: { investorPortalId: 1 } },
      } as any);
      jest
        .mocked(prisma.user.findFirst)
        .mockResolvedValue({ ...advisorUser, role: 'USER' } as any);
      const res = await GET(nextRequestMock() as any, {
        params: Promise.resolve({ id: '123' }),
      });
      expect(res).toEqual(
        errorResponse('Unauthorized or not found', 403, expect.anything())
      );
    });

    it('should return 404 if organization or user not found', async () => {
      jest.mocked(getAuth).mockReturnValue({
        userId: clerkId,
        sessionClaims: { metadata: { investorPortalId: 1 } },
      } as any);
      jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
      jest
        .mocked(prisma.advisorFirmEmployee.findFirst)
        .mockResolvedValue(advisorFirm);
      jest.mocked(prisma.organization.findFirst).mockResolvedValue(null);
      const res = await GET(nextRequestMock() as any, {
        params: Promise.resolve({ id: '123' }),
      });
      expect(res).toEqual(
        errorResponse('Organization not found', 404, expect.anything())
      );
    });

    it('should return sanitized user on success', async () => {
      const org: any = {
        id: 123,
        name: 'Test Org',
        ownedBy: { id: 99, clerkId: 'client-clerk' },
      };
      const user: any = { id: 99, firstName: 'Jon', address: {} };
      jest.mocked(getAuth).mockReturnValue({
        userId: clerkId,
        sessionClaims: { metadata: { investorPortalId: 1 } },
      } as any);
      jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
      jest
        .mocked(prisma.advisorFirmEmployee.findFirst)
        .mockResolvedValue(advisorFirm);
      jest.mocked(prisma.organization.findFirst).mockResolvedValue(org);
      jest.mocked(prisma.user.findUnique).mockResolvedValue(user);

      const res = await GET(nextRequestMock() as any, {
        params: Promise.resolve({ id: '123' }),
      });
      expect(res).toEqual(
        jsonResponse({
          organization: org,
          user: {
            ...user,
            sanitized: true,
          },
        })
      );
    });
  });

  describe('PUT', () => {
    it('should return 400 if client ID is invalid', async () => {
      jest.mocked(getAuth).mockReturnValue({
        userId: clerkId,
        sessionClaims: { metadata: { investorPortalId: 1 } },
      } as any);
      jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
      const res = await PUT(
        nextRequestMock({ json: async () => ({}) }) as any,
        {
          params: Promise.resolve({ id: 'abc' }),
        }
      );
      expect(res).toEqual(
        errorResponse('Client ID not valid', 400, expect.anything())
      );
    });

    it('should return 404 if target user not found', async () => {
      jest.mocked(getAuth).mockReturnValue({
        userId: clerkId,
        sessionClaims: { metadata: { investorPortalId: 1 } },
      } as any);
      jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
      jest.mocked(prisma.organization.findFirst).mockResolvedValue(null);
      const res = await PUT(
        nextRequestMock({ json: async () => ({}) }) as any,
        {
          params: Promise.resolve({ id: '123' }),
        }
      );
      expect(res).toEqual(
        errorResponse('Client owner not found', 404, expect.anything())
      );
    });

    it('should update user and return sanitized user', async () => {
      const updateData = {
        address: {
          street: '25 West Main Street',
          street2: '',
          city: 'Los Angeles',
          state: 'California',
          zipcode: '95014',
          country: 'United States',
        },
      };
      jest.mocked(getAuth).mockReturnValue({
        userId: clerkId,
        sessionClaims: { metadata: { investorPortalId: 1 } },
      } as any);
      jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
      jest
        .mocked(prisma.organization.findFirst)
        .mockResolvedValue({ ownedBy: targetUser } as any);
      jest
        .mocked(prisma.user.update)
        .mockResolvedValue({ ...targetUser, ...updateData });

      const req = nextRequestMock({
        json: async () => updateData,
      }) as any;
      const res = await PUT(req, {
        params: Promise.resolve({ id: '123' }),
      });

      expect(res).toEqual(
        jsonResponse({
          ...targetUser,
          ...updateData,
          sanitized: true,
        })
      );
    });
  });
});
