import { GET, POST } from '../route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';
import { findOrCreateClerkUser } from '@/libs/maintenance/utils.server';
import { createUserInDbAndHubspot } from '@/libs/user/utils.server';
import { Role } from '@prisma/client';
import { ReferralSource } from '@/libs/hubspot/utils.client';

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    advisorFirmEmployee: { findMany: jest.fn(), create: jest.fn() },
    $transaction: jest.fn(),
  },
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('@/libs/advisorFirm/utils.server', () => ({
  getAdvisorContext: jest.fn(),
}));

jest.mock('@/libs/maintenance/utils.server', () => ({
  findOrCreateClerkUser: jest.fn(),
}));

jest.mock('@/libs/user/utils.server', () => ({
  createUserInDbAndHubspot: jest.fn(),
}));

describe('/api/advisors/employees', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      jest
        .mocked(getAdvisorContext)
        .mockResolvedValue(errorResponse('User not authenticated', 401));

      const res = await GET(nextRequestMock() as any);
      expect(res).toEqual(errorResponse('User not authenticated', 401));
    });

    it('should return 403 if user is not advisor', async () => {
      jest.mocked(getAdvisorContext).mockResolvedValue(
        errorResponse('Unauthorized or not found', 403, {
          request: expect.anything(),
          extra: { user: expect.anything() },
        })
      );

      const res = await GET(nextRequestMock() as any);
      expect(res).toEqual(
        errorResponse('Unauthorized or not found', 403, {
          request: expect.anything(),
          extra: { user: expect.anything() },
        })
      );
    });

    it('should return 400 if advisor firm not found', async () => {
      jest.mocked(getAdvisorContext).mockResolvedValue(
        errorResponse('User is not assigned to an advisor firm', 400, {
          request: expect.anything(),
          extra: { user: expect.anything() },
        })
      );

      const res = await GET(nextRequestMock() as any);
      expect(res).toEqual(
        errorResponse('User is not assigned to an advisor firm', 400, {
          request: expect.anything(),
          extra: { user: expect.anything() },
        })
      );
    });

    it('should return advisor firm employees with user info', async () => {
      const mockEmployees = [
        {
          id: 1,
          advisorFirmId: 123,
          userId: 101,
          role: 'ADMIN',
          user: {
            id: 101,
            email: 'admin@firm.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
        {
          id: 2,
          advisorFirmId: 123,
          userId: 102,
          role: 'STAFF',
          user: {
            id: 102,
            email: 'staff@firm.com',
            firstName: 'Jane',
            lastName: 'Smith',
          },
        },
      ];

      jest.mocked(getAdvisorContext).mockResolvedValue({
        dbUser: {
          id: 100,
          role: 'ADVISOR',
          email: 'advisor@example.com',
        },
        advisorFirmEmployee: {
          advisorFirmId: 123,
          advisorFirm: {
            id: 123,
            name: 'Test Firm',
          },
        },
        advisorFirm: {
          id: 123,
          name: 'Test Firm',
        },
      } as any);

      jest
        .mocked(prisma.advisorFirmEmployee.findMany)
        .mockResolvedValue(mockEmployees as any);

      const res = await GET(nextRequestMock() as any);

      expect(res).toEqual(jsonResponse(mockEmployees));
      expect(prisma.advisorFirmEmployee.findMany).toHaveBeenCalledWith({
        where: { advisorFirmId: 123 },
        include: { user: true },
      });
    });
  });

  describe('POST', () => {
    const mockContext: any = {
      dbUser: {
        id: 100,
        role: 'ADVISOR',
        email: 'advisor@example.com',
      },
      advisorFirmEmployee: {
        advisorFirmId: 123,
        advisorFirm: {
          id: 123,
          name: 'Test Firm',
        },
      },
      advisorFirm: {
        id: 123,
        name: 'Test Firm',
      },
    };

    it('should return 401 if not authenticated', async () => {
      jest
        .mocked(getAdvisorContext)
        .mockResolvedValue(errorResponse('User not authenticated', 401));
      const req = nextRequestMock({ body: {} }, {}, 'POST');
      const res = await POST(req as any);
      expect(res).toEqual(errorResponse('User not authenticated', 401));
    });

    it('should return 400 if invalid request body', async () => {
      jest.mocked(getAdvisorContext).mockResolvedValue(mockContext);
      const req = nextRequestMock({ body: { invalid: true } }, {}, 'POST');
      req.json = async () => ({ invalid: true });

      const res = await POST(req as any);
      expect(res).toEqual(
        errorResponse('Invalid request body', 400, {
          request: expect.anything(),
          extra: expect.objectContaining({
            error: expect.anything(),
            body: expect.anything(),
          }),
        })
      );
    });

    it('should return 500 if transaction fails', async () => {
      const validBody = {
        user: {
          email: 'fail@user.com',
          firstName: 'Fail',
          lastName: 'Case',
          phoneNumber: '1234567890',
        },
        role: 'STAFF',
      };

      jest.mocked(getAdvisorContext).mockResolvedValue(mockContext);
      jest
        .mocked(prisma.$transaction)
        .mockRejectedValue(new Error('DB failure'));

      const req = nextRequestMock({}, {}, 'POST');
      req.json = async () => validBody;

      const res = await POST(req as any);
      expect(res).toEqual(
        errorResponse('Unable to create advisor employee', 500, {
          request: expect.anything(),
          extra: expect.objectContaining({ error: expect.any(Error) }),
        })
      );
    });

    it('should create and return advisor employee', async () => {
      const validBody = {
        user: {
          email: 'new@user.com',
          firstName: 'New',
          lastName: 'User',
          phoneNumber: '(555) 123-4567',
        },
        role: 'STAFF',
      };

      const createdUser = {
        id: 999,
        email: 'new@user.com',
      };

      const employeeResult = {
        id: 555,
        userId: 999,
        advisorFirmId: mockContext.advisorFirm.id,
        role: 'STAFF',
        user: createdUser,
      };

      jest.mocked(getAdvisorContext).mockResolvedValue(mockContext);
      jest
        .mocked(findOrCreateClerkUser)
        .mockResolvedValue({ id: 'clerk-uid-999' } as any);
      jest
        .mocked(createUserInDbAndHubspot)
        .mockResolvedValue(createdUser as any);
      jest
        .mocked(prisma.$transaction)
        .mockImplementation(async fn => fn(prisma));

      jest
        .mocked(prisma.advisorFirmEmployee.create)
        .mockResolvedValue(employeeResult as any);

      const req = nextRequestMock({}, {}, 'POST');
      req.json = async () => validBody;

      const res = await POST(req as any);
      expect(res).toEqual(jsonResponse(employeeResult, 201));
      expect(findOrCreateClerkUser).toHaveBeenCalledWith(
        'new@user.com',
        'New',
        'User',
        '5551234567',
        { role: Role.ADVISOR, invite: true }
      );
      expect(createUserInDbAndHubspot).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@user.com',
          firstName: 'New',
          lastName: 'User',
          phoneNumber: '5551234567',
          referralSource: ReferralSource.ADVISOR_UPDATE,
          role: Role.ADVISOR,
        }),
        undefined,
        expect.anything()
      );
      expect(prisma.advisorFirmEmployee.create).toHaveBeenCalledWith({
        data: {
          advisorFirmId: mockContext.advisorFirm.id,
          userId: 999,
          role: 'STAFF',
        },
        include: { user: true },
      });
    });
  });
});
