import { GET, PUT } from '@/app/api/admin/users/[id]/route';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import prisma from '@/libs/prisma.server';
import { updateUserInDbAndHubspotAndClerk } from '@/libs/user/utils.server';
import { nextRequestMock } from '@/mocks/nextRequest.mock';

jest.mock('@/libs/admin/utils.server', () => ({
  getAdminFromRequest: jest.fn(),
}));

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn() },
    organization: { findMany: jest.fn() },
    deal: { findMany: jest.fn() },
    changelog: { create: jest.fn() },
  },
}));

jest.mock('@/libs/user/utils.server', () => ({
  updateUserInDbAndHubspotAndClerk: jest.fn(),
}));

describe('/api/admin/users/[id]', () => {
  const adminUser: any = { id: 1, email: 'admin@firm.com', role: 'ADMIN' };
  describe('GET', () => {
    it('returns 500 if admin check fails', async () => {
      (getAdminFromRequest as jest.Mock).mockRejectedValueOnce(
        new Error('unauthorized')
      );

      const request = nextRequestMock({}, {}, 'GET', '/api/admin/users/3');
      const res = await GET(request);
      expect(res.status).toBe(500);
    });

    it('returns 500 if userId is invalid', async () => {
      (getAdminFromRequest as jest.Mock).mockResolvedValueOnce(adminUser);

      const request = nextRequestMock({}, {}, 'GET', '/api/admin/users/abc');
      const res = await GET(request);
      expect(res.status).toBe(500);
    });

    it('returns user, organizations, and deals', async () => {
      const organization = {
        id: 1,
        name: 'Org',
        members: [],
        deals: [],
        advisorFirmId: 1,
      };
      (getAdminFromRequest as jest.Mock).mockResolvedValueOnce(adminUser);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 3 });
      (prisma.organization.findMany as jest.Mock).mockResolvedValue([
        organization,
      ]);
      (prisma.deal.findMany as jest.Mock).mockResolvedValue([
        { id: 1, organizationId: 1 },
      ]);

      const request = nextRequestMock({}, {}, 'GET', '/api/admin/users/3');
      const res = await GET(request);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.user).toBeDefined();
      expect(json.organizations).toHaveLength(1);
      expect(json.organizations).toStrictEqual([organization]);
      expect(json.deals).toHaveLength(1);
    });
  });

  describe('PUT', () => {
    it('returns 500 if admin check fails', async () => {
      (getAdminFromRequest as jest.Mock).mockRejectedValueOnce(
        new Error('unauthorized')
      );

      const request = nextRequestMock({}, {}, 'PUT', '/api/admin/users/3');
      const res = await PUT(request);
      expect(res.status).toBe(500);
    });

    it('returns 500 if userId is invalid', async () => {
      (getAdminFromRequest as jest.Mock).mockResolvedValueOnce(adminUser);

      const request = nextRequestMock({}, {}, 'PUT', '/api/admin/users/abc');
      const res = await PUT(request);
      expect(res.status).toBe(500);
    });

    it('returns 500 if validation fails', async () => {
      (getAdminFromRequest as jest.Mock).mockResolvedValueOnce(adminUser);

      const request = nextRequestMock(
        {
          email: 'not-an-email',
        },
        {},
        'PUT',
        '/api/admin/users/3'
      );
      const res = await PUT(request);
      expect(res.status).toBe(500);
    });

    it('updates and returns user and creates changelog', async () => {
      (getAdminFromRequest as jest.Mock).mockResolvedValueOnce(adminUser);
      (updateUserInDbAndHubspotAndClerk as jest.Mock).mockResolvedValue({
        id: 3,
        email: 'user@example.com',
      });

      const validUserUpdate = {
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      (prisma.changelog.create as jest.Mock).mockResolvedValue({
        userId: adminUser.id,
        entityId: 3,
        entityName: 'USER',
        previousValue: {},
        newValue: validUserUpdate,
      });

      const request = nextRequestMock(
        validUserUpdate,
        {},
        'PUT',
        '/api/admin/users/3'
      );
      const res = await PUT(request);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.email).toBe('user@example.com');
    });
  });
});
