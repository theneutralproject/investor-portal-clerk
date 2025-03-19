import { getAuth } from '@clerk/nextjs/server';
import { GET } from '../route';
import { nextRequestMock } from '@/mocks/nextRequest.mock';

const API_PATH = '/api/activity';

jest.mock('@clerk/nextjs/server', () => ({
  getAuth: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
}));

global.fetch = jest.fn();

jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    activityFeedItem: {
      findMany: jest.fn(),
    },
  },
}));

import prisma from '@/libs/prisma.server';

describe('GET /api/activity-feed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return activity feed items for authenticated user', async () => {
    const mockActivityItems: any[] = [
      {
        id: 1,
        userId: 100,
        header: 'Investment Completed',
        body: 'Test Body',
        dateCreated: new Date().toISOString(),
      },
      {
        id: 2,
        userId: 100,
        header: 'Document Uploaded',
        body: 'Test Document',
        dateCreated: new Date().toISOString(),
      },
    ];

    (getAuth as jest.Mock).mockReturnValue({
      userId: 'clerkUser123',
      sessionClaims: { metadata: { investorPortalId: 100 } },
    });

    jest
      .spyOn(prisma.activityFeedItem, 'findMany')
      .mockResolvedValueOnce(mockActivityItems);

    const request: any = nextRequestMock({}, {}, 'GET', API_PATH);
    const res = await GET(request);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockActivityItems);
    expect(prisma.activityFeedItem.findMany).toHaveBeenCalledWith({
      where: { userId: 100 },
    });
  });

  it('should return 401 if user is not authenticated', async () => {
    (getAuth as jest.Mock).mockReturnValue({ userId: null });

    const request: any = nextRequestMock({}, {}, 'GET', API_PATH);
    const res = await GET(request);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ error: 'User not authenticated' });
    expect(prisma.activityFeedItem.findMany).not.toHaveBeenCalled();
  });

  it('should return 404 if user has no dbUserId in session claims', async () => {
    (getAuth as jest.Mock).mockReturnValue({
      userId: 'clerkUser123',
      sessionClaims: { metadata: {} },
    });

    const request: any = nextRequestMock({}, {}, 'GET', API_PATH);
    const res = await GET(request);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({
      error: 'User not found',
    });
    expect(prisma.activityFeedItem.findMany).not.toHaveBeenCalled();
  });

  it('should return an empty array if user has no activity feed items', async () => {
    (getAuth as jest.Mock).mockReturnValue({
      userId: 'clerkUser123',
      sessionClaims: { metadata: { investorPortalId: 100 } },
    });

    jest.spyOn(prisma.activityFeedItem, 'findMany').mockResolvedValueOnce([]);

    const request: any = nextRequestMock({}, {}, 'GET', API_PATH);
    const res = await GET(request);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual([]);
    expect(prisma.activityFeedItem.findMany).toHaveBeenCalledWith({
      where: { userId: 100 },
    });
  });

  it('should return 500 if database query fails', async () => {
    (getAuth as jest.Mock).mockReturnValue({
      userId: 'clerkUser123',
      sessionClaims: { metadata: { investorPortalId: 100 } },
    });

    jest
      .spyOn(prisma.activityFeedItem, 'findMany')
      .mockRejectedValueOnce(new Error('Database Error'));

    const request: any = nextRequestMock({}, {}, 'GET', API_PATH);
    const res = await GET(request);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({
      error: 'Error fetching activity feed items',
    });
    expect(prisma.activityFeedItem.findMany).toHaveBeenCalled();
  });
});
