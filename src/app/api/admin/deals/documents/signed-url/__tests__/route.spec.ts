import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { storageClient } from '@/libs/supabase';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { DealDocumentType } from '@prisma/client';
import { POST } from '../route';

jest.mock('@/libs/admin/utils.server', () => ({
  getAdminFromRequest: jest.fn(),
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
}));

jest.mock('@/libs/supabase', () => ({
  storageClient: {
    from: jest.fn(() => ({
      createSignedUploadUrl: jest.fn(),
    })),
  },
}));

describe('POST /api/deals/documents/signed-url', () => {
  const adminUser: any = { id: 1, email: 'admin@example.com', role: 'ADMIN' };

  const validPayload = {
    type: 'deal',
    dealId: 123,
    organizationId: null,
    fileName: 'test.pdf',
    key: 'abc-uuid',
    dealDocumentType: DealDocumentType.VERIFICATION_ACCREDITATION,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SUPABASE_STORAGE_URL = 'https://storage.supabase.com';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
  });

  it('returns 500 if getAdminFromRequest throws', async () => {
    jest
      .mocked(getAdminFromRequest)
      .mockRejectedValue(new Error('auth failed'));

    const req = nextRequestMock(validPayload);
    const res = await POST(req as any);

    expect(res).toEqual(jsonResponse('auth failed', 500));
  });

  it('returns 500 if adminUser is null', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(null as any);

    const req = nextRequestMock(validPayload);
    const res = await POST(req as any);

    expect(res).toEqual(
      errorResponse('admin user not found', 500, {
        request: expect.any(Object),
      })
    );
  });

  it('returns 400 if payload is invalid', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    const req = nextRequestMock({ ...validPayload, dealId: undefined });
    const res = await POST(req as any);

    expect(res).toStrictEqual(
      jsonResponse(
        {
          error: 'Validation failed',
          details: {
            _errors: [],
            dealId: {
              _errors: ['Required', 'Required'],
            },
          },
        },
        400
      )
    );
  });

  it('returns 400 if dealId or organizationId is missing', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    const req = nextRequestMock({
      ...validPayload,
      dealId: null,
      organizationId: null,
    });

    const res = await POST(req as any);

    expect(res).toEqual(
      errorResponse('Deal ID is required', 400, { request: expect.any(Object) })
    );
  });

  it('returns 500 if Supabase upload URL creation fails', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    (storageClient.from as any).mockReturnValueOnce({
      createSignedUploadUrl: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'storage error' },
      }),
    });

    const req = nextRequestMock(validPayload);
    const res = await POST(req as any);

    expect(res).toEqual(
      errorResponse('storage error', 500, { request: expect.any(Object) })
    );
  });

  it('returns signed URL metadata if successful', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    (storageClient.from as any).mockReturnValueOnce({
      createSignedUploadUrl: jest.fn().mockResolvedValue({
        data: { signedUrl: 'https://upload.supabase.com/upload-url' },
        error: null,
      }),
    });

    const req = nextRequestMock(validPayload);
    const res = await POST(req as any);

    const json = await res.json();

    expect(json).toMatchObject({
      t: expect.any(String),
      u: expect.any(String),
      bucketName: 'deal-documents',
      fileName: 'test.pdf',
      uploadUrl: 'https://upload.supabase.com/upload-url',
      filePath: 'deal-123/test.pdf',
    });
  });
});
