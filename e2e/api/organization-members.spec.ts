import { test, expect } from '@playwright/test';
import { resetOrgInDb } from '../helpers';
import { MembershipType, Organization } from '@prisma/client';
import { MemberWithUser } from '@/libs/prisma';

test.describe("api/organizations/members test", () => {
    test.skip();
    let testOrg: Organization | null = null;
    let memberId: number | null = null;
    const memberData = {
        user: {
            email: 'NewtonTester@test.org',
            firstName: 'Newton',
            lastName: 'Tester',
        }, type: MembershipType.COINVESTOR
    }

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
            data: memberData
        });

        expect(response.status()).toBe(201);
        const body = await JSON.parse(await response.text());
        if (body.id) {
            // find the user in the list of members
            const newMember: MemberWithUser = body.members.find((member: MemberWithUser) => member.user.email === memberData.user.email);
            memberId = newMember.id;
            expect(newMember.user.email).toBe(memberData.user.email);
        }
        else {
            console.error("No org returned from POST request - skipping test");
            console.error(body);
            test.fixme();
        }
    });


    test.afterEach(async ({ request }) => {
        console.log(`cleaning up after member tests for org ${testOrg?.id} and member ${memberId}`);
        if (!testOrg) {
            console.error("testOrg is null - skipping test");
            test.fixme();
            return;
        };
        if (!memberId) {
            console.error("memberId is null - skipping test");
            test.fixme();
            return;
        };

        await request.delete(`/api/organizations/${testOrg.id}/members/${memberId}`);
    })
});
