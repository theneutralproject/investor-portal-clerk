import { NextURL } from 'next/dist/server/web/next-url';
import type { NextRequest } from 'next/server';

export function nextRequestMock(
  body: Record<string, any> = {},
  headers: Record<string, string> = {},
  method: string = 'POST',
  pathname: string = '/api/test',
  cookies: Record<string, string> = {}
): Partial<NextRequest> {
  return {
    json: jest.fn().mockResolvedValue(body),
    headers: new Headers(headers),
    method,
    nextUrl: { pathname } as NextURL,
    cookies: {
      get: jest.fn((name: string) => ({ value: cookies[name] })),
      has: jest.fn((name: string) => Boolean(cookies[name])),
    } as any,
  };
}
