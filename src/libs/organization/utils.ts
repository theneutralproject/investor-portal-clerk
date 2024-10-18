import type { Organization } from "@prisma/client"
import { decryptData } from "../encryption/utils"
import type { OrganizationWithFullMembers, OrganizationWithMembersAndAddress } from "../prisma"

export function sanitizeOrganization(organization: Organization | OrganizationWithMembersAndAddress) {
    return {
        ...organization,
        tin: organization.tin ? `***-**-${decryptData(organization.tin).slice(-4)}` : null,
    }
}

export function sanitizeOrganizationWithMembers(orgWithMembers: OrganizationWithFullMembers) {
    return {
        ...orgWithMembers,
        tin: orgWithMembers.tin ? `***-**-${decryptData(orgWithMembers.tin).slice(-4)}` : null,
        members: orgWithMembers.members.map(member => (
            { ...member, user: { ...member.user, ssn: member.user.ssn ? `***-**-${decryptData(member.user.ssn).slice(-4)}` : null } }))
    }
}