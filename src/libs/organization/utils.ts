import type { Organization } from '@prisma/client';
import type {
  OrganizationWithFullMembers,
  OrganizationWithMembersAndAddress,
} from '../types';

export function sanitizeOrganization(
  organization: Organization | OrganizationWithMembersAndAddress
) {
  return {
    ...organization,
    tin: organization.tin ? `***-**-${organization.tin.slice(-4)}` : null,
  };
}

export function sanitizeOrganizationWithMembers(
  orgWithMembers: OrganizationWithFullMembers
) {
  return {
    ...orgWithMembers,
    tin: orgWithMembers.tin ? `***-**-${orgWithMembers.tin.slice(-4)}` : null,
    members: orgWithMembers.members.map(member => ({
      ...member,
      user: {
        ...member.user,
        ssn: member.user.ssn ? `***-**-${member.user.ssn.slice(-4)}` : null,
      },
    })),
  };
}
