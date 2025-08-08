import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { createGenericDocumentEntry } from '@/libs/document/utils.server';
import { POST } from '../route';
import { errorResponse } from '@/libs/utils.server';
import {
  DealDocumentCreateSchema,
  OrganizationDocumentCreateSchema,
  ProjectDocumentCreateSchema,
} from '@/libs/document/schema';
import { createChangeLog } from '@/libs/changelog/utils.server';

jest.mock('@/libs/admin/utils.server', () => ({
  getAdminFromRequest: jest.fn(),
}));

jest.mock('@/libs/document/utils.server', () => ({
  createGenericDocumentEntry: jest.fn(),
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
}));

jest.mock('@/libs/changelog/utils.server', () => ({
  createChangeLog: jest.fn(),
}));

describe('POST /api/admin/documents/store-metadata', () => {
  const adminUser: any = { id: 1, email: 'admin@example.com', role: 'ADMIN' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 if getAdminFromRequest throws', async () => {
    jest
      .mocked(getAdminFromRequest)
      .mockRejectedValueOnce(new Error('unauthorized'));

    const req = nextRequestMock({});
    const res = await POST(req as any);
    expect(res).toEqual(
      errorResponse('unauthorized', 401, { request: expect.any(Object) })
    );
  });

  it('returns 401 if admin user is null', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValueOnce(null as any);

    const req = nextRequestMock({});
    const res = await POST(req as any);
    expect(res).toEqual(
      errorResponse('admin user not found', 401, {
        request: expect.any(Object),
      })
    );
  });

  it('returns 400 for invalid schema', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    const req = nextRequestMock({ type: 'deal' }); // missing required fields
    const res = await POST(req as any);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json).toHaveProperty('error', 'Validation failed');
  });

  it('returns 500 on createGenericDocumentEntry error', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
    jest
      .mocked(createGenericDocumentEntry)
      .mockRejectedValueOnce(new Error('db error'));

    const validPayload = {
      type: 'deal',
      dealId: 1,
      name: 'test.pdf',
      path: 'documents/',
      key: 'key',
      dealDocumentType: 'VERIFICATION_ACCREDITATION',
    };

    const req = nextRequestMock(validPayload);
    const res = await POST(req as any);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toMatch(/store document metadata/);
  });

  describe('deal', () => {
    it('creates metadata for deal successfully', async () => {
      jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

      const payload: DealDocumentCreateSchema = {
        type: 'deal' as const,
        dealId: 1,
        name: 'doc.pdf',
        path: '/documents/deal.pdf',
        key: 'abc123',
        dealDocumentType: 'VERIFICATION_ACCREDITATION',
      };

      const mockDoc = { ...payload, id: 333 };

      (createGenericDocumentEntry as jest.Mock).mockResolvedValueOnce(mockDoc);
      (createChangeLog as jest.Mock).mockResolvedValueOnce(true);

      const req = nextRequestMock(payload);
      const res = await POST(req as any);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ success: true, document: mockDoc });
    });
  });

  describe('organization', () => {
    it('creates metadata for organization successfully', async () => {
      jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

      const payload: OrganizationDocumentCreateSchema = {
        type: 'organization' as const,
        organizationId: 2,
        name: 'org-doc.pdf',
        path: '/documents/org.pdf',
        key: 'orgKey',
      };

      const mockDoc = {
        ...payload,
        id: 1000,
      };

      (createGenericDocumentEntry as jest.Mock).mockResolvedValueOnce(mockDoc);
      (createChangeLog as jest.Mock).mockResolvedValueOnce(true);

      const req = nextRequestMock(payload);
      const res = await POST(req as any);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ success: true, document: mockDoc });
    });
  });

  describe('project', () => {
    it('creates metadata for project successfully', async () => {
      jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

      const payload: ProjectDocumentCreateSchema = {
        type: 'project',
        name: 'project doc',
        fileName: 'project.pdf',
        link: 'https://example.com/project.pdf',
        projectId: 3,
        dealStage: 1,
        financingTypes: ['equity'],
        documentType: 'DOCUMENT',
        isPublic: true,
        requiresNDA: false,
      };

      const mockDoc = { ...payload, id: 1001 };

      (createGenericDocumentEntry as jest.Mock).mockResolvedValueOnce(mockDoc);
      (createChangeLog as jest.Mock).mockResolvedValueOnce(true);

      const req = nextRequestMock(payload);
      const res = await POST(req as any);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ success: true, document: mockDoc });
    });
  });
});
