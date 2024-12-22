import { AddressCreateSchema } from '@/libs/address/schema';
import prisma from '@/libs/prisma.server';
import { UserWithAddress } from '@/libs/types';
import { test, expect } from '@playwright/test';

test.describe('api/users test', () => {
  // get all users should only return the current user
  test('[GET] get all users', async ({ request }) => {
    const response = await request.get('/api/users');
    expect(response.status()).toBe(200);
    const body = await JSON.parse(await response.text());
    expect(response.headers()['content-type']).toBe('application/json');
    expect(body).toHaveProperty('clerkId');
    expect(body.email).toBe(process.env.E2E_CLERK_USER_USERNAME);
    expect(body).not.toHaveProperty('password');
  });

  // put user should update the user
  test('[PUT] user should return updated user', async ({ request }) => {
    const response = await request.put('/api/users', {
      data: { firstName: 'John', lastName: 'Doe' },
    });
    expect(response.status()).toBe(200);
    const body = await JSON.parse(await response.text());
    expect(response.headers()['content-type']).toBe('application/json');
    expect(body.email).toBe(process.env.E2E_CLERK_USER_USERNAME);
  });

  // put user should return masked social security number
  test('[PUT] user should return masked social security number', async ({
    request,
  }) => {
    const response = await request.put('/api/users', {
      data: { ssn: '123456789' },
    });
    expect(response.status()).toBe(200);
    const body = await JSON.parse(await response.text());
    expect(body.email).toBe(process.env.E2E_CLERK_USER_USERNAME);
    expect(body.ssn).toBe('***-**-6789');
  });

  // put user should return 400 if ssn.length !== 9
  test('[PUT] user should return 400 if ssn.length !== 9', async ({
    request,
  }) => {
    const response = await request.put('/api/users', {
      data: { ssn: '123-456-78' },
    });
    expect(response.status()).toBe(400);
  });

  test('[PUT] user should ignore ssn. if it start with `***-`', async ({
    request,
  }) => {
    const response = await request.put('/api/users', {
      data: { ssn: '***-**-abcd', firstName: 'Johnny' },
    });
    expect(response.status()).toBe(200);
    const body = await JSON.parse(await response.text());
    expect(body.email).toBe(process.env.E2E_CLERK_USER_USERNAME);
    expect(body.firstName).toBe('Johnny');
    expect(body.ssn).toBe('***-**-6789');
  });

  // put user with address should return updated user with a new address
  test('[PUT] user with address should return updated user with a new address', async ({
    request,
  }) => {
    const addressData: AddressCreateSchema = {
      street: '1234 User Test St',
      city: 'User Testville',
      state: 'TS',
      zipcode: '12345',
      country: 'USA',
    };
    const response = await request.put('/api/users', {
      data: { address: addressData },
    });
    expect(response.status()).toBe(200);
    const body: UserWithAddress = await JSON.parse(await response.text());
    const { address, ...userData } = body;
    expect(userData.email).toBe(process.env.E2E_CLERK_USER_USERNAME);
    expect(address!.userId).toBe(userData.id);
    expect(address!.street).toBe(addressData.street);
  });

  test.afterEach(async ({ request }) => {
    const response = await request.put('/api/users', {
      data: { firstName: 'Testi', lastName: 'Tester' },
    });
    const body = await JSON.parse(await response.text());
    expect(body.firstName).toBe('Testi');
    if (body.address) {
      await prisma.address.delete({ where: { id: body.address.id } });
    }
  });
});
