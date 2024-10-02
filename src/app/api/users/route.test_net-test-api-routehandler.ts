// /**
//  * @jest-environment node
//  */
// /* eslint-disable */
// /**
//  * ! This test needs some work. We need to mock clerk auth because clerk is used in the /api/users route
//  */

// // https://blog.arcjet.com/testing-next-js-app-router-api-routes/

// // https://github.com/Xunnamius/next-test-api-route-handler?tab=readme-ov-file#testing-clerks-official-nextjs-integration--appapiauthed
// // https://stackoverflow.com/questions/73612470/how-can-i-test-authentication-middleware-with-jest

// import { testApiHandler } from "next-test-api-route-handler"; // Must always be first
// import { expect } from '@jest/globals';

// import * as appHandler from "./route";

// import { default as middleware } from '../../../middleware';
// import { NextFetchEvent, NextRequest } from 'next/server';
// import { NextMiddlewareResult } from "next/dist/server/web/types";

// it('returns isAuthed: true and a userId when authenticated', async () => {
//     expect.hasAssertions();
//     const url = 'ntarh://app/api/users'
//     await testApiHandler({
//         rejectOnHandlerError: true,
//         // You may want to alter the default URL pathname like below if your Clerk
//         // middleware is using path-based filtering. By default, the pathname
//         // will always be '/' because 'ntarh://testApiHandler/' is the default url
//         url,
//         appHandler: {
//             get GET() {
//                 return async function (...args: Parameters<typeof appHandler.GET>) {
//                     const request = new NextRequest(url, {headers: {'Authorization': `Bearer ${process.env.TEST_USER_TOKEN}`}})
//                     // const request = args.at(0) as unknown as NextRequest;
//                     let middlewareResponse: NextMiddlewareResult
//                     try{
//                         console.log("pre mid")
//                         middlewareResponse = await middleware(request, {} as NextFetchEvent);
//                         console.log("post mid")
//                     } catch(err) {
                        
//                         console.log("middleware error")
//                         console.log(err)
//                     }

//                     // Make sure we're not being redirected to the sign in page since
//                     // this is a publicly available endpoint
//                     // expect(middlewareResponse?.headers.get('location')).toBeNull();
//                     expect(middlewareResponse?.status).toBe(200);
// console.log("pre handlerResp")
//                     const handlerResponse = await appHandler.GET(...args);

//                     console.log("post handlerResp")
//                     // You could run some expectations here (since rejectOnHandlerError is
//                     // true), or you can run your remaining expectations in the test
//                     // function below. Either way is fine.

//                     return handlerResponse;
//                 };
//             }
//         },
//         test: async ({ fetch }) => {
//             const resp = (await fetch()).json();
//             // console.log(resp)
//             await expect(resp).resolves.toStrictEqual({
//                 isAuthed: true,
//                 //   userId: DUMMY_CLERK_USER_ID
//             });
//         }
//     });
// });



// xit("GET returns 200", async () => {
//     // mockedClerkCurrentUserReturnValue = { id: "adb" };
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