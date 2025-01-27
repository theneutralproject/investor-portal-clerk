// this file is a wrapper which defaults to be used in both API routes and `getServerSideProps` functions
// https://github.com/vvo/iron-session/blob/a6c767d425c52575f743e86b64b8b4a4ce64add6/examples/next.js-typescript/lib/session.ts
import type { SessionOptions } from 'iron-session';

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
