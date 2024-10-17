import prisma from "@/libs/prisma";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import type { NextRequest } from "next/server";
import { getUserAndOrg } from "../helpers";
import { isNumber } from "lodash";

/**
 * Remove one member at the time (but not self)
 * @param request
 */
export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const memberId = parseInt(url.pathname.split("/").pop() ?? "");
        if (!memberId || !isNumber(memberId)) {
            throw new Error('userId is required in url');
        }

        const { user: dbUser, organization } = await getUserAndOrg(request, 2);
        if (!organization) {
            return jsonResponse({ error: "Organization not found" }, 404);
        }
        if (!dbUser) {
            return jsonResponse({ error: "User not found" }, 404);
        }

        if (organization.ownerId === memberId) {
            return jsonResponse({ error: "You cannot remove the owner of the organization" }, 403);
        }

        if (organization.ownerId !== dbUser.id) {
            return jsonResponse({ error: "Only org owners can edit organization members" }, 403);
        }

        // get the member to be deleted
        const memberToDelete = organization.members.find(member => member.id === memberId);
        if (!memberToDelete?.user.clerkId) {
            // they are a ghost user, delete them from the db
            console.log("deleting ghost user: ", memberToDelete?.user.id);
            try {
                await prisma.user.delete({ where: { id: memberToDelete?.user.id } });
                const updatedOrg = await prisma.organization.findUnique({
                    where: { id: organization.id },
                    include: { members: { include: { user: true } } }
                });
                return jsonResponse(updatedOrg);
            } catch (deleteError: unknown) {
                console.error("ERROR: unable to delete ghost user from db:\n", deleteError);
                return jsonResponse({ error: `The ghost user could not be deleted from the database:\n${deleteError}` }, 400);
            }
        } else {
            // they already signed up for an account. Only disassociate them from the org
            console.log("disassociating user from org");
            try {
                const updatedOrg = await prisma.organization.update({
                    where: { id: organization.id },
                    data: { members: { delete: { id: memberId } } },
                    include: { members: true }
                });
                return jsonResponse(updatedOrg);
            } catch (deleteError) {
                console.error("ERROR: unable to delete user from org:\n", deleteError);
                return jsonResponse({ error: "The user could not be deleted from the organization" }, 400);
            }
        }

    } catch (error: unknown) {
        return jsonResponse(getErrorMessage(error), 500);
    }
}
