import { test, expect } from '@playwright/test';
import { resetOrgInDb } from '../helpers';
import { MembershipType, Organization } from '@prisma/client';

test.describe("api/organizations/members test", () => {
    let testOrg: Organization | null = null;
    let userId: number | null = null;
    test.beforeAll(async ({ request }) => {
        testOrg = await resetOrgInDb(request)
    });

    test('[POST] api/organizations/members should create a new user, if they dont already exist', async ({ request }) => {

        if (!testOrg) {
            console.error("testOrg is null - skipping test");
            test.fixme();
            return;
        }
        const response = await request.post(`/api/organizations/${testOrg.id}/members`, {
            data: {
                user: {
                    email: 'NewtonTester@test.org',
                    firstName: 'Newton',
                    lastName: 'Tester',
                }, type: MembershipType.COINVESTOR
            }
        });
        
        expect(response.status()).toBe(201);
        const body = await JSON.parse(await response.text());
        console.log(body);
        userId = body.id;
        expect(body.email).toBe('NewtonTester@test.org');
    });


    test.afterAll(async ({ request }) => {
        if (!testOrg) {
            console.error("testOrg is null - skipping test");
            test.fixme();
            return;
        };
        if (!userId) {
            console.error("userId is null - skipping test");
            test.fixme();
            return;
        };

        await request.delete(`/api/organizations/${testOrg.id}/members/${userId}`);
    })
});
