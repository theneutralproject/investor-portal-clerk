/**
 * @jest-environment node
 */
// *from https://www.npmjs.com/package/next-test-api-route-handler#testing-clerks-official-nextjs-integration--appapiauthed
import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';

import type { auth } from '@clerk/nextjs';

let mockedClerkAuthReturnValue: Partial<ReturnType<typeof auth>> | undefined =
  undefined;

jest.mock('@clerk/nextjs', () => {
  return {
    auth() {
      return mockedClerkAuthReturnValue;
    }
  };
});

afterEach(() => {
  mockedClerkAuthReturnValue = undefined;
});

xit('returns isAuthed: true and a userId when authenticated', async () => {
  expect.hasAssertions();

  mockedClerkAuthReturnValue = { userId: 'user_2mrngBLCBrBuUQxpV1B90ngAjcm' };

  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
        const resp = (await fetch()).json();
      await expect(resp).resolves.toStrictEqual({
        isAuthed: true,
        userId: 'user_2mrngBLCBrBuUQxpV1B90ngAjcm'
      });
    }
  });
});

xit('returns isAuthed: false and nothing else when unauthenticated', async () => {
  expect.hasAssertions();

  mockedClerkAuthReturnValue = { userId: null };

  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      await expect((await fetch()).json()).resolves.toStrictEqual({
        isAuthed: false,
        userId: null
      });
    }
  });
});