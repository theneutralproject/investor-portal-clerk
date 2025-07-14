import prisma from '@/libs/prisma.server';
import { ChangelogPayload, createChangeLog } from '../utils.server';

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    changelog: { create: jest.fn() },
  },
}));

describe('changelog/utils.server', () => {
  describe('createChangeLog', () => {
    const mockPayload = {
      userId: 1,
      entityId: 123,
      entityName: 'TestEntity',
      newValue: { foo: 'bar', nested: { key: 'value', number: 123 } },
      previousValue: {},
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create a changelog entry with required fields', async () => {
      const expectedResult = { id: 1, createdAt: new Date(), ...mockPayload };

      jest
        .mocked(prisma.changelog.create)
        .mockResolvedValue(expectedResult as any);

      const result = await createChangeLog(mockPayload);

      expect(prisma.changelog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockPayload.userId,
          entityId: mockPayload.entityId,
          entityName: mockPayload.entityName,
          newValue: mockPayload.newValue,
          previousValue: {},
          createdAt: expect.any(Date),
        }),
      });

      expect(result).toEqual(expectedResult);
    });

    it('should use provided previousValue if available', async () => {
      const payloadWithPrev: ChangelogPayload = {
        ...mockPayload,
        previousValue: { foo: 'baz', bar: undefined },
      };

      jest.mocked(prisma.changelog.create).mockResolvedValue({
        id: 2,
        createdAt: new Date(),
        ...payloadWithPrev,
      } as any);

      const result = await createChangeLog(payloadWithPrev);

      expect(prisma.changelog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          previousValue: payloadWithPrev.previousValue,
        }),
      });

      expect(result.id).toBe(2);
    });
  });
});
