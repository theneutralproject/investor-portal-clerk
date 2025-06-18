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
    organization: { update: jest.fn(), delete: jest.fn() },
    deal: { findMany: jest.fn() },
  },
}));

describe('/api/admin/organizations/[id]', () => {
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
      (getAdminFromRequest as jest.Mock).mockResolvedValueOnce(true);
      (prisma.advisorFirm.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 1,
      });
      (prisma.organization.update as jest.Mock).mockResolvedValueOnce({
        id: 1,
        name: 'Updated Org',
      });

      const req = nextRequestMock(
        { name: 'Updated Org', advisorFirmId: 1 },
        {},
        'PUT',
        '/api/admin/organizations/1'
      );
      const res = await PUT(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.name).toBe('Updated Org');
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
