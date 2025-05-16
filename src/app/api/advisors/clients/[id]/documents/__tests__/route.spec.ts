import { nextRequestMock } from '@/mocks/nextRequest.mock';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAuth } from '@clerk/nextjs/server';
import { GET } from '../route';

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    user: { findFirst: jest.fn() },
    advisorFirmEmployee: { findFirst: jest.fn() },
    organization: { findFirst: jest.fn() },
    $queryRawUnsafe: jest.fn(),
  },
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('@clerk/nextjs/server', () => ({
  getAuth: jest.fn(),
}));

jest.mock('@/libs/supabase', () => ({
  getSupabaseDownloadUrl: jest.fn().mockResolvedValue('https://mocked-url.com'),
}));

jest.mock('@/libs/advisorFirm/utils.server', () => ({
  mapDocumentTypeSearch: jest.fn().mockReturnValue(null),
}));

describe('GET /api/advisors/clients/[id]/documents', () => {
  const clerkId = 'clerk-abc';
  const investorPortalId = 100;
  const advisorUser: any = {
    id: investorPortalId,
    email: 'advisor@neutral.us',
    role: 'ADVISOR',
    clerkId,
  };
  const advisorFirmEmployee: any = {
    advisorFirm: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    jest
      .mocked(getAuth)
      .mockReturnValue({ userId: null, sessionClaims: null } as any);
    const req = nextRequestMock();
    const res = await GET(req as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(errorResponse('User not authenticated', 401));
  });

  it('should return 404 if no investorPortalId in sessionClaims', async () => {
    jest
      .mocked(getAuth)
      .mockReturnValue({ userId: clerkId, sessionClaims: {} } as any);
    const req = nextRequestMock();
    const res = await GET(req as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(
      errorResponse('User not found', 404, expect.anything())
    );
  });

  it('should return 403 if user is not advisor', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest
      .mocked(prisma.user.findFirst)
      .mockResolvedValue({ ...advisorUser, role: 'USER' });
    const req = nextRequestMock();
    const res = await GET(req as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(
      errorResponse('Unauthorized or not found', 403, expect.anything())
    );
  });

  it('should return 400 if advisor firm not found', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest.mocked(prisma.advisorFirmEmployee.findFirst).mockResolvedValue(null);
    const req = nextRequestMock();
    const res = await GET(req as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(
      errorResponse(
        'User is not assigned to an advisor firm',
        400,
        expect.anything()
      )
    );
  });

  it('should return 404 if organization not found', async () => {
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    jest.mocked(prisma.organization.findFirst).mockResolvedValue(null);
    const req = nextRequestMock();
    const res = await GET(req as any, {
      params: Promise.resolve({ id: '123' }),
    });
    expect(res).toEqual(
      errorResponse('Organization not found', 404, expect.anything())
    );
  });

  it('should return document list when everything is valid', async () => {
    const organization: any = { id: 123, name: 'Acme Corp' };
    jest.mocked(getAuth).mockReturnValue({
      userId: clerkId,
      sessionClaims: { metadata: { investorPortalId } },
    } as any);
    jest.mocked(prisma.user.findFirst).mockResolvedValue(advisorUser);
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(advisorFirmEmployee);
    jest.mocked(prisma.organization.findFirst).mockResolvedValue(organization);
    jest.mocked(prisma.$queryRawUnsafe).mockResolvedValue([
      {
        id: 1,
        name: 'report.pdf',
        type: 'K1',
        projectName: 'Project X',
        dealId: 22,
        projectId: 88,
        dateCreated: new Date('2023-01-01'),
        path: 'some/path/to/file',
        userId: 100,
      },
    ]);

    const req = nextRequestMock({}, {}, 'GET', '?search=test');
    const res = await GET(req as any, {
      params: Promise.resolve({ id: '123' }),
    });

    expect(res).toEqual(
      jsonResponse({
        documents: [
          {
            id: 1,
            name: 'report.pdf',
            type: 'K1',
            projectName: 'Project X',
            dealId: 22,
            projectId: 88,
            clientName: '',
            dateCreated: new Date('2023-01-01'),
            downloadUrl: 'https://mocked-url.com',
          },
        ],
        types: ['K1'],
        organization: {
          id: organization.id,
          name: organization.name,
        },
      })
    );
  });
});
