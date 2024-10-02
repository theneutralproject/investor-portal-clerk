/**
 * @jest-environment node
 */
/* eslint-disable */
// https://blog.arcjet.com/testing-next-js-app-router-api-routes/
import { testApiHandler } from "next-test-api-route-handler"; // Must always be first
import {expect} from '@jest/globals';

import * as appHandler from "./route";

xit("GET returns 200", async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: "GET" });
      const json = await response.json();
      expect(response.status).toBe(200);
      //   https://jestjs.io/docs/expect#tohavelengthnumber
      expect(json).toHaveLength(3);
    },
  });
});