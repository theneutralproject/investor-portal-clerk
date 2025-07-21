import { nextRequestMock } from '@/mocks/nextRequest.mock';
import {
  getAdminFromRequest,
  createDocumentEntry,
} from '@/libs/admin/utils.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { POST } from '../route';
import { DealDocumentType } from '@prisma/client';

jest.mock('@/libs/admin/utils.server', () => ({
  getAdminFromRequest: jest.fn(),
  createDocumentEntry: jest.fn(),
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
}));

describe('POST /api/documents/store-metadata', () => {
  const validPayload = {
    type: 'deal',
    dealId: 42,
    fileName: 'sample.pdf',
    key: 'unique-key',
    path: 'documents/sample.pdf',
    organizationId: null,
    dealDocumentType: DealDocumentType.INVESTMENT_DOCUMENT,
  };

  const adminUser: any = {
    id: 1,
    email: 'admin@example.com',
    role: 'ADMIN',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 500 if getAdminFromRequest throws', async () => {
    jest
      .mocked(getAdminFromRequest)
      .mockRejectedValue(new Error('Auth failed'));

    const req = nextRequestMock(validPayload);
    const res = await POST(req as any);

    expect(res).toEqual(jsonResponse('Auth failed', 500));
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

    const invalidPayload = { ...validPayload, dealId: undefined };
    const req = nextRequestMock(invalidPayload);
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

  it('returns 400 if ID is missing (org or deal)', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);

    const noIdPayload = { ...validPayload, dealId: null, organizationId: null };
    const req = nextRequestMock(noIdPayload);
    const res = await POST(req as any);

    expect(res).toEqual(
      errorResponse('Deal ID is required', 400, { request: expect.any(Object) })
    );
  });

  it('creates document and returns success response', async () => {
    jest.mocked(getAdminFromRequest).mockResolvedValue(adminUser);
    jest.mocked(createDocumentEntry).mockResolvedValue({
      id: 123,
      fileName: 'sample.pdf',
    } as any);

    const req = nextRequestMock(validPayload);
    const res = await POST(req as any);

    expect(createDocumentEntry).toHaveBeenCalledWith(
      'deal',
      42,
      'sample.pdf',
      'documents/sample.pdf',
      'unique-key',
      1,
      DealDocumentType.INVESTMENT_DOCUMENT,
      undefined
    );

    expect(res).toEqual(
      jsonResponse({
        success: true,
        document: {
          id: 123,
          fileName: 'sample.pdf',
        },
      })
    );
  });
});
