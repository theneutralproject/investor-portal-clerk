
import { OrganizationMemberCreateSchema, zOrganizationMemberCreateSchema } from "@/libs/organization/schema";
import prisma from "@/libs/prisma";
import { createUserInDbAndHubspot } from "@/libs/user/utils";
import { jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import type { NextRequest } from "next/server";


// TODO: This POST route is incomplete! We need to decide on the UI first
/**
 * Add one member at the time (but not self)
 * Will create a user if they do not yet exist, and then send them an invite via clerk to join the portal
 * @param request 
 */
export async function POST(request: NextRequest) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "Clerk user not found" }, 404);
    }

    // 1. make sure that the requester has access to the org in question
    const dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        include: { organization: { include: { members: true } } }
    });

    if (!dbUser) {
        console.error(`User record with clerkid ${clerkUser.id} not found in prisma (GET)`);
        return jsonResponse(
            {
                error: `User record with clerkid ${clerkUser.id} not found in prisma (GET)`,
            },
            404
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const requestBody = await request.json();
    let postData: OrganizationMemberCreateSchema;

    try {
        postData = zOrganizationMemberCreateSchema.parse(requestBody)
    } catch (parseError) {
        console.error("unable to parse POST body:\n", parseError);
        return jsonResponse({ error: "Input data malformatted" }, 400);
    }

    if (!dbUser.organization.map(org => org.id).includes(postData.organizationId)) {
        console.error(`User ${dbUser.id} is not authorized to edit the organization with id ${postData.organizationId}:\n`);
        return jsonResponse({ error: "You are not a member of the organization" }, 401);
    }

    const orgToUpdate = dbUser.organization.find(org => org.id === postData.organizationId)

    // check if user already exists:
    if (orgToUpdate?.members.find(user => user.email === postData.user.email)) {
        console.error(`User ${postData.user.email} is already a member of the organization ${postData.organizationId}:\n`);
        // return jsonResponse({ error: "User (email) already exists as a member of the specified organization" }, 403);

        // lets update them with all the information we have

    }

    // TODO user does not yet exist in org. See if they already exist in the db:
    const existingUser = await prisma.user.findUnique({ where: { email: postData.user.email } });
    let userToAdd: User;
    if (existingUser) {

    }

    // create them o
    try {
        userToAdd = await createUserInDbAndHubspot(postData.user);
        // add them as an org member
        const orgWithMember = await prisma.organization.update({
            where: { id: postData.organizationId },
            data: { members: { connect: { id: userToAdd.id } } }
        })

    } catch (createUserError) {
        console.error("ERROR: unable to create user:\n", createUserError);
        return jsonResponse({ error: "The user could not be created" }, 400);
    }

}

/**
 * Remove one member at the time (but not self)
 * @param request 
 */
export async function DELETE(request: NextRequest) {

}