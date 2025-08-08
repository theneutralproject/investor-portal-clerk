import { getAuth } from '@clerk/nextjs/server';
import {
  DealDocumentType,
  DealFinancingType,
  DocumentType,
  ProjectDocument,
} from '@prisma/client';
import prisma from '@/libs/prisma.server';
import {
  createDocumentSignedUrl,
  createGenericDocumentEntry,
  updateGenericDocumentEntry,
  validateUser,
} from '../utils.server';
import { storageClient } from '@/libs/supabase';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import Logger from '@/libs/logger';

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
      update: jest.fn(),
    },
    nDAAgreement: {
      findFirst: jest.fn(),
    },
    dealDocument: {
      create: jest.fn(),
      update: jest.fn(),
    },
    organizationDocument: {
      create: jest.fn(),
      update: jest.fn(),
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

jest.mock('@/libs/logger', () => ({
  __esModule: true,
  default: {
    log: jest.fn(),
    error: jest.fn(),
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
        createDocumentSignedUrl(
          'deal',
          '' as unknown as number,
          'file.pdf',
          'deal/'
        )
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
        createDocumentSignedUrl('deal', 123, 'file.pdf', `deal-${123}`)
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

        const result = await createDocumentSignedUrl(
          'deal',
          123,
          'file.pdf',
          `deal-${123}`
        );

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

        const id = 555;

        const result = await createDocumentSignedUrl(
          'organization',
          id,
          'orgfile.pdf',
          `organization-${id}`
        );

        expect(storageClient.from).toHaveBeenCalledWith(
          'organization-documents'
        );
        expect(result).toEqual({
          signedUrl: 'https://signed-url-org',
          folder: `organization-${id}`,
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
          `Bakers`
        );

        expect(storageClient.from).toHaveBeenCalledWith('project-documents');
        expect(result).toEqual({
          signedUrl: 'https://signed-url-project',
          folder: 'Bakers',
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

        const result = await createDocumentSignedUrl(
          'project',
          999,
          'doc.pdf',
          ``
        );

        expect(storageClient.from).toHaveBeenCalledWith('project-documents');
        expect(result).toEqual({
          signedUrl: 'https://signed-url-empty',
          folder: '',
          bucketName: 'project-documents',
        });
      });
    });
  });

  describe('createGenericDocumentEntry', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('deal', () => {
      const userId = 10;
      it('creates a deal document', async () => {
        const input = {
          type: 'deal' as const,
          dealId: 1,
          name: 'Deal Doc',
          path: '/deal.pdf',
          key: 'k',
          dealDocumentType: DealDocumentType.VERIFICATION_ACCREDITATION,
        };

        (prisma.dealDocument.create as jest.Mock).mockResolvedValue({ id: 99 });

        const result = await createGenericDocumentEntry(input, userId);
        expect(result).toEqual({ id: 99 });

        expect(prisma.dealDocument.create).toHaveBeenCalledWith({
          data: {
            dealId: input.dealId,
            name: input.name,
            path: input.path,
            type: input.dealDocumentType,
            uploadedById: userId,
            taxYear: undefined,
          },
        });
      });

      it('throws if dealDocumentType is missing', async () => {
        const input = {
          type: 'deal' as const,
          dealId: 1,
          name: 'Deal Doc',
          path: '/deal.pdf',
          key: 'k',
        };

        await expect(
          createGenericDocumentEntry(input as any, userId)
        ).rejects.toThrow('Missing required dealDocumentType field');
        expect(Logger.error).toHaveBeenCalled();
      });

      it('throws if K1 document is missing taxYear', async () => {
        const input = {
          type: 'deal' as const,
          dealId: 1,
          name: 'K1 Doc',
          path: '/k1.pdf',
          key: 'k',
          dealDocumentType: DealDocumentType.K1,
        };

        await expect(
          createGenericDocumentEntry(input as any, userId)
        ).rejects.toThrow('Missing required taxYear field for K1 document');
        expect(Logger.error).toHaveBeenCalled();
      });

      it('logs and throws if prisma.dealDocument.create fails', async () => {
        const errorMessage = 'DB error';
        const input = {
          type: 'deal' as const,
          dealId: 1,
          name: 'Deal Doc',
          path: '/deal.pdf',
          key: 'k',
          dealDocumentType: DealDocumentType.VERIFICATION_ACCREDITATION,
        };

        (prisma.dealDocument.create as jest.Mock).mockRejectedValue(
          new Error(errorMessage)
        );

        await expect(createGenericDocumentEntry(input, userId)).rejects.toThrow(
          errorMessage
        );
        expect(Logger.error).toHaveBeenCalled();
      });
    });

    describe('organization', () => {
      const userId = 11;
      it('creates an organization document', async () => {
        const input = {
          type: 'organization' as const,
          organizationId: 2,
          name: 'Org Doc',
          path: '/org.pdf',
          key: 'org-key',
        };

        (prisma.organizationDocument.create as jest.Mock).mockResolvedValue({
          id: 88,
        });

        const result = await createGenericDocumentEntry(input, userId);
        expect(result).toEqual({ id: 88 });

        expect(prisma.organizationDocument.create).toHaveBeenCalledWith({
          data: {
            organizationId: input.organizationId,
            name: input.name,
            path: input.path,
            key: input.key,
            uploadedById: userId,
          },
        });
      });

      it('logs and throws if prisma.organizationDocument.create fails', async () => {
        const errorMessage = 'Org create failed';
        const input = {
          type: 'organization' as const,
          organizationId: 2,
          name: 'Org Doc',
          path: '/org.pdf',
          key: 'org-key',
        };

        (prisma.organizationDocument.create as jest.Mock).mockRejectedValue(
          new Error(errorMessage)
        );

        await expect(createGenericDocumentEntry(input, userId)).rejects.toThrow(
          errorMessage
        );
        expect(Logger.error).toHaveBeenCalled();
      });
    });

    describe('project', () => {
      const userId = 12;
      it('creates a project document', async () => {
        const input = {
          type: 'project' as const,
          name: 'Project Doc',
          fileName: 'project.pdf',
          description: 'desc',
          link: 'https://example.com',
          projectId: 5,
          dealStage: 1,
          financingTypes: [DealFinancingType.equity],
          documentType: DocumentType.DOCUMENT,
          isPublic: true,
          requiresNDA: false,
        };
        const { type: _, ...updatePayload } = input;

        (prisma.projectDocument.create as jest.Mock).mockResolvedValue({
          id: 77,
        });

        const result = await createGenericDocumentEntry(input, userId);
        expect(result).toEqual({ id: 77 });

        expect(prisma.projectDocument.create).toHaveBeenCalledWith({
          data: updatePayload,
        });
      });

      it('throws if unknown type', async () => {
        const invalid: any = {
          type: 'invalid',
          projectId: 1,
          name: 'Doc',
          path: '/doc.pdf',
        };

        await expect(
          createGenericDocumentEntry(invalid, userId)
        ).rejects.toThrow('Document type not permitted');
        expect(Logger.error).toHaveBeenCalled();
      });

      it('logs and throws if prisma.projectDocument.create fails', async () => {
        const errorMessage = 'Project creation failed';
        const input = {
          type: 'project' as const,
          name: 'Project Doc',
          fileName: 'project.pdf',
          description: 'desc',
          link: 'https://example.com',
          projectId: 5,
          dealStage: 1,
          financingTypes: [DealFinancingType.equity],
          documentType: DocumentType.DOCUMENT,
          isPublic: true,
          requiresNDA: false,
        };

        (prisma.projectDocument.create as jest.Mock).mockRejectedValue(
          new Error(errorMessage)
        );

        await expect(createGenericDocumentEntry(input, userId)).rejects.toThrow(
          errorMessage
        );
        expect(Logger.error).toHaveBeenCalled();
      });
    });
  });

  describe('updateGenericDocumentEntry', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('deal', () => {
      const docId = 1;

      it('updates a deal document', async () => {
        const input = {
          type: 'deal' as const,
          dealDocumentType: DealDocumentType.VERIFICATION_ACCREDITATION,
        };

        jest
          .mocked(prisma.dealDocument.update)
          .mockResolvedValue({ id: docId } as any);

        const result = await updateGenericDocumentEntry(docId, input);

        expect(result).toEqual({ id: docId });
        expect(prisma.dealDocument.update).toHaveBeenCalledWith({
          where: { id: docId },
          data: {
            type: DealDocumentType.VERIFICATION_ACCREDITATION,
            taxYear: undefined,
          },
        });
      });

      it('throws if dealDocumentType is K1 and taxYear is missing', async () => {
        const input = {
          type: 'deal' as const,
          dealDocumentType: DealDocumentType.K1,
        };

        await expect(updateGenericDocumentEntry(docId, input)).rejects.toThrow(
          'Missing required taxYear field for K1 document'
        );
        expect(Logger.error).toHaveBeenCalled();
      });
    });

    describe('organization', () => {
      const docId = 2;

      it('updates an organization document', async () => {
        const input = {
          type: 'organization' as const,
          key: 'some-key',
        };

        jest
          .mocked(prisma.organizationDocument.update)
          .mockResolvedValue({ id: docId } as any);

        const result = await updateGenericDocumentEntry(docId, input);

        expect(result).toEqual({ id: docId });
        expect(prisma.organizationDocument.update).toHaveBeenCalledWith({
          where: { id: docId },
          data: { key: 'some-key' },
        });
      });
    });

    describe('project', () => {
      const docId = 3;

      it('updates a project document', async () => {
        const projectDocument: ProjectDocument = {
          id: 1,
          name: 'Updated Doc',
          fileName: 'updated.pdf',
          link: 'https://updated.com',
          projectId: 5,
          dealStage: 1,
          financingTypes: [DealFinancingType.equity],
          documentType: DocumentType.DOCUMENT,
          isPublic: true,
          requiresNDA: false,
          dateCreated: new Date(),
          dateUpdated: new Date(),
          description: null,
          docusignTemplateId: '1234',
        };

        const input = {
          type: 'project' as const,
          dealStage: 2,
          description: 'Doc Description',
          isPublic: false,
          requiresNDA: true,
        };
        const { type: _, ...updatePayload } = input;

        jest.mocked(prisma.projectDocument.update).mockResolvedValue({
          ...projectDocument,
          ...updatePayload,
        });

        const result = await updateGenericDocumentEntry(docId, input);

        expect(result).toEqual({
          ...projectDocument,
          ...updatePayload,
        });
        expect(prisma.projectDocument.update).toHaveBeenCalledWith({
          where: { id: docId },
          data: expect.objectContaining({
            ...updatePayload,
          }),
        });
      });
    });

    it('throws if type is unsupported', async () => {
      const invalid = {
        type: 'invalid',
      } as any;

      await expect(updateGenericDocumentEntry(99, invalid)).rejects.toThrow(
        'Document type not permitted'
      );
      expect(Logger.error).toHaveBeenCalled();
    });

    it('logs and throws if any update fails', async () => {
      const input = {
        type: 'organization' as const,
        key: 'test-key',
      };
      const error = new Error('DB failure');
      jest.mocked(prisma.organizationDocument.update).mockRejectedValue(error);

      await expect(updateGenericDocumentEntry(88, input)).rejects.toThrow(
        'DB failure'
      );
      expect(Logger.error).toHaveBeenCalledWith(error, null, {
        message: `Error updating document: ${error.message}`,
      });
    });
  });
});
