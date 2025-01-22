import { HubspotContactCreateUpdateSchema } from '@/libs/hubspot/schema';
import {
  formatDateForHubspot,
  getHubspotContactsWithoutSignupDate,
  updateHubspotContact,
} from '@/libs/hubspot/utils';
import { isAdminUser } from '@/libs/maintenance/utils';
import { errorResponse, getErrorMessage, jsonResponse } from '@/libs/utils';
import { clerkClient, currentUser, User } from '@clerk/nextjs/server';

export async function POST() {
  console.log('Filling Hubspot signup date for contacts without signup date');
  const clerkUser = await currentUser();
  if (!clerkUser) return jsonResponse({ error: 'User not found' }, 404);
  if (!(await isAdminUser(clerkUser.id))) {
    return jsonResponse({ error: 'User is not an admin' }, 403);
  }
  try {
    const contactsWoDate = await getHubspotContactsWithoutSignupDate();
    console.log(`Found ${contactsWoDate.length} contacts without signup date`);

    for (const contact of contactsWoDate) {
      if (!contact.properties.userid) return;

      console.log(
        `Processing contact ${contact.id}, ${contact.properties.email}`
      );

      let clerkUser: User | null = null;
      try {
        clerkUser = await clerkClient.users.getUser(contact.properties.userid);
      } catch (__error) {
        console.error(
          `Error fetching clerk user with id ${contact.properties.userid}`
        );
      }
      if (!clerkUser) {
        console.error(
          `Clerk user with id ${contact.properties.userid} not found`
        );
        continue;
      }
      const hsUserData: HubspotContactCreateUpdateSchema = {
        email: contact.properties.email!,
        hubspotId: contact.id,
        properties: {
          date_signed_up: formatDateForHubspot(new Date(clerkUser.createdAt)),
        },
      };
      await updateHubspotContact(hsUserData);
    }

    return jsonResponse(contactsWoDate);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500);
  }
}
