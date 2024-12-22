import { test, expect } from '@playwright/test';

test.describe('[GET] api/public/projects test', () => {
  test('API get all projects', async ({ request }) => {
    console.log('GET /api/public/projects');
    const response = await request.get('/api/public/projects');
    expect(response.status()).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await JSON.parse(await response.text());
    expect(response.headers()['content-type']).toBe('application/json');
    expect(body).toHaveLength(3);
  });
});
