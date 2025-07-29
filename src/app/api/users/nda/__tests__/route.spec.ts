import { POST } from '../route'; // adjust path to your route
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import prisma from '@/libs/prisma.server';
import { getAuth } from '@clerk/nextjs/server';

jest.mock('@clerk/nextjs/server', () => ({
  getAuth: jest.fn(),
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
    nDAAgreement: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('/api/users/nda', () => {
  const CURRENT_REVISION = parseInt(
    process.env.NEXT_PUBLIC_CURRENT_NDA_REVISION || '1',
    10
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/nda', () => {
    it('should return 404 if Clerk user is not found', async () => {
      jest.mocked(getAuth).mockReturnValue({ userId: null } as any);

      const res = await POST(nextRequestMock() as any);
      expect(res).toEqual(
        errorResponse('Clerk user not found', 404, {
          request: expect.anything(),
        })
      );
    });

    it('should return 404 if user is not found in database', async () => {
      jest.mocked(getAuth).mockReturnValue({ userId: 'clerk123' } as any);
      jest.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const res = await POST(nextRequestMock() as any);
      expect(res).toEqual(
        errorResponse('User not found in database', 404, {
          request: expect.anything(),
        })
      );
    });

    it('should return NDA already accepted if revision matches', async () => {
      const nda = {
        id: 1,
        userId: 10,
        accepted: true,
        revision: CURRENT_REVISION,
        dateSigned: new Date(),
      };
      jest.mocked(getAuth).mockReturnValue({ userId: 'clerk123' } as any);
      jest.mocked(prisma.user.findUnique).mockResolvedValue({ id: 10 } as any);
      jest.mocked(prisma.nDAAgreement.findUnique).mockResolvedValue(nda);

      const res = await POST(nextRequestMock() as any);
      expect(res).toEqual(
        jsonResponse({
          meta: { success: true, message: 'NDA already accepted' },
          data: { ndaAgreement: nda },
        })
      );
    });

    it('should update NDA if it exists but revision is outdated', async () => {
      const newNDA = {
        id: 1,
        userId: 10,
        accepted: true,
        revision: CURRENT_REVISION,
        dateSigned: new Date(),
      };
      jest.mocked(getAuth).mockReturnValue({ userId: 'clerk123' } as any);
      jest.mocked(prisma.user.findUnique).mockResolvedValue({ id: 10 } as any);
      jest.mocked(prisma.nDAAgreement.findUnique).mockResolvedValue({
        id: 1,
        userId: 10,
        accepted: true,
        revision: 0, // outdated
        dateSigned: new Date(),
      });
      jest.mocked(prisma.nDAAgreement.update).mockResolvedValue(newNDA);

      const res = await POST(nextRequestMock() as any);
      expect(prisma.nDAAgreement.update).toHaveBeenCalledWith({
        where: { userId: 10 },
        data: {
          revision: CURRENT_REVISION,
          dateSigned: expect.any(Date),
          accepted: true,
        },
      });
      expect(res).toEqual(
        jsonResponse({
          meta: { success: true, message: 'NDA accepted' },
          data: { ndaAgreement: newNDA },
        })
      );
    });

    it('should create NDA if none exists', async () => {
      const nda = {
        id: 2,
        userId: 10,
        accepted: true,
        revision: CURRENT_REVISION,
        dateSigned: new Date(),
      };
      jest.mocked(getAuth).mockReturnValue({ userId: 'clerk123' } as any);
      jest.mocked(prisma.user.findUnique).mockResolvedValue({ id: 10 } as any);
      jest.mocked(prisma.nDAAgreement.findUnique).mockResolvedValue(null);
      jest.mocked(prisma.nDAAgreement.create).mockResolvedValue(nda);

      const res = await POST(nextRequestMock() as any);
      expect(prisma.nDAAgreement.create).toHaveBeenCalledWith({
        data: {
          revision: CURRENT_REVISION,
          dateSigned: expect.any(Date),
          accepted: true,
          userId: 10,
        },
      });
      expect(res).toEqual(
        jsonResponse({
          meta: { success: true, message: 'NDA accepted' },
          data: { ndaAgreement: nda },
        })
      );
    });

    it('should return 500 on database error', async () => {
      jest.mocked(getAuth).mockReturnValue({ userId: 'clerk123' } as any);
      jest.mocked(prisma.user.findUnique).mockResolvedValue({ id: 10 } as any);
      jest
        .mocked(prisma.nDAAgreement.findUnique)
        .mockRejectedValue(new Error('DB error'));

      const res = await POST(nextRequestMock() as any);
      expect(res).toEqual(
        errorResponse('Error accepting NDA', 500, {
          request: expect.anything(),
          extra: {
            error: expect.any(Error),
            userId: 'clerk123',
            payload: expect.any(Object),
          },
        })
      );
    });
  });
});
