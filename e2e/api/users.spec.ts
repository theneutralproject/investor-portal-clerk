import { test, expect } from '@playwright/test';


test.describe("api/users test", () => {
    // get all users should only return the current user
    test('API get all users', async ({ request }) => {
        const response = await request.get('/api/users');
        expect(response.status()).toBe(200);
        const body = await JSON.parse(await response.text());
        expect(response.headers()['content-type']).toBe('application/json');
        expect(body).toHaveProperty('clerkId');
        expect(body.email).toBe(process.env.E2E_CLERK_USER_USERNAME);
        expect(body).not.toHaveProperty('password');
    });

    // put user should update the user
    test('API put user should return updated user', async ({ request }) => {
        const response = await request.put('/api/users', {
            data: { firstName: 'John', lastName: 'Doe' }
        });
        expect(response.status()).toBe(200);
        const body = await JSON.parse(await response.text());
        expect(response.headers()['content-type']).toBe('application/json');
        expect(body.email).toBe(process.env.E2E_CLERK_USER_USERNAME);
    });  

    // put user should return masked social security number
    test('API put user should return masked social security number', async ({ request }) => {
        const response = await request.put('/api/users', {
            data: { ssn: '123456789' }
        });
        expect(response.status()).toBe(200);
        const body = await JSON.parse(await response.text());
        expect(body.email).toBe(process.env.E2E_CLERK_USER_USERNAME);
        expect(body.ssn).toBe('***-**-6789');
    });

    // put user should return 400 if ssn.length !== 9
    test('API put user should return 400 if ssn.length !== 9', async ({ request }) => {
        const response = await request.put('/api/users', {
            data: { ssn: '123-456-78' }
        });
        expect(response.status()).toBe(400);
    });

    test.afterEach(async ({ request }) => {
        await request.put('/api/users', {
            data: { firstName: 'Testi', lastName: 'Tester' }
        });
    });

});

