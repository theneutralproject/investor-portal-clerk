
import { OrganizationMemberCreateSchema, zOrganizationMemberCreateSchema } from "@/libs/organization/schema";
import prisma from "@/libs/prisma";
import { createUserInDbAndHubspot } from "@/libs/user/utils";
import { jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import type { NextRequest } from "next/server";


/**
 * Add one member to an org (but not self)
 * Will create a user if they do not yet exist, or add an existing user to the organization
 
 * @param request 
 * returns the user object, and a message
 */
export async function POST(request: NextRequest) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "Clerk user not found" }, 404);
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

    const {dealId, organizationId, user} = postData;

    // 1. make sure that the requester is the owner of the org in question
    const dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        include: {
            organizationsOwned: { include: { members: { include: { user: true } } } },
            // organizationMember: true
        }
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

    if (!dbUser.organizationsOwned.map(org => org.id).includes(organizationId)) {
        console.error(`User ${dbUser.id} is not authorized to edit the organization with id ${organizationId}:\n`);
        return jsonResponse({ error: "You are not the owner of the organization you are looking to edit" }, 401);
    }

    const orgToUpdate = dbUser.organizationsOwned.find(org => org.id === organizationId)

    // check if user already exists as org member:
    const existingMember = orgToUpdate?.members.find(member => member.user.email === user.email);
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
        return jsonResponse({ message: `User already exists and has been added as an org member.`, user: existingUser }, 200);
    }

    // create a new user
    let newUser: User;
    try {
        newUser = await createUserInDbAndHubspot(user, dealId);
        // add them as an org member
        const orgWithMember = await prisma.organization.update({
            where: { id: postData.organizationId },
            data: { members: { connect: { id: newUser.id } } }
        })

    } catch (createUserError) {
        console.error("ERROR: unable to create user:\n", createUserError);
        return jsonResponse({ error: "The user could not be created" }, 400);
    }

    return jsonResponse({ message: `User successfully created.`, user: newUser }, 201);
}


/**
 * Remove one member at the time (but not self)
 * @param request
 */
export async function DELETE(request: NextRequest) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return jsonResponse({ error: "Clerk user not found" }, 404);
    }

    // eslint-disable
    const requestBody = await request.json();
    const { organizationId, userId } = requestBody;
    // eslint-enable

    if (!organizationId || !userId) {
        return jsonResponse({ error: "Input data malformatted" }, 400);
    }

    const organization = await prisma.organization.findUnique({ where: { id: organizationId } });
    if (!organization) {
        return jsonResponse({ error: `Organization with id ${organizationId} not found` }, 404);
    }

    if (organization.ownerId === userId) {
        return jsonResponse({ error: "You cannot remove the owner of the organization" }, 403);
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
        include: {
            organizationsOwned: { include: { members: { include: { user: true } } } },
            // organizationMember: true
        }
    });

    if (!dbUser || organization.ownerId !== dbUser.id) {
        return jsonResponse({ error: "Only org owners can edit organization members" }, 403);
    }
    try {
        const updatedOrg = await prisma.organization.update({ where: { id: organizationId }, data: { members: { disconnect: { id: userId } } } });
        return jsonResponse(updatedOrg);
    } catch (deleteError) {
        console.error("ERROR: unable to delete user from org:\n", deleteError);
        return jsonResponse({ error: "The user could not be deleted from the organization" }, 400);
    }

}