import { AddressCreateSchema } from '@/libs/address/schema';
import { OrganizationUpdateSchema } from '@/libs/organization/schema';
import prisma from '@/libs/prisma.server';
import { OrganizationWithMembersAndAddress } from '@/libs/types';
import { test, expect } from '@playwright/test';
import { DealOwnershipType, Organization } from '@prisma/client';
import { resetOrgInDb } from 'e2e/helpers';


// bundled so that they are not run in parallel (for cleanup purposes)
test.describe("api/organizations tests", () => {
    test.describe("[GET] api/organizations", () => {
        let testOrg: Organization | null = null;
        test.beforeAll(async ({ request }) => {
            testOrg = await resetOrgInDb(request)
        });
        test('Get all organizations returns an array with one org', async ({ request }) => {
            console.log(testOrg);
            console.log("running get all orgs test");
            const response = await request.get('/api/organizations');
            expect(response.status()).toBe(200);
            const body = await JSON.parse(await response.text());
            expect(response.headers()['content-type']).toBe('application/json');
            expect(body).toHaveLength(1);
            const org = body[0] as Organization;
            console.log("org", org)
            expect(org).toHaveProperty('name');
            expect(org.name).toContain('Tester');
            expect(org.ownershipType).toBe(DealOwnershipType.INDIVIDUAL);
        });

        test('Get one organization by id returns the organization', async ({ request }) => {
            if (!testOrg) {
                console.error("testOrg is null - skipping test");
                return;
            };
            const response = await request.get(`/api/organizations/${testOrg.id}`);
            expect(response.status()).toBe(200);
            const body = await JSON.parse(await response.text());
            expect(response.headers()['content-type']).toBe('application/json');
            expect(body).toHaveProperty('name');
            expect(body.id).toBe(testOrg.id);
            expect(body.ownershipType).toBe(DealOwnershipType.INDIVIDUAL);
        });

    });

    test.describe("[PUT] api/organizations", () => {
        let testOrg: Organization | null = null;
        test.beforeAll(async ({ request }) => {
            testOrg = await resetOrgInDb(request)
        });

        test('put organization should return updated organization', async ({ request }) => {
            if (!testOrg) {
                console.error("testOrg is null - skipping test");
                return;
            };
            const response = await request.put(`/api/organizations/${testOrg.id}`, {
                data: {
                    name: 'John Doe Organization',
                    tin: '123456789',
                } as OrganizationUpdateSchema
            });
            expect(response.status()).toBe(200);
            const body = await JSON.parse(await response.text());
            expect(response.headers()['content-type']).toBe('application/json');
            expect(body.name).toBe('John Doe Organization');
            expect(body.tin).toBe('***-**-6789');
        });

        test('API put organization should return 400 if tin.length !== 9', async ({ request }) => {
            if (!testOrg) {
                console.error("testOrg is null - skipping test");
                test.fixme();
                return;
            };
            const response = await request.put(`api/organizations/${testOrg.id}`, {
                data: { tin: '123-456-78' }
            });
            expect(response.status()).toBe(400);
        });

        test("API should ignore masked TIN when updating organization", async ({ request }) => {
            if (!testOrg) {
                console.error("testOrg is null - skipping test");
                test.fixme();
                return;
            };
            const response = await request.put(`/api/organizations/${testOrg.id}`, {
                data: { tin: '***-**-1234', name: 'That Org' }
            });
            expect(response.status()).toBe(200);
            const body = await JSON.parse(await response.text());
            expect(response.headers()['content-type']).toBe('application/json');
            expect(body.tin).toBe('***-**-6789');
            expect(body.name).toBe('That Org');
        });

        test('API should return 400 if ownershipType is not INDIVIDUAL and org is primary', async ({ request }) => {
            if (!testOrg) {
                console.error("testOrg is null - skipping test");
                test.fixme();
                return;
            };
            const response = await request.put(`/api/organizations/${testOrg.id}`, {
                data: {
                    ownershipType: DealOwnershipType.CORPORATION
                }
            });
            expect(await response.text()).toContain('Cannot update primary organization to non-INDIVIDUAL ownership type');
            expect(response.status()).toBe(400);
        });

        // reset the organization name after all tests
        test.afterAll(async () => {
            if (!testOrg) {
                console.error("testOrg is null - skipping test");
                return;
            };
            await prisma.organization.update({
                where: { id: testOrg.id }, data: { name: "Testi Tester's Organization" }
            });
        });
    });

    test.describe("[PUT] organization address tests", () => {
        let testOrg: OrganizationWithMembersAndAddress | null = null;
        const addressData: AddressCreateSchema = {
            street: '1234 Org Test St',
            city: 'Org Testville',
            state: 'TS',
            zipcode: '12345',
            country: 'USA'
        }
        test('API should return organization with new address', async ({ request }) => {
            testOrg = await resetOrgInDb(request);
            if (!testOrg) {
                console.error("testOrg is null - skipping test");
                return;
            };
            const response = await request.put(`/api/organizations/${testOrg.id}`, {
                data: { address: addressData }
            });
            expect(response.status()).toBe(200);
            const body = await JSON.parse(await response.text());
            expect(response.headers()['content-type']).toBe('application/json');
            expect(body.address?.street).toBe(addressData.street);
        });

        test.afterEach(async () => {
            if (!testOrg || !testOrg.address) {
                console.error(`testOrg with id ${testOrg?.id} is null or without address - skipping test`);
                return;
            };
            await prisma.address.delete({
                where: { organizationId: testOrg.id }
            });
        });
    })

    test.describe("[POST] api/organizations tests", () => {
        let orgId: number;
        test('API post organization should return new organization', async ({ request }) => {
            const response = await request.post('/api/organizations', {
                data: {
                    name: 'Jane Doe Organization',
                    ownershipType: DealOwnershipType.CORPORATION,
                    tin: '987654321',
                    dateOfCreation: new Date(),
                    juristication: 'US'
                }
            })
            console.log("response", await (response.text()));
            const body = await JSON.parse(await response.text()) as Organization | null;
            console.log("new org", body);
            if (!body) {
                console.error("new org is null - skipping test");
                return
            }
            orgId = body.id;
            expect(response.status()).toBe(201);
            expect(response.headers()['content-type']).toBe('application/json');
            expect(body.name).toBe('Jane Doe Organization');
            expect(body.tin).toBe('***-**-4321');
            expect(body.juristication).toBe('US');
            expect(body.dateOfCreation).toBeDefined();
        });

        test('API post organization should name the org based on the ownership type', async ({ request }) => {
            const response = await request.post('/api/organizations', {
                data: {
                    ownershipType: DealOwnershipType.CORPORATION,
                    juristication: 'US'
                }
            })

            const body = await JSON.parse(await response.text()) as Organization;
            console.log(body);
            orgId = body.id;
            expect(response.status()).toBe(201);
            expect(response.headers()['content-type']).toBe('application/json');
            expect(body.name).toBe('Corporation of Testi Tester');
            expect(body.dateOfCreation).toBeDefined();
        });


        test.afterEach(async ({ request }) => {
            console.log("deleting org", orgId);
            await request.delete(`/api/organizations/${orgId}`);
        });
    });

});
