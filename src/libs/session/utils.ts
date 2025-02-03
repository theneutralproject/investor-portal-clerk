// this file is a wrapper which defaults to be used in both API routes and `getServerSideProps` functions
// https://github.com/vvo/iron-session/blob/a6c767d425c52575f743e86b64b8b4a4ce64add6/examples/next.js-typescript/lib/session.ts
import type { SessionOptions } from 'iron-session';
import type { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD!,
  cookieName: 'neutral-investor-portal',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
};

// This is where we specify the typings of req.session.*
export interface SessionData {
  docusignJwt?: string;
  docusignExpiresAt?: number;
  adminUserId?: number;
  adminUserEmail?: string;
  adminAuthExpiresAt?: number;
  adminAuthJwt?: string;
}

/**
 * Extracts and decodes the session JWT from Next.js middleware request.
 * @param req - The Next.js middleware request object (NextRequest).
 * @returns Parsed session details or null if invalid.
 */
export function parseSessionFromCookie(req: NextRequest) {
  // Get the cookie from the request
  const sessionToken = req.cookies.get('__session')?.value;
  if (!sessionToken) return null;

  try {
    // Decode the JWT without verification (Clerk signs with RS256, requires public key for verification)
    const decoded = jwt.decode(sessionToken) as JwtPayload | null;
    if (!decoded) return null;

    return {
      userId: decoded.sub || 'unknown',
      sessionId: decoded.sid || 'unknown',
      issuer: decoded.iss || 'unknown',
      expiresAt: decoded.exp
        ? new Date(decoded.exp * 1000).toISOString()
        : 'unknown',
      issuedAt: decoded.iat
        ? new Date(decoded.iat * 1000).toISOString()
        : 'unknown',
    };
  } catch (error) {
    console.error('Error decoding session JWT:', error);
    return null;
  }
}
