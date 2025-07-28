import { PUT, DELETE } from '@/app/api/admin/organizations/[id]/route';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import prisma from '@/libs/prisma.server';
import { nextRequestMock } from '@/mocks/nextRequest.mock';

jest.mock('@/libs/admin/utils.server', () => ({
  getAdminFromRequest: jest.fn(),
}));

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    address: { upsert: jest.fn() },
    advisorFirm: { findUnique: jest.fn() },
    organization: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    deal: { findMany: jest.fn() },
    changelog: { create: jest.fn() },
  },
}));

describe('/api/admin/organizations/[id]', () => {
  const adminUser: any = { id: 1, email: 'admin@sample.com', role: 'ADMIN' };

  describe('PUT', () => {
    it('returns 500 if admin check fails', async () => {
      (getAdminFromRequest as jest.Mock).mockRejectedValueOnce(
        new Error('unauthorized')
      );
      const req = nextRequestMock({}, {}, 'PUT', '/api/admin/organizations/1');
      const res = await PUT(req);
      expect(res.status).toBe(500);
    });

    it('returns 400 if orgId is invalid', async () => {
      (getAdminFromRequest as jest.Mock).mockResolvedValueOnce(true);
      const req = nextRequestMock(
        {},
        {},
        'PUT',
        '/api/admin/organizations/abc'
      );
      const res = await PUT(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 if TIN is malformed', async () => {
      (getAdminFromRequest as jest.Mock).mockResolvedValueOnce(true);
      const req = nextRequestMock(
        { tin: '12345' },
        {},
        'PUT',
        '/api/admin/organizations/1'
      );
      const res = await PUT(req);
      expect(res.status).toBe(400);
    });

    it('returns 404 if advisor firm does not exist', async () => {
      (getAdminFromRequest as jest.Mock).mockResolvedValueOnce(true);
      (prisma.advisorFirm.findUnique as jest.Mock).mockResolvedValueOnce(null);
      const req = nextRequestMock(
        { advisorFirmId: 999 },
        {},
        'PUT',
        '/api/admin/organizations/1'
      );
      const res = await PUT(req);
      expect(res.status).toBe(404);
    });

    it('updates organization and returns data', async () => {
      const organization = {
        id: 1,
        name: 'Org',
        advisorFirmId: 1,
      };
      const newOrganizationData = {
        ...organization,
        name: 'Updated Org',
      };
      const changelog = {
        userId: adminUser.id,
        entityId: organization.id,
        entityName: 'ORGANIZATION',
        previousValue: organization,
        newValue: newOrganizationData,
        createdAt: new Date(),
      };
      (getAdminFromRequest as jest.Mock).mockResolvedValueOnce(adminUser);
      (prisma.advisorFirm.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 1,
      });
      (prisma.organization.findUnique as jest.Mock).mockResolvedValueOnce(
        organization
      );
      (prisma.organization.update as jest.Mock).mockResolvedValueOnce(
        newOrganizationData
      );
      (prisma.changelog.create as jest.Mock).mockResolvedValue(changelog);

      const req = nextRequestMock(
        newOrganizationData,
        {},
        'PUT',
        '/api/admin/organizations/1'
      );
      const res = await PUT(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.name).toBe(newOrganizationData.name);
      expect(prisma.changelog.create).toHaveBeenCalledWith({
        data: {
          ...changelog,
          createdAt: expect.any(Date),
        },
      });
    });
  });

  describe('DELETE', () => {
    it('returns 500 if admin check fails', async () => {
      (getAdminFromRequest as jest.Mock).mockRejectedValueOnce(
        new Error('unauthorized')
      );
      const req = nextRequestMock(
        {},
        {},
        'DELETE',
        '/api/admin/organizations/1'
      );
      const res = await DELETE(req);
      expect(res.status).toBe(500);
    });

    it('returns 400 if orgId is invalid', async () => {
      (getAdminFromRequest as jest.Mock).mockResolvedValueOnce(true);
      const req = nextRequestMock(
        {},
        {},
        'DELETE',
        '/api/admin/organizations/abc'
      );
      const res = await DELETE(req);
      expect(res.status).toBe(400);
    });

    it('returns 400 if org has deals', async () => {
      (getAdminFromRequest as jest.Mock).mockResolvedValueOnce(true);
      (prisma.deal.findMany as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);
      const req = nextRequestMock(
        {},
        {},
        'DELETE',
        '/api/admin/organizations/1'
      );
      const res = await DELETE(req);
      expect(res.status).toBe(400);
    });

    it('deletes organization and returns success message', async () => {
      (getAdminFromRequest as jest.Mock).mockResolvedValueOnce(true);
      (prisma.deal.findMany as jest.Mock).mockResolvedValueOnce([]);
      (prisma.organization.delete as jest.Mock).mockResolvedValueOnce({});
      const req = nextRequestMock(
        {},
        {},
        'DELETE',
        '/api/admin/organizations/1'
      );
      const res = await DELETE(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.message).toBe('organization deleted');
    });
  });
});
