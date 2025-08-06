import prisma from '@/libs/prisma.server';
import { createDocumentSignedUrl, validateUser } from '../utils.server';
import { storageClient } from '@/libs/supabase';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { getAuth } from '@clerk/nextjs/server';

const API_PATH = '/any/route';

jest.mock('@clerk/nextjs/server', () => ({
  getAuth: jest.fn(),
}));

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
    deal: {
      findUnique: jest.fn(),
    },
    projectDocument: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    nDAAgreement: {
      findFirst: jest.fn(),
    },
    dealDocument: {
      create: jest.fn(),
    },
    organizationDocument: {
      create: jest.fn(),
    },
  },
}));

jest.mock('@/libs/supabase', () => ({
  storageClient: {
    from: jest.fn(() => ({
      createSignedUploadUrl: jest.fn(),
    })),
  },
}));

describe('document/utils.server.ts', () => {
  describe('validateUser', () => {
    it('returns user when found', async () => {
      const clerkId = 'clerk_123';
      (getAuth as jest.Mock).mockReturnValueOnce({ userId: clerkId });
      const mockUser = {
        id: 1,
        clerkId,
        organizationsOwned: [{ id: 101 }],
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

      const request = nextRequestMock({}, {}, 'GET', API_PATH);
      const result = await validateUser(request);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { clerkId: expect.any(String) },
        include: { organizationsOwned: true },
      });
    });

    it('throws error when user not found', async () => {
      (getAuth as jest.Mock).mockReturnValueOnce({ userId: null });

      const request = nextRequestMock({}, {}, 'GET', API_PATH);
      await expect(validateUser(request)).rejects.toThrow('User not found');
    });

    it('throws error when user not found in prisma', async () => {
      const clerkId = 'clerk_123';
      (getAuth as jest.Mock).mockReturnValueOnce({ userId: clerkId });
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const request = nextRequestMock({}, {}, 'GET', API_PATH);
      await expect(validateUser(request)).rejects.toThrow(
        `User record with clerkid ${clerkId} not found in prisma`
      );
    });
  });

  describe('createDocumentSignedUrl', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('throws error if id is missing', async () => {
      await expect(
        createDocumentSignedUrl('deal', '' as unknown as number, 'file.pdf')
      ).rejects.toThrow('deal ID is required');
    });

    it('throws error if Supabase returns an error', async () => {
      (storageClient.from as jest.Mock).mockReturnValueOnce({
        createSignedUploadUrl: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'storage error' },
        }),
      });

      await expect(
        createDocumentSignedUrl('deal', 123, 'file.pdf')
      ).rejects.toEqual({ message: 'storage error' });
    });

    describe('deal', () => {
      it('returns signed URL when successful', async () => {
        (storageClient.from as jest.Mock).mockReturnValueOnce({
          createSignedUploadUrl: jest.fn().mockResolvedValue({
            data: { signedUrl: 'https://signed-url' },
            error: null,
          }),
        });

        const result = await createDocumentSignedUrl('deal', 123, 'file.pdf');

        expect(storageClient.from).toHaveBeenCalledWith('deal-documents');
        expect(result).toEqual({
          signedUrl: 'https://signed-url',
          folder: 'deal-123',
          bucketName: 'deal-documents',
        });
      });
    });

    describe('organization', () => {
      it('returns signed URL when successful', async () => {
        (storageClient.from as jest.Mock).mockReturnValueOnce({
          createSignedUploadUrl: jest.fn().mockResolvedValue({
            data: { signedUrl: 'https://signed-url-org' },
            error: null,
          }),
        });

        const result = await createDocumentSignedUrl(
          'organization',
          555,
          'orgfile.pdf'
        );

        expect(storageClient.from).toHaveBeenCalledWith(
          'organization-documents'
        );
        expect(result).toEqual({
          signedUrl: 'https://signed-url-org',
          folder: 'organization-555',
          bucketName: 'organization-documents',
        });
      });
    });

    describe('project', () => {
      it('returns signed URL using sanitized projectName', async () => {
        (storageClient.from as jest.Mock).mockReturnValueOnce({
          createSignedUploadUrl: jest.fn().mockResolvedValue({
            data: { signedUrl: 'https://signed-url-project' },
            error: null,
          }),
        });

        const result = await createDocumentSignedUrl(
          'project',
          999,
          'doc.pdf',
          'My Project'
        );

        expect(storageClient.from).toHaveBeenCalledWith('project-documents');
        expect(result).toEqual({
          signedUrl: 'https://signed-url-project',
          folder: 'MyProject',
          bucketName: 'project-documents',
        });
      });

      it('uses empty folder when projectName is missing', async () => {
        (storageClient.from as jest.Mock).mockReturnValueOnce({
          createSignedUploadUrl: jest.fn().mockResolvedValue({
            data: { signedUrl: 'https://signed-url-empty' },
            error: null,
          }),
        });

        const result = await createDocumentSignedUrl('project', 999, 'doc.pdf');

        expect(storageClient.from).toHaveBeenCalledWith('project-documents');
        expect(result).toEqual({
          signedUrl: 'https://signed-url-empty',
          folder: '',
          bucketName: 'project-documents',
        });
      });
    });
  });
});
