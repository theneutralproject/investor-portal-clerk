import { test, expect } from '@playwright/test';


test.describe("api/projects test", () => {
  test('API get all projects', async ({ page, request }) => {

    const response = await request.get('/api/projects');

    console.log(await response.json());
    expect(response.status()).toBe(200);
    const body = await JSON.parse(await response.text());
    expect(response.headers()['content-type']).toBe('application/json');
    expect(body).toHaveLength(3);
  });

});