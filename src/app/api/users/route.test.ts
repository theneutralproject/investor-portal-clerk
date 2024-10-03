// /**
//  * @jest-environment node
//  */
// /* eslint-disable */
// ! This test needs some work. We need to mock clerk auth because clerk is used in the /api/users route 
// // https://blog.arcjet.com/testing-next-js-app-router-api-routes/

// // https://github.com/Xunnamius/next-test-api-route-handler?tab=readme-ov-file#testing-clerks-official-nextjs-integration--appapiauthed
//  // https://stackoverflow.com/questions/73612470/how-can-i-test-authentication-middleware-with-jest
// import { testApiHandler } from "next-test-api-route-handler"; // Must always be first
// import { expect } from '@jest/globals';

// import * as appHandler from "./route";

// import type { auth } from '@clerk/nextjs';

// let mockedClerkAuthReturnValue: Partial<ReturnType<typeof auth>> | undefined =
//     undefined;

// jest.mock('@clerk/nextjs', () => {
//     return {
//         auth() {
//             return mockedClerkAuthReturnValue;
//         }
//     };
// });

// afterEach(() => {
//     mockedClerkAuthReturnValue = undefined;
// });

// it("GET returns 200", async () => {
//     mockedClerkAuthReturnValue = { userId: 'winning' };
//     await testApiHandler({
//         appHandler,
//         test: async ({ fetch }) => {
//             const response = await fetch({ method: "GET" });
//             const json = await response.json();
//             console.log(json)
//             expect(response.status).toBe(200);
//         },
//     });
// });