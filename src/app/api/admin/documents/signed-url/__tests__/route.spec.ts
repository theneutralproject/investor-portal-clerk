import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { POST } from '../route';
import {
  createDocumentSignedUrl,
  getFolderName,
} from '@/libs/document/utils.server';

jest.mock('@/libs/admin/utils.server', () => ({
  getAdminFromRequest: jest.fn(),
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
}));

jest.mock('@/libs/document/utils.server', () => ({
  createDocumentSignedUrl: jest.fn(),
  getFolderName: jest.fn(),
}));

describe('POST /api/documents/signed-url', () => {
  const adminUser: any = { id: 1, email: 'admin@example.com', role: 'ADMIN' };

  const validPayload = {
    entityId: 123,
    entityType: 'project',
    fileName: 'test.doc',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SUPABASE_STORAGE_URL = 'https://storage.supabase.com';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
  });

  it('returns 401 if getAdminFromRequest throws', async () => {
    jest
      .mocked(getAdminFromRequest)
      .mockRejectedValue(new Error('auth failed'));

    const req = nextRequestMock(validPayload);
    const res = await POST(req as any);

    expect(res).toEqual(jsonResponse({ error: 'auth failed' }, 401));
  });

  it('returns 401 if adminUser is null', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(null as any);

    const req = nextRequestMock(validPayload);
    const res = await POST(req as any);

    expect(res).toEqual(
      errorResponse('admin user not found', 401, {
        request: expect.any(Object),
      })
    );
  });

  it('returns 400 if entityId is missing', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    const req = nextRequestMock({ ...validPayload, entityId: undefined });
    const res = await POST(req as any);

    expect(res).toStrictEqual(
      jsonResponse(
        {
          error: 'Validation failed',
          details: {
            _errors: [],
            entityId: {
              _errors: ['Required', 'Required'],
            },
          },
        },
        400
      )
    );
  });
  it('returns 400 if entityId is invalid', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    const req = nextRequestMock({ ...validPayload, entityId: 'asdflalf' });

    await expect(POST(req as any)).rejects.toThrow(
      'entityId must be a valid number'
    );
  });

  it('returns 400 if entityType is missing', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    const req = nextRequestMock({
      ...validPayload,
      entityType: null,
    });

    const res = await POST(req as any);

    expect(res).toStrictEqual(
      jsonResponse(
        {
          error: 'Validation failed',
          details: {
            _errors: [],
            entityType: {
              _errors: [
                "Expected 'deal' | 'organization' | 'project', received null",
              ],
            },
          },
        },
        400
      )
    );
  });

  it('returns 400 if entityType is invalid', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    const entityType = 'my-not-valid-entityType';

    const req = nextRequestMock({
      ...validPayload,
      entityType,
    });

    const res = await POST(req as any);

    expect(res).toStrictEqual(
      jsonResponse(
        {
          error: 'Validation failed',
          details: {
            _errors: [],
            entityType: {
              _errors: [
                `Invalid enum value. Expected 'deal' | 'organization' | 'project', received '${entityType}'`,
              ],
            },
          },
        },
        400
      )
    );
  });

  it('returns 400 if fileName is missing', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
    const req = nextRequestMock({
      ...validPayload,
      fileName: undefined,
    });

    const res = await POST(req as any);

    expect(res).toStrictEqual(
      jsonResponse(
        {
          error: 'Validation failed',
          details: {
            _errors: [],
            fileName: {
              _errors: [`Required`],
            },
          },
        },
        400
      )
    );
  });

  it('returns 400 if fileName is invalid', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
    const req = nextRequestMock({
      ...validPayload,
      fileName: 1244,
    });

    const res = await POST(req as any);

    expect(res).toStrictEqual(
      jsonResponse(
        {
          error: 'Validation failed',
          details: {
            _errors: [],
            fileName: {
              _errors: [`Expected string, received number`],
            },
          },
        },
        400
      )
    );
  });

  it('returns 500 if Supabase upload URL creation fails', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    jest.mocked(getFolderName).mockResolvedValueOnce('');

    jest
      .mocked(createDocumentSignedUrl)
      .mockRejectedValue(new Error('storage error'));

    const req = nextRequestMock(validPayload);
    const res = await POST(req as any);

    expect(res).toEqual(
      errorResponse('storage error', 500, { request: expect.any(Object) })
    );
  });

  describe('organization', () => {
    const organizationPayload = {
      entityId: 1,
      entityType: 'organization',
      fileName: 'test.pdf',
    };
    it('returns signed URL metadata if successful', async () => {
      jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
      const signedUrlData = {
        signedUrl: 'https://upload.supabase.com/upload-url',
        folder: `${organizationPayload.entityType}-${organizationPayload.entityId}`,
        bucketName: `${organizationPayload.entityType}-documents`,
        token: 'my-token',
        path: 'my-path',
      };

      jest.mocked(createDocumentSignedUrl).mockResolvedValue(signedUrlData);

      const req = nextRequestMock(organizationPayload);
      const res = await POST(req as any);

      const json = await res.json();

      expect(json).toMatchObject({
        t: expect.any(String),
        u: expect.any(String),
        bucketName: signedUrlData.bucketName,
        fileName: organizationPayload.fileName,
        uploadUrl: 'https://upload.supabase.com/upload-url',
        filePath: `${signedUrlData.folder}/${organizationPayload.fileName}`,
      });
    });
  });

  describe('project', () => {
    const projectPayload = {
      entityId: 1,
      entityType: 'project',
      fileName: 'test.pdf',
    };
    it('returns signed URL metadata if successful', async () => {
      jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
      const signedUrlData = {
        signedUrl: 'https://upload.supabase.com/upload-url',
        folder: `${projectPayload.entityType}-${projectPayload.entityId}`,
        bucketName: `${projectPayload.entityType}-documents`,
        token: 'my-token',
        path: 'my-path',
      };

      jest.mocked(createDocumentSignedUrl).mockResolvedValue(signedUrlData);

      const req = nextRequestMock(projectPayload);
      const res = await POST(req as any);

      const json = await res.json();

      expect(json).toMatchObject({
        t: expect.any(String),
        u: expect.any(String),
        bucketName: signedUrlData.bucketName,
        fileName: projectPayload.fileName,
        uploadUrl: 'https://upload.supabase.com/upload-url',
        filePath: `${signedUrlData.folder}/${projectPayload.fileName}`,
      });
    });
  });

  describe('deal', () => {
    const dealPayload = {
      entityId: 1,
      entityType: 'deal',
      fileName: 'test.pdf',
    };
    it('returns signed URL metadata if successful', async () => {
      jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
      const signedUrlData = {
        signedUrl: 'https://upload.supabase.com/upload-url',
        folder: `${dealPayload.entityType}-${dealPayload.entityId}`,
        bucketName: `${dealPayload.entityType}-documents`,
        token: 'my-token',
        path: 'my-path',
      };

      jest.mocked(createDocumentSignedUrl).mockResolvedValue(signedUrlData);

      const req = nextRequestMock(dealPayload);
      const res = await POST(req as any);

      const json = await res.json();

      expect(json).toMatchObject({
        t: expect.any(String),
        u: expect.any(String),
        bucketName: signedUrlData.bucketName,
        fileName: dealPayload.fileName,
        uploadUrl: 'https://upload.supabase.com/upload-url',
        filePath: `${signedUrlData.folder}/${dealPayload.fileName}`,
      });
    });
  });
});
