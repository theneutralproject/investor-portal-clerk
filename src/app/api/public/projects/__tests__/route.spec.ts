import prisma from '@/libs/prisma.server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import { GET } from '../route';

// Mock Prisma
jest.mock('@/libs/prisma.server', () => ({
  __esModule: true,
  default: {
    project: {
      findMany: jest.fn(),
    },
  },
}));

describe('GET /api/projects', () => {
  const mockProjects = [
    {
      id: 1,
      slug: 'test-project',
      pictures: [{ id: 1, url: 'pic1.jpg' }],
      milestones: [{ id: 1, title: 'Milestone 1' }],
      investmentStats: { totalInvestment: 100000 },
      propertyStats: { totalUnits: 10 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return projects when a valid slug is provided', async () => {
    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);

    const request: any = nextRequestMock({}, {}, 'GET', '/api/projects?slug=test-project');
    const response = await GET(request);

    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: { slug: 'test-project' },
      include: expect.any(Object),
    });

    expect(response).toEqual(jsonResponse(mockProjects));
  });

  it('should return all projects when no slug is provided', async () => {
    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);

    const request: any = nextRequestMock({}, {}, 'GET', '/api/projects');
    const response = await GET(request);

    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: { slug: undefined },
      include: expect.any(Object),
    });

    expect(response).toEqual(jsonResponse(mockProjects));
  });


  it('should return a 404 error if no projects are found', async () => {
    (prisma.project.findMany as jest.Mock).mockResolvedValue([]);

    const request = nextRequestMock({}, {}, 'GET', '/api/projects?slug=unknown');
    const response = await GET(request as any);

    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: { slug: 'unknown' },
      include: expect.any(Object),
    });

    expect(response).toEqual(
      errorResponse('Projects not found', 404)
    );
  });

  it('should return a 404 error if Prisma throws an error', async () => {
    (prisma.project.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

    const request: any = nextRequestMock({}, {}, 'GET');
    const response = await GET(request);

    expect(prisma.project.findMany).toHaveBeenCalled();
    expect(response).toEqual(
      errorResponse('Projects not found', 404)
    );
  });

  it('should return a 500 error if the URL is invalid', async () => {
    const request: any = nextRequestMock({}, {}, 'GET'); // Simulating an invalid URL scenario
    request.url = undefined;

    const response = await GET(request);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: expect.stringContaining('TypeError'),
    });
  });
});