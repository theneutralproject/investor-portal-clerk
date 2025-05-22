import { DELETE } from '../route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';
import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { clerkClient } from '@clerk/nextjs/server';

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    advisorFirmEmployee: {
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('@/libs/advisorFirm/utils.server', () => ({
  getAdvisorContext: jest.fn(),
}));

jest.mock('@clerk/nextjs/server', () => ({
  clerkClient: jest.fn(),
}));

describe('DELETE /api/advisors/employees/:id', () => {
  const advisorFirm = { id: 123 };
  const validParams = { id: '555' };

  const mockContext = {
    dbUser: { id: 10, role: 'ADVISOR' },
    advisorFirm,
    advisorFirmEmployee: { advisorFirmId: 123 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if not authenticated', async () => {
    jest
      .mocked(getAdvisorContext)
      .mockResolvedValue(errorResponse('User not authenticated', 401));

    const res = await DELETE(nextRequestMock() as any, { params: validParams });
    expect(res).toEqual(errorResponse('User not authenticated', 401));
  });

  it('should return 400 if ID is invalid', async () => {
    jest.mocked(getAdvisorContext).mockResolvedValue(mockContext as any);

    const res = await DELETE(nextRequestMock() as any, {
      params: { id: 'abc' },
    });
    expect(res).toEqual(
      errorResponse('Invalid advisor employee ID', 400, {
        request: expect.anything(),
        extra: { rawId: 'abc' },
      })
    );
  });

  it('should return 404 if employee not found', async () => {
    jest.mocked(getAdvisorContext).mockResolvedValue(mockContext as any);
    jest.mocked(prisma.advisorFirmEmployee.findFirst).mockResolvedValue(null);

    const res = await DELETE(nextRequestMock() as any, { params: validParams });
    expect(res).toEqual(
      errorResponse('Advisor employee not found', 404, {
        request: expect.anything(),
        extra: { employeeId: 555 },
      })
    );
  });

  it('should return 404 if user or clerkId is missing', async () => {
    jest.mocked(getAdvisorContext).mockResolvedValue(mockContext as any);
    jest.mocked(prisma.advisorFirmEmployee.findFirst).mockResolvedValue({
      id: 555,
      advisorFirmId: 123,
      user: null,
    } as any);

    const res = await DELETE(nextRequestMock() as any, { params: validParams });
    expect(res).toEqual(
      errorResponse('Advisor employee not found', 404, {
        request: expect.anything(),
        extra: { employeeId: 555 },
      })
    );
  });

  it('should delete advisor employee and Clerk user', async () => {
    const clerkId = 'clerk-uid-123';
    const employee: any = {
      id: 555,
      advisorFirmId: 123,
      user: {
        id: 999,
        clerkId,
      },
    };

    const deleteUserMock = jest.fn().mockResolvedValue(true);

    jest.mocked(getAdvisorContext).mockResolvedValue(mockContext as any);
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(employee);
    jest
      .mocked(prisma.advisorFirmEmployee.delete)
      .mockResolvedValue(true as any);
    jest
      .mocked(clerkClient)
      .mockResolvedValue({ users: { deleteUser: deleteUserMock } } as any);

    const res = await DELETE(nextRequestMock() as any, { params: validParams });

    expect(prisma.advisorFirmEmployee.delete).toHaveBeenCalledWith({
      where: { id: 555 },
    });
    expect(deleteUserMock).toHaveBeenCalledWith(clerkId);
    expect(res).toEqual(jsonResponse({ success: true }));
  });

  it('should return 500 if deletion fails', async () => {
    const clerkId = 'clerk-uid-123';
    const employee: any = {
      id: 555,
      advisorFirmId: 123,
      user: { id: 999, clerkId },
    };

    jest.mocked(getAdvisorContext).mockResolvedValue(mockContext as any);
    jest
      .mocked(prisma.advisorFirmEmployee.findFirst)
      .mockResolvedValue(employee);
    jest
      .mocked(prisma.advisorFirmEmployee.delete)
      .mockRejectedValue(new Error('fail'));
    jest
      .mocked(clerkClient)
      .mockResolvedValue({ users: { deleteUser: jest.fn() } } as any);

    const res = await DELETE(nextRequestMock() as any, { params: validParams });

    expect(res).toEqual(
      errorResponse('Failed to delete advisor employee', 500, {
        request: expect.anything(),
        extra: { error: expect.any(Error) },
      })
    );
  });
});
