import { type OrganizationMemberCreateSchema, zOrganizationMemberCreateSchema } from "@/libs/organization/schema";
import prisma, { type OrganizationWithFullMembers } from "@/libs/prisma";
import { createUserInDbAndHubspot } from "@/libs/user/utils";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import type { User } from "@prisma/client";
import type { NextRequest } from "next/server";
import { getUserAndOrg } from "./helpers";
import { sanitizeOrganizationWithMembers } from "@/libs/organization/utils";


/**
 * Add one member to an org (but not self)
 * Will create a user if they do not yet exist, or add an existing user to the organization
 
 * @param request 
 * returns the updated organization: OrganizationWithMembersAndAddress
 */
export async function POST(request: NextRequest) {
    try {
        const { user: dbUser, organization } = await getUserAndOrg(request, 1);
        if (!organization) {
            throw new Error("Organization not found");
        }
        if (!dbUser) {
            throw new Error("User not found");
        }

        const requestBody = (await request.json()) as OrganizationMemberCreateSchema;
        console.log("requestBody", requestBody);
        let postData: OrganizationMemberCreateSchema;

        try {
            postData = zOrganizationMemberCreateSchema.parse(requestBody)
        } catch (parseError) {
            console.error("unable to parse POST body:\n", parseError);
            return jsonResponse({ error: `Input data malformatted: \n${(parseError as Error).message}` }, 400);
        }

        const { dealId, user } = postData;

        // 1. make sure that the requester is the owner of the org in question
        if (organization.ownerId !== dbUser.id) {
            console.error(`User ${dbUser.id} is not authorized to edit the orgToUpdate with id ${organization.id}:\n`);
            return jsonResponse({ error: "You are not the owner of the organization you are looking to edit" }, 401);
        }

        // check if user already exists as org member:
        const existingMember = organization.members.find(member => member.user.email === user.email);
        if (existingMember) {
            return jsonResponse({ error: `User ${user.email} already exists as a member of the specified organization` }, 403);
        }

        // user does not yet exist in org. See if they already exist in the db:
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: user.email },
                    { phoneNumber: user.phoneNumber }
                ]
            }
        });
        if (existingUser) {
            try {
                const updatedOrg: OrganizationWithFullMembers = await prisma.organization.update({
                    where: { id: organization.id },
                    data: { members: { create: { userId: existingUser.id, type: postData.type } } },
                    include: {
                        members: { include: { user: true } },
                    }
                });
                return jsonResponse(sanitizeOrganizationWithMembers(updatedOrg), 201);
            } catch (error) {
                console.error(`ERROR: unable to CONNECT existing user to org with id ${organization.id}:\n`, error);
                return jsonResponse(getErrorMessage(error), 400);
            }
        }

        // create a new user
        let newUser: User;
        try {
            newUser = await createUserInDbAndHubspot(user, dealId);

        } catch (createUserError) {
            console.error("ERROR: unable to create user:\n", createUserError);
            return jsonResponse({ error: "The user could not be created" }, 400);
        }

        try {
            // add them as an org member
            const updatedOrg: OrganizationWithFullMembers = await prisma.organization.update({
                where: { id: organization.id },
                data: { members: { create: { userId: newUser.id, type: postData.type } } },
                include: {
                    members: { include: { user: true } },
                }
            });
            return jsonResponse(sanitizeOrganizationWithMembers(updatedOrg), 201);
        } catch (error) {
            console.error(`ERROR: unable to CONNECT new user to org with id ${organization.id}:\n`, error);
            return jsonResponse(getErrorMessage(error), 400);
        }

    } catch (error: unknown) {
        console.error("ERROR: unable to add user to org:\n", error);
        return jsonResponse(getErrorMessage(error), 400);
    }
}
